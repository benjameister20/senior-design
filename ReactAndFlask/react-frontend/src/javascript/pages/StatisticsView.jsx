import React from 'react';
import axios from 'axios';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import getURL from '../helpers/functions/GetURL';
import  Button from '@material-ui/core/Button';
import { StatsCommand } from "../enums/statsCommands.ts";
import JSONtoArr from "../helpers/functions/JSONtoArr";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import StatusDisplay from '../helpers/StatusDisplay';
import Paper from '@material-ui/core/Paper';


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

    generateReport() {
        axios.get(getURL(statsMainPath, StatsCommand.GENERATE_REPORT)).then(response => {
                if (response.data.message === 'success') {
                    var data = response.data;

                    var totalUsage = [];
                    var totalUsageRow = ["Total Usage"];
                    totalUsageRow.push(data["totalUsage"]);
                    totalUsage.push(totalUsageRow);

                    var spaceUsage = JSONtoArr(data["spaceUsage"]);
                    var vendorUsage = JSONtoArr(data["vendorUsage"]);
                    var modelUsage = JSONtoArr(data["modelUsage"]);
                    var ownerUsage = JSONtoArr(data["ownerUsage"]);

                    this.setState({
                        showStatus: true,
                        statusMessage: "Success",
                        totalUsage:totalUsage,
                        spaceUsage:spaceUsage,
                        vendorUsage:vendorUsage,
                        modelUsage:modelUsage,
                        ownerUsage:ownerUsage,
                     })
                } else {
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
                <StatusDisplay
                    open={this.state.showStatus}
                    severity={this.state.statusSeverity}
                    closeStatus={this.closeShowStatus}
                    message={this.state.statusMessage}
                />
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.generateReport}
                    >
                        Generate New Report
                    </Button>
                </div>
                {Object.keys(tables).forEach(key => (
                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id={"panel-"+key+"-header"}
                    >
                        <Typography>{tables[key]}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow >
                                        {tableCols[key].map(column => (<TableCell><span id={column}>{column}</span></TableCell>))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {this.state.tableValues[key].map(row => (
                                    <TableRow>
                                        {row.map(column => (<TableCell><span id={column}>{column}</span></TableCell>))}
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                ))}
            </div>
        );
    }
}
