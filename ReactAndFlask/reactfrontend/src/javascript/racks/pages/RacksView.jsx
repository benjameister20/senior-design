import React from 'react';

import axios from 'axios';

import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { MenuItem, Button, TextField } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

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
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
      },
  });

class RacksView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            firstRack: 'A1',
            secondRack: 'A1',
            firstNumber:1,
            endingNumber:1,

            showStatus: false,
            statusMessage: '',
            statusSeverity: 'info',

            showConfirmationBox: false,

            racksList: [],
        };
    }

    componentDidMount() {
        this.getAllRacks();
    }

    handleFormat = (event, newFormats) => {
        if (newFormats.length) {
            this.setState({formats: newFormats});
        }
    };

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
                'start_letter':this.state.firstRack,
                'stop_letter':this.state.secondRack,
                'start_number':this.state.firstNumber,
                'stop_number':this.state.endingNumber,
                "datacenter_name": this.props.datacenter,
            }
            ).then(response => {
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

    changeStartingRack = (event) => {
        this.setState({ firstRack: event.target.value })
    }

    changeEndingRack = (event) => {
        this.setState({ secondRack: event.target.value })
    }

    changeStartingNum = (event) => {
        this.setState({ firstNumber: event.target.value })
    }

    changeEndingNum = (event) => {
        this.setState({ endingNumber: event.target.value })
    }

    closeShowStatus = () => {
        this.setState({ showStatus: false })
    }

    changeRackType = (type) => {
        this.setState({ rackType: type})
    }

    closeConfirmationBox = () => {
        this.setState({ showConfirmationBox: false });
    }

    render() {
        const { classes } = this.props;
        return (
            <ErrorBoundray>
                <Grid container>
                    <Grid item xs={1}>
                        <FormControl>
                                <Select id="starting-letter-selector" value={this.state.firstRack} onChange={this.changeStartingRack}>
                                    {Constants.RackX.map(val => (<MenuItem value={val}>{val}</MenuItem>))}
                                </Select>
                                <FormHelperText>Starting Letter</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={1}>
                        <FormControl>
                                <Select id="ending-letter-selector" value={this.state.secondRack} onChange={this.changeEndingRack}>
                                    {Constants.RackX.map(val => (<MenuItem value={val}>{val}</MenuItem>))}
                                </Select>
                                <FormHelperText>Ending Letter</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                        <FormControl>
                                <TextField
                                    id="starting-num-selector"
                                    type="number"
                                    value={this.state.firstNumber}
                                    onChange={this.changeStartingNum}
                                    InputProps={{ inputProps: { min: 1} }}
                                />
                                <FormHelperText>Starting Number</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={8}>
                        <FormControl>
                                <TextField
                                    id="ending-num-selector"
                                    type="number"
                                    value={this.state.endingNumber}
                                    onChange={this.changeEndingNum}
                                    InputProps={{ inputProps: { min: 1} }}
                                />
                                <FormHelperText>Ending Number</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.viewRacks}
                        >
                            View Racks
                        </Button>
                    </Grid>
                    <Grid item xs={2}>
                        {(this.props.privilege === Privilege.ADMIN) ?
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.createRacks}
                        >
                            Create Racks
                        </Button> : null}
                    </Grid>
                    <Grid item xs={2}>
                        {(this.props.privilege === Privilege.ADMIN) ?
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => this.setState({ showConfirmationBox: true, })}
                        >
                            Delete Racks
                        </Button> : null}
                    </Grid>
                </Grid>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={this.state.showConfirmationBox}
                    onClose={this.closeConfirmationBox}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                    timeout: 500,
                    }}
                >
                    <Fade in={this.state.showConfirmationBox}>
                        <div className={classes.paper}>
                            <Grid container spacing={5}>
                                <Grid item xs={12}>
                                    Are you sure you wish to delete?
                                </Grid>
                                <Grid item xs={2}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={this.deleteRacks}
                                    >
                                        Yes
                                    </Button>
                                </Grid>
                                <Grid item xs={1}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => this.setState({ showConfirmationBox: false, })}
                                    >
                                        No
                                    </Button>
                                </Grid>
                            </Grid>
                        </div>
                    </Fade>
                </Modal>

                <StatusDisplay
                    open={this.state.showStatus}
                    severity={this.state.statusSeverity}
                    closeStatus={this.closeShowStatus}
                    message={this.state.statusMessage}
                />
            </ErrorBoundray>
        );
    }
}

export default withStyles(useStyles)(RacksView);
