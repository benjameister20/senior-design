import React from "react";

import axios from "axios";

import TextField from "@material-ui/core/TextField";
import { Button, InputLabel, Select, MenuItem } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';


import * as Constants from "../../Constants";
import { DatacenterCommand } from "../enums/DatacenterCommands";
import getURL from "../../helpers/functions/GetURL";


const offlineStorageVal = "offlineStorage";
const datacenterVal = "datacenter";

const useStyles = theme => ({
	root: {
		width: '100%',
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

class CreateDatacenter extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			showCreate: false,
			datacenterName: "",
			datacenterAbbreviation: "",
			showStatus: false,
			statusSeverity: "",
			statusMessage: "",
			siteType: datacenterVal,
		};
	}

	generateCreateJSON = () => {
		return {
			"abbreviation": this.state.datacenterAbbreviation,
			"datacenter_name": this.state.datacenterName,
			"is_offline_storage": this.state.siteType === offlineStorageVal,
		}
	}

	createDatacenter = () => {
		axios.post(
			getURL(Constants.DATACENTERS_MAIN_PATH, DatacenterCommand.CREATE), this.generateCreateJSON()).then(
				response => {
					console.log(response);
					if (response.data.message === "success") {
						this.setState({
							showCreate: false,
							datacenterName: "",
							datacenterAbbreviation: "",
						}, () => this.props.search());
					} else {
						this.setState({
							showStatus: true,
							statusSeverity: "error",
							statusMessage: response.data.message,
						})
					}
				});
	}

	updateDatacenterName = (event) => {
		this.setState({ datacenterName: event.target.value });
	}

	updateDatacenterAbbrevation = (event) => {
		this.setState({ datacenterAbbreviation: this.getAbbreviation(event.target.value) });
	}

	getAbbreviation = (val) => {
		if (val.length > 6) {
			return val.substring(0, 7);
		}

		return val;
	}

	showCreate = () => {
		this.setState({ showCreate: true });
	}

	closeCreate = () => {
		this.setState({
			showCreate: false,
			datacenterName: "",
			datacenterAbbreviation: "",
		});
	}

	closeStatus = () => {
		this.setState({ showStatus: false, statusSeverity: "", statusMessage: "", });
	}

	selectSiteType = (event) => {
		this.setState({ siteType: event.target.value });
	}

	render() {
		const { classes } = this.props;

		return (
			<React.Fragment>
				<Grid item xs={3}>
					{this.props.datacenterList.length > 0 ? <InputLabel id="datacenter-select-label">Select Site</InputLabel> : null}
					{this.props.datacenterList.length > 0 ? <Select
						name='datacenter_name'
						id="datacenter-select"
						value={this.props.dc}
						onChange={this.props.selectDatacenter}
						style={{ width: "100%" }}
					>
						{this.props.datacenterList.map(value => {
							return (<MenuItem value={value}>{value["name"]}</MenuItem>);
						})}
					</Select> : null}
				</Grid>
				{this.props.disabled ? null :
					<Grid item xs={3}>
						<Button
							variant="contained"
							color="primary"
							onClick={() => { this.showCreate() }}
						>
							Create New Site
            			</Button>
					</Grid>
				}


				<Modal
					aria-labelledby="transition-modal-title"
					aria-describedby="transition-modal-description"
					className={classes.modal}
					open={this.state.showCreate}
					onClose={this.closeCreate}
					closeAfterTransition
					BackdropComponent={Backdrop}
					scroll="body"
					BackdropProps={{
						timeout: 500,
					}}
				>
					<Fade in={this.state.showCreate}>
						<div className={classes.paper}>
							<Grid container spacing={3}>
								<Grid item xs={2}>
									<Typography>Site Name:</Typography>
								</Grid>
								<Grid item xs={9}>
									<TextField
										id="input-rack"
										variant="outlined"
										label={"datacenter-name"}
										name={"datacenter-name"}
										onChange={this.updateDatacenterName}
										required
										fullWidth
									/>
								</Grid>
								<Grid item xs={2}>
									<Typography>Site Abbreviation:</Typography>
								</Grid>
								<Grid item xs={9}>
									<Tooltip placement="top" title={"Max 6 characters"}>
										<TextField
											id="input-rack"
											variant="outlined"
											label={"datacenter-abbreviation"}
											name={"datacenter-abbreviation"}
											onChange={this.updateDatacenterAbbrevation}
											value={this.state.datacenterAbbreviation}
											required
											fullWidth
										/>
									</Tooltip>
								</Grid>
								<Grid item xs={9}>
									<FormControl component="fieldset">
										<RadioGroup column aria-label="position" name="position" defaultValue="start" value={this.state.siteType} onChange={(event) => this.selectSiteType(event)}>
											<FormControlLabel
												control={<Radio color="primary" />}
												label="Datacenter"
												value={datacenterVal}
											/>
											<FormControlLabel
												control={<Radio color="primary" />}
												label="Offline Storage"
												value={offlineStorageVal}
											/>
										</RadioGroup>
									</FormControl>
								</Grid>
								<Grid item xs={12}>
									<Button
										variant="contained"
										color="primary"
										type="submit"
										disabled={!(this.state.datacenterAbbreviation && this.state.datacenterName)}
										onClick={() => { this.createDatacenter() }}
									>
										Create Site
                            </Button>
								</Grid>
								<Grid item xs={12}>
									{this.state.showStatus ? <Alert severity="error" onClose={() => { this.closeStatus() }}>{this.state.statusMessage}</Alert> : null}
								</Grid>
							</Grid>
						</div>
					</Fade>
				</Modal>
			</React.Fragment>
		);
	}
}

export default withStyles(useStyles)(CreateDatacenter);
