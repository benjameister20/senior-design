import React from 'react';

import axios from 'axios';

import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { MenuItem, Button, TextField } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

import { RackCommand } from "../enums/RackCommands.ts";
import { Privilege } from '../../enums/privilegeTypes.ts';
import "../stylesheets/RackStyles.css";

import getURL from '../../helpers/functions/GetURL';
import * as Constants from '../../Constants';
import StatusDisplay from '../../helpers/StatusDisplay';
import ErrorBoundray from '../../errors/ErrorBoundry';

const racksMainPath = 'racks/';

const useStyles = theme => ({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
  });

class RacksView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items:[],
            startingRackLetter:'A',
            endingRackLetter:'A',
            startingRackNumber:1,
            endingRackNumber:1,

            showStatus:false,
            statusMessage:'',
            statusSeverity:'',

            showConfirmationBox:false,

            racksList:[],
        };
    }

    componentDidMount() {
        this.getAllRacks();
    }

    getAllRacks = () => {
        axios.get(getURL(racksMainPath, RackCommand.GET_ALL_RACKS)).then(response => {
                if (response.data.message === 'success') {
                    this.setState({ showStatus: true, statusMessage: "Success", statusSeverity:"success", racksList:response.data.racks })
                } else {
                    this.setState({ showStatus: true, statusMessage: response.data.message, statusSeverity:"error" })
                }
            });
    }

    updateRacks(command) {
        axios.post(
            getURL(racksMainPath, command),
            {
                'start_letter':this.state.startingRackLetter,
                'stop_letter':this.state.endingRackLetter,
                'start_number':this.state.startingRackNumber,
                'stop_number':this.state.endingRackNumber,
                "datacenter_name": this.props.datacenter,
            }
            ).then(response => {
                console.log(response);
                if (response.data.message === 'success') {
                    this.setState({ showStatus: true, statusMessage: "Success", statusSeverity:"success", showConfirmationBox:false });
                    if (command === RackCommand.GET_RACK_DETAILS) {
                        const win = window.open(response.data.link, '_blank');
                        if (win != null) {
                            win.focus();
                        }
                    }
                } else {
                    this.setState({ showStatus: true, statusMessage: response.data.message, statusSeverity:"error" })
                }
            });
    }

    createRacks = () => {
        this.updateRacks(RackCommand.CREATE_RACKS);
    }

    deleteRacks = () => {
        this.updateRacks(RackCommand.DELETE_RACKS);
    }

    viewRacks = () => {
        this.updateRacks(RackCommand.GET_RACK_DETAILS);
    }

    changeStartingLetter = (event) => {
        this.setState({ startingRackLetter: event.target.value })
    }

    changeEndingLetter = (event) => {
        this.setState({ endingRackLetter: event.target.value })
    }

    changeStartingNum = (event) => {
        this.setState({ startingRackNumber: event.target.value })
    }

    changeEndingNum = (event) => {
        this.setState({ endingRackNumber: event.target.value })
    }

    closeShowStatus = () => {
        this.setState({ showStatus: false })
    }

    render() {
        return (
                <ErrorBoundray>
                <StatusDisplay
                    open={this.state.showStatus}
                    severity={this.state.statusSeverity}
                    closeStatus={this.closeShowStatus}
                    message={this.state.statusMessage}
                />
                <FormControl>
                    <div>
                        <Select id="starting-letter-selector" value={this.state.startingRackLetter} onChange={this.changeStartingLetter}>
                            {Constants.RackX.map(val => (<MenuItem value={val}>{val}</MenuItem>))}
                        </Select>
                        <FormHelperText>Starting Letter</FormHelperText>
                    </div>
                </FormControl>
                <FormControl>
                    <div>
                        <Select id="ending-letter-selector" value={this.state.endingRackLetter} onChange={this.changeEndingLetter}>
                            {Constants.RackX.map(val => (<MenuItem value={val}>{val}</MenuItem>))}
                        </Select>
                        <FormHelperText>Ending Letter</FormHelperText>
                    </div>
                </FormControl>
                <FormControl>
                    <div>
                        <TextField
                            id="starting-num-selector"
                            type="number"
                            value={this.state.startingRackNumber}
                            onChange={this.changeStartingNum}
                            InputProps={{ inputProps: { min: 1} }}
                        />
                        <FormHelperText>Starting Number</FormHelperText>
                    </div>
                </FormControl>
                <FormControl>
                    <div>
                        <TextField
                            id="ending-num-selector"
                            type="number"
                            value={this.state.endingRackNumber}
                            onChange={this.changeEndingNum}
                            InputProps={{ inputProps: { min: 1} }}
                        />
                        <FormHelperText>Ending Number</FormHelperText>
                    </div>
                </FormControl>
                <div>
                    <span class="button">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.viewRacks}
                        disabled={this.state.showConfirmationBox}
                    >
                        View
                    </Button>
                    </span>
                    <span>
                        {(this.props.privilege === Privilege.ADMIN) ?
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.createRacks}
                            disabled={this.state.showConfirmationBox}
                        >
                            Create
                        </Button> : null}
                    </span>
                    <span>
                        {(this.props.privilege === Privilege.ADMIN) ?
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => this.setState({ showConfirmationBox: true, })}
                            disabled={this.state.showConfirmationBox}
                        >
                            Delete
                        </Button> : null}
                        </span>
                    </div>
                    {this.state.showConfirmationBox ? <div>
                            Are you sure you wish to delete?
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={this.deleteRacks}
                            >
                                Yes
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => this.setState({ showConfirmationBox: false, })}
                            >
                                No
                            </Button>
                        </div>:null}
            </ErrorBoundray>
        );
    }
}

export default withStyles(useStyles)(RacksView);
