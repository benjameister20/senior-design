import React from 'react';
import axios from 'axios';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import getURL from '../../helpers/functions/GetURL';
import * as Constants from "../../Constants";
import { DatacenterCommand } from "../../racks/enums/DatacenterCommands.ts";
import { StatsCommand } from "../enums/StatsCommands.ts";
import JSONtoArr from "../../helpers/functions/JSONtoArr";
import StatusDisplay from '../../helpers/StatusDisplay';
import ErrorBoundray from '../../errors/ErrorBoundry';
import { Select, MenuItem, InputLabel, Grid, Paper, Typography, Button } from '@material-ui/core';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@material-ui/core';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';

const statsMainPath = 'stats/';
const tables = {
    "totalUsage":"Total Usage",
    "spaceUsage": "Space Usage",
    "vendorUsage": "Vendor Usage",
    "modelUsage": "Model Usage",
    "ownerUsage": "Owner Usage",
}

const tableCols = {
    "totalUsage":["Total", "Usage"],
    "spaceUsage": ["Rack", "Usage"],
    "vendorUsage": ["Vendor", "Usage"],
    "modelUsage": ["Model", "Usage"],
    "ownerUsage": ["Ownder", "Usage"],
}

export default class StatisticsView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loadingDatacenters: true,
            datacenterList: [],
            selectedDatacenter: 'All Datacenters',
            tableValues: {
                "totalUsage":[],
                "spaceUsage": [],
                "vendorUsage": [],
                "modelUsage": [],
                "ownerUsage": [],
            },
            totalUsage:[],
            spaceUsage:[],
            vendorUsage:[],
            modelUsage:[],
            ownerUsage:[],

            showStatus:false,
            statusMessage:'',
            statusSeverity:'',
        };

        this.closeShowStatus = this.closeShowStatus.bind(this);
        this.generateReport = this.generateReport.bind(this);

        axios.defaults.headers.common['token'] = this.props.token;
        axios.defaults.headers.common['privilege'] = this.props.privilege;
    }

    componentDidMount() {
        this.getDatacenters();
    }

    getDatacenters = () => {
        axios.get(getURL(Constants.DATACENTERS_MAIN_PATH, DatacenterCommand.GET_ALL_DATACENTERS)).then(
            response => {
                console.log(response);
                this.setState({ datacenterList: response.data.datacenters, loadingDatacenters: false });
            }
        );
    }

    generateReport() {
        axios.post(getURL(statsMainPath, StatsCommand.GENERATE_REPORT), {
            'datacenter_name': this.state.selectedDatacenter.name === "All Datacenters" ? "" : this.state.selectedDatacenter.name,
        }).then(response => {
                try {
                    var data = response.data;
                    var totalUsage = [];
                    var totalUsageRow = ["Total Usage"];
                    totalUsageRow.push(data["totalUsage"]);
                    totalUsage.push(totalUsageRow);

                    var spaceUsage = JSONtoArr(data["spaceUsage"]);
                    if (spaceUsage.length === 0) {
                        spaceUsage.push(["No space is currently being used", []])
                    }
                    var vendorUsage = JSONtoArr(data["vendorUsage"]);
                    if (vendorUsage.length === 0) {
                        vendorUsage.push(["No vendors currently using space", []])
                    }
                    var modelUsage = JSONtoArr(data["modelUsage"]);
                    if (modelUsage.length === 0) {
                        modelUsage.push(["No models currently using space", []])
                    }
                    var ownerUsage = JSONtoArr(data["ownerUsage"]);
                    if (ownerUsage.length === 0) {
                        ownerUsage.push(["No owners currently using space", []])
                    }

                    this.setState({
                        showStatus: true,
                        statusSeverity:"success",
                        statusMessage: "Success",
                        tableValues: {
                            "totalUsage":totalUsage,
                            "spaceUsage": spaceUsage,
                            "vendorUsage": vendorUsage,
                            "modelUsage": modelUsage,
                            "ownerUsage": ownerUsage,
                        },
                     })
                } catch {
                    this.setState({ showStatus: true, statusMessage: response.data.message, statusSeverity:"error" })
                }
            });
    }

    closeShowStatus() {
        this.setState({ showStatus: false })
    }

    render() {
        return (
            <div>
                <ErrorBoundray >
                <StatusDisplay
                    open={this.state.showStatus}
                    severity={this.state.statusSeverity}
                    closeStatus={this.closeShowStatus}
                    message={this.state.statusMessage}
                />
                <Grid
                    container
                    spacing={5}
                    direction="row"
                    justify="center"
                    alignItems="center"
                    style={{margin: "0px", maxWidth: "95vw"}}
                >
                    <Grid item xs={12}>
                        <Typography variant="h4">
                            Reports
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <InputLabel id="datacenter-select-label">Select Datacenter</InputLabel>
                        <Select
                            name='datacenter_name'
                            id="datacenter-select"
                            value={this.state.selectedDatacenter}
                            onChange={(e) => this.setState({ selectedDatacenter: e.target.value })}
                            style={{ width: "100%" }}
                        >
                            <MenuItem value="All Datacenters">All Datacenters</MenuItem>
                            {this.state.datacenterList.map(value => {
                                return (<MenuItem value={value}>{value["name"]}</MenuItem>);
                            })}
                        </Select>
                    </Grid>
                    <Grid item xs={3}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.generateReport}
                            disabled={this.state.loadingDatacenters}
                        >
                            Generate Report
                        </Button>
                    </Grid>
                </Grid>
                <div>

                </div>
                {Object.keys(tables).map(key => (
                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <Typography>{tables[key]}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow >
                                        {tableCols[key].map(column => (<TableCell><span id={column}>{column}</span></TableCell>))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {this.state.tableValues[key].map(row => (
                                    <TableRow>
                                        {row.map(column => (<TableCell><span id={column}>{column + (isNaN(column) ? "" : "%")}</span></TableCell>))}
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                ))}
                </ErrorBoundray>
            </div>
        );
    }
}
