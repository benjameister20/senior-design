import React from 'react';

import axios from "axios";
import { CSVLink } from "react-csv";

import {
	Button,
	Paper,
	Grid,
    Typography,
    Modal,
    Fade,
    Backdrop,
    withStyles,
    TextField
} from '@material-ui/core/';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import TrackChangesIcon from '@material-ui/icons/TrackChanges';
import { AssetCommand } from '../enums/AssetCommands.ts'
import getURL from '../../helpers/functions/GetURL';
import * as AssetConstants from "../AssetConstants";

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

class ExportAsset extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            csvData: "",
            changePlanModal: false,
            changeDescriptionModal: false,
            canCreateChangePlans: false,
		};
    }

    componentDidMount = () => {
        this.setState({ canCreateChangePlans: (this.props.privilege.admin || this.props.privilege.asset || this.props.privilege.datacenters.length > 0) });
    }

	downloadTable = () => {
        axios.post(
            getURL(AssetConstants.ASSETS_MAIN_PATH, AssetCommand.EXPORT_FILE),
            {
                'filter':{},
                "datacenter_name":"",
            }
            ).then(response => {
                console.log(response);
                this.setState({ csvData: response.data.csvData });
                this.csvLink.link.click();
            });
    }

    openChangePlanModal = () => {
        this.setState({ changePlanModal: true });
    }

    closeChangePlanModal = () => {
        this.setState({ changePlanModal: false });
    }

    updatePlanName = (event) => {
        this.setState({ changePlanName: event.target.value });
    }

    beginChangePlan = () => {
        this.closeChangePlanModal();
        this.setState({ changeDescriptionModal: true });

        axios.post(
            getURL(AssetConstants.CHANGE_PLAN_PATH, AssetCommand.CHANGE_PLAN_CREATE),
            {
                'owner': this.props.username,
                'name': this.state.changePlanName,
            }
            ).then(response => {
                console.log(response);
                this.props.updateChangePlan(true, response.data.change_plan);
                this.setState({ changePlanName: "" });
        });
    }

    closeDescriptionModal = () => {
        this.setState({ changeDescriptionModal: false });
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <Paper elevation={3}>
                <Grid
                    container
                    spacing={2}
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                    style={{"padding": "10px"}}
                >
                    <Grid item xs={12}>
                        <Typography variant="h6">Export</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography>Download what is currently shown in the table.</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            onClick={() => {this.downloadTable()}}
                            variant="contained"
                            color="primary"
                            startIcon={<CloudDownloadIcon />}
                            style={{
                                width: "100%"
                            }}
                        >
                            Export All Data
                        </Button>
                    </Grid>
                    { !this.props.changePlanActive && this.state.canCreateChangePlans ?
                    <Grid container item direciton="row" justify="center" alignItems="center" xs={12}>
							<hr style={{width: "5vw"}} />
							<Typography color="textSecondary">
								Or
							</Typography>
							<hr style={{width: "5vw"}} />
						</Grid> : null }
                    { !this.props.changePlanActive && this.state.canCreateChangePlans ?
						<Grid item xs={12}>
							<Button
								variant="contained"
								color="default"
								style={{width: "100%"}}
								startIcon={<TrackChangesIcon />}
								onClick={this.openChangePlanModal}
							>
								Create Change Plan
							</Button>
						</Grid> : null }
                </Grid>
            </Paper>

			<CSVLink
                data={this.state.csvData}
				filename={AssetConstants.ASSET_DOWNLOAD_FILE_NAME}
				className="hidden"
				ref={(r) => this.csvLink = r}
				target="_blank"
			/>


            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={this.state.changePlanModal}
                onClose={this.closeChangePlanModal}
                closeAfterTransition
            >
                <Fade in={this.state.changePlanModal}>
                    <Backdrop
                        open={this.state.changePlanModal}
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
                                    Enter plan name:
                                </Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <TextField type="text" id="change-plan-name" variant="outlined" label="Change Plan Name" name="change-plan-name" onChange={this.updatePlanName} style={{ width: "100%" }} />
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={this.beginChangePlan}
                                    style={{width: "100%"}}
                                >
                                    Begin
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={this.closeChangePlanModal}
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
                                    onClick={this.closeDescriptionModal}
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

            </div>
        );
    }
}

export default withStyles(useStyles)(ExportAsset);
