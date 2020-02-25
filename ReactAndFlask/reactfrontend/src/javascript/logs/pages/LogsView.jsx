import React from "react"

import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
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
            this.parseLog(response.data.log)
            console.log(response);
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
        this.filterByUser();
    }

    filterByUser = () => {
        var user = this.state.filterUser;
        var filteredItems = [];

        this.state.logItems.map((log) => {
            var entry = this.state.allLogs[log.index];
            try {
                if (entry.message.match(/\[.+\]/)[0].includes(user)) {
                    filteredItems.push(log);
                }
            } catch {

            }

        });

        let items = (user==="") ? this.state.logItems : filteredItems;
        this.setState({ filteredLogs:items }, () => { this.filterByAsset() });
    }

    filterByAsset = () => {
        var asset = this.state.filterAsset;
        var filteredItems = [];

        this.state.filteredLogs.map((log) => {
            var entry = this.state.allLogs[log.index];
            //console.log(entry);
            try {
                var assetNum = "" + entry.request.asset_number
                if (assetNum.includes(asset)) {
                    filteredItems.push(log);
                }
            } catch {

            }

        });

        let items = (asset==="") ? this.state.filteredLogs.reverse() : filteredItems;
        this.setState({ filteredLogs:items });
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
                <Button
                    variant="contained"
                    color="primary"
                    onClick={this.getLogs}
                >
                    Refresh Logs
                </Button>
                <TextField
                    className={classes.searchbar}
                    name={"filter-users"}
                    placeholder="Search users"
                    fullWidth
                    onChange={this.updateFilterUser}
                />
                <TextField
                    className={classes.searchbar}
                    name={"filter-assets"}
                    placeholder="Search assets"
                    fullWidth
                    onChange={this.updateFilterAsset}
                />
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell align="left">Timestamp</TableCell>
                            <TableCell align="left">type</TableCell>
                            <TableCell align="left">Message</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {this.state.filteredLogs.reverse().map(logItem => (
                            <TableRow key={logItem.timestamp}>
                                <TableCell aligh="left">{logItem.timestamp}</TableCell>
                                <TableCell align="left">{logItem.type}</TableCell>
                                <TableCell align="left">{logItem.message}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </React.Fragment>
        );
    }
}

export default withStyles(useStyles)(LogsView);
