import React from "react"

import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import {
    Grid,
    Typography
} from "@material-ui/core/";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { TextField } from '@material-ui/core';

import { LogCommand } from "../enums/LogCommands.ts";
import getURL from "../../helpers/functions/GetURL";
import * as Constants from "../../Constants";
import ErrorBoundary from "../../errors/ErrorBoundry";

const useStyles = {
    table: {
      minWidth: 650,
    },
    searchbar: {
        minWidth: "200px",
        flexGrow: 1,
    },
  };

function makeTableData(index, timestamp, type, message) {
    return { index, timestamp, type, message };
}

const typeKey = "type";
const timestampKey = "timestamp";
const USER_KEY = "user";
const ASSET_KEY = "assets";

class LogsView extends React.Component  {
    constructor(props) {
        super(props);

        this.state = {
            logItems:[],
            filteredLogs:[],
            allLogs:null,
            filterUser:"",
            filterAsset:"",
        };
    }

    componentDidMount() {
        this.getLogs();
    }

    getLogs = () => {
        axios.get(getURL(Constants.LOGS_MAIN_PATH, LogCommand.GET_LOGS)).then(response => {
            this.parseLog(response.data.log);
            this.filter();
        });
    }

    parseLog = (logs) => {
        var items = [];
        logs.map((log, index) => {
            var message = "";
            Object.entries(log).map(([key, value]) => {
                if (key === typeKey || key === timestampKey) {
                    return;
                }
                message += value + "\n";
            });
            items.push(makeTableData(index, log[timestampKey], log[typeKey], message));
        });

        this.setState({ logItems: items, filteredLogs:items, allLogs:logs });
    }

    filter = () => {
        var user = this.state.filterUser;
        var asset = this.state.filterAsset;
        var filteredItems = [];

        this.state.allLogs.map(entry => {
            console.log(entry);
            var hasAsset = false;
            var hasUser = false;

            try {
                if (entry.message.match(/\[.+\]/)[0].includes(user)) {
                    hasUser = true;
                }
            } catch {
                hasUser = false;
            }


            try {
                if (asset !== "") {
                    var assetNum = "" + entry.request.asset_number
                    if (assetNum.includes(asset)) {
                        hasAsset = true;
                    }
                } else {
                    hasAsset = true;
                }
            } catch {
                hasAsset = false;
            }

            if (hasAsset && hasUser) {
                filteredItems.push(entry);
            }
        });

        filteredItems.sort(function(a, b) {
            if (a.timestamp > b.timestamp) return -1;
            if (a.timestamp < b.timestamp) return 1;
            return 0;
        })

        this.setState({ filteredLogs:filteredItems });
    }

    updateFilterUser = (event) => {
        this.setState({ filterUser: event.target.value }, () => { this.filter() });
    }

    updateFilterAsset = (event) => {
        this.setState({ filterAsset: event.target.value }, () => { this.filter() });
    }

    render() {
        const { classes } = this.props;

        return (
            <React.Fragment>
                <ErrorBoundary>
                    <Grid
                        container
                        spacing={5}
                        direction="row"
                        justify="flex-start"
                        alignItems="center"
                        style={{margin: "0px", maxWidth: "95vw"}}
                    >
                        <Grid item xs={12}>
                            <Typography variant="h4">
                                Logs
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={this.getLogs}
                            >
                                Refresh Logs
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                className={classes.searchbar}
                                name={"filter-users"}
                                placeholder="Search users"
                                fullWidth
                                onChange={this.updateFilterUser}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                className={classes.searchbar}
                                name={"filter-assets"}
                                placeholder="Search assets"
                                fullWidth
                                onChange={this.updateFilterAsset}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TableContainer component={Paper}>
                                <Table className={classes.table} aria-label="simple table">
                                    <TableHead>
                                    <TableRow>
                                        <TableCell align="left"><span id={"timestamp"} style={{fontWeight: "bold"}}>Timestamp</span></TableCell>
                                        <TableCell align="left"><span id={"type"} style={{fontWeight: "bold"}}>type</span></TableCell>
                                        <TableCell align="left"><span id={"message"} style={{fontWeight: "bold"}}>Message</span></TableCell>
                                    </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {this.state.filteredLogs.map(logItem => (
                                        <TableRow key={logItem.timestamp}>
                                            <TableCell aligh="left">{logItem.timestamp}</TableCell>
                                            <TableCell align="left">{logItem.type}</TableCell>
                                            <TableCell align="left">{logItem.message}</TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </ErrorBoundary>
            </React.Fragment>
        );
    }
}

export default withStyles(useStyles)(LogsView);
