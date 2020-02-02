import React from 'react';
import axios from 'axios';
import { Privilege } from '../enums/privilegeTypes.ts';
import TableView from '../helpers/TableView';
import getURL from '../helpers/functions/GetURL';
import * as Constants from '../Constants';
import StatusDisplay from '../helpers/StatusDisplay';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { MenuItem, Button } from '@material-ui/core';
import { RackCommand } from "../enums/rackCommands.ts";


const racksMainPath = 'racks/';

export default class RacksView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items:[],
            startingRackLetter:'',
            endingRackLetter:'',
            startingRackNumber:-1,
            endingRackNumber:-1,

            showStatus:false,
            statusMessage:'',
            statusSeverity:'',
        };

        this.getAllRacks = this.getAllRacks.bind(this);
        this.updateRacks = this.updateRacks.bind(this);
        this.createRacks = this.createRacks.bind(this);
        this.deleteRacks = this.deleteRacks.bind(this);
        this.showDetailedView = this.showDetailedView.bind(this);
        this.changeStartingLetter = this.changeStartingLetter.bind(this);
        this.changeEndingLetter = this.changeEndingLetter.bind(this);
        this.changeStartingNum = this.changeStartingNum.bind(this);
        this.changeEndingNum = this.changeEndingNum.bind(this);

        axios.defaults.headers.common['token'] = this.props.token;
        axios.defaults.headers.common['privilege'] = this.props.privilege;

    }

    getAllRacks() {
        axios.get(getURL(racksMainPath, RackCommand.GET_ALL_RACKS)).then(response => {
                if (response.data.message === 'success') {
                    this.setState({ showStatus: true, statusMessage: "Success" })
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
            }
            ).then(response => {
                if (response.data.message === 'success') {
                    this.setState({ showStatus: true, statusMessage: "Success" })
                } else {
                    this.setState({ showStatus: true, statusMessage: response.data.message, statusSeverity:"error" })
                }
            });
    }

    createRacks() {
        this.updateRacks(RackCommand.CREATE_RACKS);
    }

    deleteRacks() {
        this.updateRacks(RackCommand.DELETE_RACKS);
    }

    showDetailedView() {
        this.updateRacks(RackCommand.GET_RACK_DETAILS);
    }

    changeStartingLetter(event) {
        this.setState({ startingRackLetter: event.target.value })
    }

    changeEndingLetter(event) {
        this.setState({ endingRackLetter: event.target.value })
    }

    changeStartingNum(event) {
        this.setState({ startingRackNumber: event.target.value })
    }

    changeEndingNum(event) {
        this.setState({ endingRackNumber: event.target.value })
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
                <FormControl>
                    <Select id="starting-letter-selector" value={this.state.startingRackLetter} onChange={this.changeStartingLetter}>
                        {Constants.RackX.map(val => (<MenuItem value={val}>{val}</MenuItem>))}
                    </Select>
                    <FormHelperText>Starting Letter</FormHelperText>
                </FormControl>
                <FormControl>
                    <Select id="ending-letter-selector" value={this.state.endingRackLetter} onChange={this.changeEndingLetter}>
                        {Constants.RackX.map(val => (<MenuItem value={val}>{val}</MenuItem>))}
                    </Select>
                    <FormHelperText>Ending Letter</FormHelperText>
                </FormControl>
                <FormControl>
                    <Select id="starting-num-selector" value={this.state.startingRackNumber} onChange={this.changeStartingNum}>
                        {Constants.RackY.map(val => (<MenuItem value={val}>{val}</MenuItem>))}
                    </Select>
                    <FormHelperText>Starting Number</FormHelperText>
                </FormControl>
                <FormControl>
                    <Select id="ending-num-selector" value={this.state.endingRackNumber} onChange={this.changeEndingNum}>
                        {Constants.RackY.map(val => (<MenuItem value={val}>{val}</MenuItem>))}
                    </Select>
                    <FormHelperText>Ending Number</FormHelperText>
                </FormControl>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={this.viewRacks}
                >
                    View
                </Button>
                {(this.props.privilege == Privilege.ADMIN) ?
                (<div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.createRacks}
                    >
                        Create
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.deleteRacks}
                    >
                        Delete
                    </Button>
                </div>):null}

                {/*<TableView
                    columns={columns}
                    vals={this.state.items}
                    keys={columns}
                    showDetailedView={this.showDetailedView}
                    filters={columns}
                />*/}
            </div>
        );
    }
}
