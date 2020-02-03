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
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ErrorBoundray from '../errors/ErrorBoundry';


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

            showConfirmationBox:false,
        };

        this.getAllRacks = this.getAllRacks.bind(this);
        this.updateRacks = this.updateRacks.bind(this);
        this.createRacks = this.createRacks.bind(this);
        this.deleteRacks = this.deleteRacks.bind(this);
        this.viewRacks = this.viewRacks.bind(this);
        this.changeStartingLetter = this.changeStartingLetter.bind(this);
        this.changeEndingLetter = this.changeEndingLetter.bind(this);
        this.changeStartingNum = this.changeStartingNum.bind(this);
        this.changeEndingNum = this.changeEndingNum.bind(this);
        this.closeShowStatus = this.closeShowStatus.bind(this);

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
                    this.setState({ showStatus: true, statusMessage: "Success", statusSeverity:"success" })
                } else {
                    this.setState({ showStatus: true, statusMessage: response.data.message, statusSeverity:"error" })
                }

                if (command == RackCommand.GET_RACK_DETAILS) {
                    console.log(response.data);
                    this.setState({ items: response.data.racks });
                }
            });
    }

    createRacks() {
        this.updateRacks(RackCommand.CREATE_RACKS);
    }

    deleteRacks() {
        this.updateRacks(RackCommand.DELETE_RACKS);
    }

    viewRacks() {
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

    closeShowStatus() {
        this.setState({ showStatus: false })
    }

    render() {
        return (
            <div>
                <ErrorBoundray>
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
                    disabled={this.state.showConfirmationBox}
                >
                    View
                </Button>
                {(this.props.privilege == Privilege.ADMIN) ?
                (<div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.createRacks}
                        disabled={this.state.showConfirmationBox}
                    >
                        Create
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => this.setState({ showConfirmationBox: true, })}
                        disabled={this.state.showConfirmationBox}
                    >
                        Delete
                    </Button>
                </div>):null}

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

                    {this.state.items.map(rack => (
                    <ExpansionPanel>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                        >
                            <Typography>{rack.label}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            {rack}
                            {/*<TableContainer component={Paper}>
                                <Table>
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
                            </TableContainer>*/}
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    ))}
                </ErrorBoundray>
            </div>
        );
    }
}
