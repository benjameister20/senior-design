// React
import React from 'react';
import axios from 'axios';

// Helpers
import getURL from '../../helpers/functions/GetURL';
import StatusDisplay from '../../helpers/StatusDisplay';
import ErrorBoundray from '../../errors/ErrorBoundry';
import { AssetCommand } from '../../assets/enums/AssetCommands.ts';

// Material UI Core
import { Grid, Paper, Typography, Button, withStyles} from '@material-ui/core';
import { Modal, Fade, Backdrop, TextField, Chip } from '@material-ui/core';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@material-ui/core';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';

// Icons
import EditIcon from '@material-ui/icons/Edit';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import DeleteIcon from '@material-ui/icons/Delete';
import ReplayIcon from '@material-ui/icons/Replay';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DoneIcon from '@material-ui/icons/Done';

// Path prefix for change plan routes
const changePlanPath = "changeplans/";

// CSS styles
const useStyles = theme => ({
    root: {
      flexGrow: 1,
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%",
      },
      grid: {
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[5],
          padding: theme.spacing(2, 4, 3),
          width: "50%"
      },
      progress: {
        display: 'flex',
        '& > * + *': {
          marginLeft: theme.spacing(2),
        },
      },
});

// A view to display a user's change plans
class ChangePlansView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // Status snackbar
            showStatus: false,
            statusMessage: '',
            statusSeverity: '',

            // Change plans
            changePlans: [],

            // Change plan actions
            changePlanDetails: {},

            // Dialog to rename a change plan
            renameDialog: false,

            // Name to rename a change plan
            planName: "",

            // Id of change plan to rename
            planId: null,

            // Dialog to execute a change plan
            executeDialog: false,

            // Id of change plan to execute
            executeId: null,

            // Dialog to delete a change plan
            deleteDialog: false,

            // Id of change plan to delete
            deleteId: null,

            // Modal to inform user of change plan mode
            changeDescriptionModal: false,

            // Id of plan to edit
            editId: null,

            // Step of plan to edit
            editStep: null,

            // Name of plan to edit
            editName: "",
        };

        // Axios network request headers
        axios.defaults.headers.common['token'] = this.props.token;
        axios.defaults.headers.common['privilege'] = this.props.privilege;
    }

    // When component appears on screen
    componentDidMount() {
        this.fetchAllChangePlans();
    }

    // Get all change plans for the user
    fetchAllChangePlans = () => {
        axios.post(
            getURL(changePlanPath, AssetCommand.CHANGE_PLAN_GET_PLANS), {
                'owner': this.props.username,
            }).then(response => {
                var change_plans = response.data.change_plans;
                if (change_plans !== null) {
                    this.setState({ changePlans: change_plans });

                    // For each change plan, grab details/actions
                    change_plans.forEach(plan => {
                        axios.post(
                            getURL(changePlanPath, AssetCommand.CHANGE_PLAN_GET_ACTIONS), {
                                'change_plan_id': plan.identifier,
                                'owner': this.props.username,
                            }).then(response => {
                                var details = this.state.changePlanDetails;
                                console.log(response.data.change_plan_actions);
                                details[plan.identifier] = response.data.change_plan_actions;

                                this.setState({ changePlanDetails: details });
                            });
                    });
                }
            }
        );
    }

    closeShowStatus = () => {
        this.setState({ showStatus: false })
    }

    // Enter change plan mode for the given change plan unique id
    startEditing = () => {
        this.closeDescriptionModal();
        this.props.updateChangePlan(true, this.state.editId, this.state.editStep, this.state.editName);
    }

    // Saves the plan name
    updatePlanName = (event) => {
        this.setState({ planName: event.target.value });
    }

    // Change the name of the change plan with the given unique id
    renameChangePlan = () => {
        this.closeRenameDialog();

        axios.post(
            getURL(changePlanPath, AssetCommand.CHANGE_PLAN_EDIT), {
                'change_plan_id': this.state.planId,
                'name': this.state.planName,
                'owner': this.props.username,
            }).then(response => {
                this.setState({ planId: null, planName: "" });
                this.fetchAllChangePlans();
            }
        );
    }

    // Open the dialog to rename the change plan for the given unique id
    openRenameDialog = (identifier) => {
        this.setState({ renameDialog: true, planId: identifier });
    }

    // Close the dialog to rename the change plan
    closeRenameDialog = () => {
        this.setState({ renameDialog: false });
    }

    // Open the dialog to execute the change plan for the given unique id
    openExecuteDialog = (identifier) => {
        this.setState({ executeDialog: true, executeId: identifier });
    }

    // Close the dialog to execute the change plan
    closeExecuteDialog = () => {
        this.setState({ executeDialog: false });
    }

    // Execute the change plan
    executeChangePlan = () => {
        this.closeExecuteDialog();

        axios.post(
            getURL(changePlanPath, AssetCommand.CHANGE_PLAN_EXECUTE), {
                'change_plan_id': this.state.executeId,
                'owner': this.props.username,
            }).then(response => {
                this.setState({ executeId: null });
                this.fetchAllChangePlans();
            }
        );
    }

    // Open the dialog to delete the change plan for the given unique id
    openDeleteDialog = (identifier) => {
        this.setState({ deleteDialog: true, deleteId: identifier });
    }

    // Close the dialog to delete the change plan
    closeDeleteDialog = () => {
        this.setState({ deleteDialog: false });
    }

    // Delete the change plan
    deleteChangePlan = () => {
        this.closeDeleteDialog();

        axios.post(
            getURL(changePlanPath, AssetCommand.CHANGE_PLAN_DELETE), {
                'change_plan_id': this.state.deleteId,
                'owner': this.props.username,
            }).then(response => {
                this.setState({ deleteId: null });
                this.fetchAllChangePlans();
            }
        );
    }

    // Open the description modal
    openDescriptionModal = (identifier, currentStep, name) => {
        this.setState({ editId: identifier, editStep: currentStep, editName: name, changeDescriptionModal: true });
    }

    // Close the description modal
    closeDescriptionModal = () => {
        this.setState({ changeDescriptionModal: false });
    }

    // Concatenate network port summaries
    reducePorts = (portList) => {
        var result = ""

        portList.forEach(port => {
            if (port.connection_hostname.length > 0) {
                result += "Host: " + port.connection_hostname + " ";
            }

            if (port.connection_port.length > 0) {
                result += "Port: " + port.connection_port + " ";
            }

            if (port.mac_address.length > 0) {
                result += "Mac: " + port.mac_address + " ";
            }
        });

        return result;
    }

    // Convert keys from backend to user friendly display names
    lookup = (key) => {
        return {
            "asset_numberOriginal": "Asset Number",
            "model": "Model",
            "hostname": "Hostname",
            "rack": "Rack",
            "rack_position": "Rack Position",
            "owner": "Owner",
            "comment": "Comment",
            "datacenter_name": "Datacenter",
            "tags": "Tags",
            "network_connections": "Network Connections",
            "power_connections": "Power Connections",
            'asset_number': "Asset Number",
        }[key];
    }

    render() {
        const { classes } = this.props;

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
                            Change Plans
                        </Typography>
                    </Grid>
                    <Grid item xs={5}></Grid>
                    <Grid item xs={2}>
                        <Typography>
                            { this.state.changePlans.length > 0 ? "Saved change plans" : "You have no change plans! Create one in the Asset tab."}
                        </Typography>
                    </Grid>
                    <Grid item xs={5}></Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={8}>
                        { this.state.changePlans.map(plan => {
                            const executed = plan.executed === "True";
                            const details = this.state.changePlanDetails[plan.identifer];
                            var step = 1;
                            if (details !== undefined) {
                                details.forEach(s => {
                                    step = Math.max(step, s.step);
                                });
                            }

                            return (<ExpansionPanel key={plan.identifier}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    <Typography>{plan.name}</Typography>
                                    { executed ? <Chip size="small" icon={<DoneIcon />} color="primary" label={"Executed at " + plan.timestamp} style={{
                                        marginLeft: "15px"
                                    }} /> : null }
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                <Grid
                                    container
                                    spacing={3}
                                    direction="row"
                                    justify="center"
                                    alignItems="center"
                                    style={{margin: "0px", maxWidth: "95vw"}}
                                >
                                    <Grid item xs={3}></Grid>
                                    <Grid item xs={3}>
                                        { !executed ?
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        style={{width: "100%"}}
                                        startIcon={<ReplayIcon />}
                                        onClick={() => { this.openRenameDialog(plan.identifier) }}
                                    >
                                        Rename
                                    </Button> : null }
                                    </Grid>
                                    <Grid item xs={3}>
                                    { !executed ? <Button
                                        variant="contained"
                                        color="default"
                                        style={{width: "100%"}}
                                        startIcon={<EditIcon />}
                                        onClick={() => { this.openDescriptionModal(plan.identifier, step, plan.name) }}
                                    >
                                        Edit
                                    </Button> : null }
                                    </Grid>
                                    <Grid item xs={3}></Grid>
                                <Grid item xs={12}>
                                { this.state.changePlanDetails[plan.identifier] !== undefined ?
                                    this.state.changePlanDetails[plan.identifier].map(detail => {
                                        var diff = detail.diff;
                                        var isCreate = detail.action === "create";
                                        return (<div><TableContainer component={Paper}>
                                                    <Typography style={{margin: "10px"}}>
                                                    { detail.action.charAt(0).toUpperCase() + detail.action.slice(1) } Asset Number: {
                                                        detail.new_record.asset_numberOriginal === undefined ?
                                                        detail.new_record.asset_number : detail.new_record.asset_numberOriginal
                                                    }</Typography>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow >
                                                                <TableCell>Field</TableCell>
                                                                { isCreate ? <TableCell>Value</TableCell> : <TableCell>Current</TableCell>}
                                                                { isCreate ? null : <TableCell>New</TableCell> }
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                        {Object.keys(diff).map(key => {
                                                            if (key === "tags") {
                                                                return null;
                                                            }

                                                            return isCreate ?
                                                                (
                                                                    <TableRow>
                                                                        <TableCell>{this.lookup(key)}</TableCell>
                                                                        <TableCell>
                                                                            { (key !== "power_connections") ? (key === "network_connections" ? Object.keys(diff[key]).length : diff[key]) : diff[key].length }
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ) :
                                                                (
                                                                    <TableRow>
                                                                        <TableCell>{this.lookup(key)}</TableCell>
                                                                        <TableCell>{ key !== "network_connections" ? diff[key][0] : this.reducePorts(diff[key][0])}</TableCell>
                                                                        <TableCell>{ key !== "network_connections" ? diff[key][1] : this.reducePorts(diff[key][1])}</TableCell>
                                                                    </TableRow>
                                                                )
                                                        }
                                                        )}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer><br /></div>);
                                    })
                                    : "This change plan has made no changes!" }
                                </Grid>
                                <Grid item xs={3}>
                                    { !executed ? <Button
                                        variant="contained"
                                        color="primary"
                                        style={{width: "100%"}}
                                        startIcon={<PlayArrowIcon />}
                                        onClick={() => { this.openExecuteDialog(plan.identifier) }}
                                    >
                                        Execute
                                    </Button> : null }
                                    </Grid>
                                    <Grid item xs={3}>
                                    { !executed ? <Button
                                        variant="contained"
                                        color="secondary"
                                        style={{width: "100%"}}
                                        startIcon={<DeleteIcon />}
                                        onClick={() => { this.openDeleteDialog(plan.identifier) }}
                                    >
                                        Delete
                                    </Button> : null }
                                </Grid>
                                </Grid>

                                </ExpansionPanelDetails>
                            </ExpansionPanel>);
                        })
                        }
                    </Grid>
                    <Grid item xs={2}></Grid>
                </Grid>


                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={this.state.renameDialog}
                    onClose={this.closeRenameDialog}
                    closeAfterTransition
                >
                <Fade in={this.state.renameDialog}>
                    <Backdrop
                        open={this.state.renameDialog}
                    >
                    <div className={classes.grid}>
                        <Grid
                            container
                            spacing={1}
                            direction="row"
                            justify="flex-start"
                            alignItems="center"
                        >
                            <Grid item xs={3}>
                                <Typography>
                                    New plan name:
                                </Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <TextField type="text" id="change-plan-name" variant="outlined" label="Change Plan Name" name="change-plan-name" onChange={this.updatePlanName} style={{ width: "100%" }} />
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={this.renameChangePlan}
                                    style={{width: "100%"}}
                                >
                                    Save
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={this.closeRenameDialog}
                                    style={{width: "100%"}}
                                >
                                    Cancel
                                </Button>
                            </Grid>

                        </Grid>
                        </div>
                </Backdrop>
                </Fade>
            </Modal>

            <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={this.state.executeDialog}
                    onClose={this.closeExecuteDialog}
                    closeAfterTransition
                >
                <Fade in={this.state.executeDialog}>
                    <Backdrop
                        open={this.state.executeDialog}
                    >
                    <div className={classes.grid}>
                        <Grid
                            container
                            spacing={1}
                            direction="row"
                            justify="flex-start"
                            alignItems="center"
                        >
                            <Grid item xs={3}>
                                <Typography>
                                    Are you sure you want to execute this change plan?
                                </Typography>
                            </Grid>
                            <Grid item xs={9}></Grid>
                            <Grid item xs={6}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={this.executeChangePlan}
                                    style={{width: "100%"}}
                                >
                                    Yes
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={this.closeExecuteDialog}
                                    style={{width: "100%"}}
                                >
                                    Cancel
                                </Button>
                            </Grid>

                        </Grid>
                        </div>
                </Backdrop>
                </Fade>
            </Modal>


            <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={this.state.deleteDialog}
                    onClose={this.closeDeleteDialog}
                    closeAfterTransition
                >
                <Fade in={this.state.deleteDialog}>
                    <Backdrop
                        open={this.state.deleteDialog}
                    >
                    <div className={classes.grid}>
                        <Grid
                            container
                            spacing={1}
                            direction="row"
                            justify="flex-start"
                            alignItems="center"
                        >
                            <Grid item xs={3}>
                                <Typography>
                                    Are you sure you want to delete this change plan?
                                </Typography>
                            </Grid>
                            <Grid item xs={9}></Grid>
                            <Grid item xs={6}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={this.deleteChangePlan}
                                    style={{width: "100%"}}
                                >
                                    Yes
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={this.closeDeleteDialog}
                                    style={{width: "100%"}}
                                >
                                    Cancel
                                </Button>
                            </Grid>

                        </Grid>
                        </div>
                </Backdrop>
                </Fade>
            </Modal>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={this.state.changeDescriptionModal}
                onClose={this.closeDescriptionModal}
                closeAfterTransition
            >
                <Fade in={this.state.changeDescriptionModal}>
                    <Backdrop
                        open={this.state.changeDescriptionModal}
                    >
                    <div className={classes.grid}>
                        <Grid
                            container
                            spacing={1}
                            direction="row"
                            justify="flex-start"
                            alignItems="center"
                        >
                            <Grid item xs={3}>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>
                                    You are now in change plan mode. All changes made will be logged to the change plan and will not actually be made in the system. Use the icon in the bottom right corner to exit change plan mode!
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                            </Grid>
                            <Grid item xs={3}>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={this.startEditing}
                                    style={{width: "100%"}}
                                >
                                    Ok
                                </Button>
                            </Grid>
                            <Grid item xs={3}>
                            </Grid>
                        </Grid>
                        </div>
                </Backdrop>
                </Fade>
            </Modal>


                </ErrorBoundray>
            </div>
        );
    }
}

export default withStyles(useStyles)(ChangePlansView);
