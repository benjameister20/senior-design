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
import { Modal, Fade, Backdrop, TextField } from '@material-ui/core';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@material-ui/core';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';

// Icons
import EditIcon from '@material-ui/icons/Edit';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import DeleteIcon from '@material-ui/icons/Delete';
import ReplayIcon from '@material-ui/icons/Replay';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
            deleteId: null
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
    startEditing = (identifier) => {
        this.props.updateChangePlan(true, identifier);
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
                            Saved changed plans
                        </Typography>
                    </Grid>
                    <Grid item xs={5}></Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={8}>
                        { this.state.changePlans.map(plan => {
                            return (<ExpansionPanel key={plan.identifier}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    <Typography>{plan.name}</Typography>
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
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        style={{width: "100%"}}
                                        startIcon={<ReplayIcon />}
                                        onClick={() => { this.openRenameDialog(plan.identifier) }}
                                    >
                                        Rename
                                    </Button>
                                    </Grid>
                                    <Grid item xs={3}>
                                    <Button
                                        variant="contained"
                                        color="default"
                                        style={{width: "100%"}}
                                        startIcon={<EditIcon />}
                                        onClick={() => { this.startEditing(plan.identifier) }}
                                    >
                                        Edit
                                    </Button>
                                    </Grid>
                                    <Grid item xs={3}></Grid>
                                <Grid item xs={12}>
                                { this.state.changePlanDetails[plan.identifier] !== undefined ?
                                    this.state.changePlanDetails[plan.identifier].map(detail => {
                                        var diff = detail.diff;
                                        var isCreate = detail.action === "create";
                                        console.log(detail.new_record);
                                        return (<TableContainer component={Paper}>
                                                    <Typography>
                                                    { detail.action.charAt(0).toUpperCase() + detail.action.slice(1) } Asset Number: {
                                                        detail.new_record.asset_numberOriginal === undefined ?
                                                        detail.new_record.asset_number : detail.new_record.asset_numberOriginal
                                                    }</Typography>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow >
                                                                <TableCell>Field</TableCell>
                                                                { isCreate ? <TableCell>Value</TableCell> : <TableCell>Old</TableCell>}
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
                                                                            { (key !== "power_connections" && key !== "network_connections") ? diff[key] : "" }
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ) :
                                                                (
                                                                    <TableRow>
                                                                        <TableCell>{this.lookup(key)}</TableCell>
                                                                        <TableCell>{diff[key][0]}</TableCell>
                                                                        <TableCell>{diff[key][1]}</TableCell>
                                                                    </TableRow>
                                                                )
                                                        }
                                                        )}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>);
                                    })
                                    : "This change plan has made no changes!" }
                                </Grid>
                                <Grid item xs={3}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        style={{width: "100%"}}
                                        startIcon={<PlayArrowIcon />}
                                        onClick={() => { this.openExecuteDialog(plan.identifier) }}
                                    >
                                        Execute
                                    </Button>
                                    </Grid>
                                    <Grid item xs={3}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        style={{width: "100%"}}
                                        startIcon={<DeleteIcon />}
                                        onClick={() => { this.openDeleteDialog(plan.identifier) }}
                                    >
                                        Delete
                                    </Button>
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


                </ErrorBoundray>
            </div>
        );
    }
}

export default withStyles(useStyles)(ChangePlansView);