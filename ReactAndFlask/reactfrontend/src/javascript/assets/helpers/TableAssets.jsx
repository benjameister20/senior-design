import React from 'react';

import axios from 'axios';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Paper, Button } from '@material-ui/core';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { Alert, AlertTitle } from '@material-ui/lab';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import Checkbox from '@material-ui/core/Checkbox';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import { AssetInput } from '../enums/AssetInputs.ts';
import { AssetCommand } from '../enums/AssetCommands.ts';
import getURL from '../../helpers/functions/GetURL';
import * as AssetConstants from "../AssetConstants";
import DetailAsset from "./DetailsAsset";
import FilterAsset from './FilterAsset';
import stableSort from "../../helpers/functions/StableSort";
import getComparator from "../../helpers/functions/GetComparator";
import { Privilege } from "../../enums/privilegeTypes.ts";
import AddAsset from "./AddAsset";
import ExportAsset from "./ExportAsset";
import * as Constants from '../../Constants';
import StatusDisplay from "../../helpers/StatusDisplay";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@material-ui/lab';
import TrackChangesIcon from '@material-ui/icons/TrackChanges';

const useStyles = theme => ({
	root: {
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(1),
	},
	styledTableRow: {
	},
	tableCellHead: {
	},
	styledTableCell: {
		fontSize: 14,
	},
	table: {
		minWidth: 700,
	},
	paper: {
		width: '100%',
		marginBottom: theme.spacing(2),
	},
	visuallyHidden: {
		border: 0,
		clip: 'rect(0 0 0 0)',
		height: 1,
		margin: -1,
		overflow: 'hidden',
		padding: 0,
		position: 'absolute',
		top: 20,
		width: 1,
	},
	title: {
		flex: '1 1 100%',
	},
});

const emptySearch = {
	"filter": {
		"vendor": null,
		"model_number": null,
		"height": null,
		"model": null,
		"hostname": null,
		"rack": null,
		"rack_position": null,
		"username": null,
		"display_name": null,
		"email": null,
		"privilege": null,
		"model": null,
		"hostname": null,
		"starting_rack_letter": null,
		"ending_rack_letter": null,
		"starting_rack_number": null,
		"ending_rack_number": null,
		"rack": null,
		"rack_position": null
	},
	"datacenter_name": "",
}

function createData(model, hostname, datacenter_name, rack, owner, asset_number) {
	return { model, hostname, datacenter_name, rack, owner, asset_number };
}

function createDecData(model, hostname, datacenter_name, rack, owner, asset_number, decommission_user, timestamp) {
	return { model, hostname, datacenter_name, rack, owner, asset_number, decommission_user, timestamp };
}

const headCells = [
	{ id: 'datacenter_name', numeric: false, label: "Datacenter", align: "left" },
	{ id: 'hostname', numeric: false, label: "Hostname", align: "left" },
	{ id: 'model', numeric: false, label: "Model", align: "left" },
	{ id: 'rack', numeric: false, label: "Rack", align: "left" },
	{ id: 'owner', numeric: false, label: "Owner", align: "left" },
	{ id: 'asset_number', numeric: false, label: "Asset Number", align: "right" },
];

const decommissionHeadCells = [
	{ id: 'decommission_user', numeric: false, label: "User", align: "right" },
	{ id: 'timestamp', numeric: false, label: "Timestamp", align: "right" },
];


class TableAsset extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			allAssets: [],
			tableItems: [],
			selectedItems: [],
			allSelected: false,
			decAssets: [],

			detailStatusOpen: false,
			detailStatusSeverity: '',
			detailStatusMessage: '',

			deleteAssetRack: '',
			deleteAssetrack_position: '',

			showDetailedView: false,
			detailViewLoading: false,
			detailAsset: -1,
			detailHostname: "",
			originalRack: '',
			originalrack_position: '',

			order: "asc",
			orderBy: "datacenter",

			showStatus: false,
			statusSeverity: "",
			statusMessage: "",

			// Change plan
			speedDialOpen: false,
			displayDec: false,
		};
	}

	componentDidMount() {
		axios.post(
			getURL(Constants.ASSETS_MAIN_PATH, AssetCommand.search), emptySearch).then(
				response => {
					var items = [];

					response.data.instances.map(asset => {
						items.push(createData(asset.model, asset.hostname, asset.datacenter_name, asset.rack + " U" + asset.rack_position, asset.owner, asset.asset_number));
					});
					this.setState({ allAssets: response.data.instances, tableItems: items });
				});
		this.getDecommissionedAssets();
	}

	deleteAsset = () => {
		var body = {};
		body[AssetInput.RACK] = this.state.originalRack;
		body[AssetInput.RACK_U] = this.state.originalrack_position;

		axios.post(
			getURL(AssetConstants.ASSETS_MAIN_PATH, AssetCommand.delete), body
		).then(response => {
			if (response.data.message === AssetConstants.SUCCESS_TOKEN) {
				this.setState({
					showStatus: true,
					statusMessage: "Successfully deleted asset",
					statusSeverity: AssetConstants.SUCCESS_TOKEN,
					originalRack: '',
					originalrack_position: '',
					showDetailedView: false
				});
			} else {
				this.setState({ showStatus: true, statusMessage: response.data.message, statusSeverity: AssetConstants.ERROR_TOKEN })
			}
		});
	}

	generateLabels = () => {
		var body = {};
		body[AssetInput.ASSET_NUMBER] = this.state.selectedItems;

		axios.post(
			getURL(AssetConstants.ASSETS_MAIN_PATH, AssetCommand.GENERATE_LABELS), body,
			{
				responseType: 'arraybuffer',
			}
		).then(response => {
			console.log(response);
			console.log(response.data);
			try {
				var blob = new Blob([response.data], { type: "application/pdf" });
				var link = document.createElement('a');
				link.href = window.URL.createObjectURL(blob);
				link.download = "AssetLabels_" + new Date() + ".pdf";
				link.click();
				this.setState({
					showStatus: true,
					statusMessage: "Successfully generated asset label(s)",
					statusSeverity: AssetConstants.SUCCESS_TOKEN,
				});
			} catch {
				this.setState({ showStatus: true, statusMessage: "Could not generate asset labels", statusSeverity: AssetConstants.ERROR_TOKEN })
			}
		});
	}

	closeDetailedView = () => {
		this.setState({ showDetailedView: false })
	}

	closeShowStatus = () => {
		this.setState({ showStatus: false })
	}

	createSortHandler = (event, property) => {
		const isAsc = this.state.orderBy === property && this.state.order === 'asc';
		this.setState({ order: isAsc ? 'desc' : 'asc', orderBy: property });
	}

	openDetailedView = (event, asset) => {
		console.log("asset: ");
		console.log(asset);
		var dAsset = {};
		var assets = this.state.displayDec ? this.state.decAssets : this.state.allAssets;
		assets.map(currAsset => {
			if (currAsset.asset_number === asset.asset_number) {
				Object.assign(dAsset, currAsset);
			}
		})
		this.setState({ detailAsset: dAsset, showDetailedView: true });
	}

	updateItems = (assets) => {
		var items = [];

		if (!this.state.displayDec) {
			assets.map(asset => {
				items.push(createData(asset.model, asset.hostname, asset.datacenter_name, asset.rack + " U" + asset.rack_position, asset.owner, asset.asset_number));
			});
		} else {
			assets.map(asset => {
				items.push(createDecData(asset.vendor + " " + asset.model_number, asset.hostname, asset.datacenter_name, asset.rack + " U" + asset.rack_position, asset.owner, asset.asset_number, asset.decommission_user, asset.timestamp));
			});
		}


		this.setState({ tableItems: items });
	}

	getAssetList = () => {
		axios.post(
			getURL(Constants.ASSETS_MAIN_PATH, AssetCommand.search), emptySearch).then(
				response => { console.log("got list"); console.log(response); this.setState({ allAssets: response.data.instances }); });
	}

	getDecommissionedAssets = () => {
		axios.post(
			getURL(Constants.DECOMMISSIONS_MAIN_PATH, AssetCommand.search), {
			"filter": {
				"decommission_user": "",
				"start_date": "",
				"end_date": "",
			}
		}).then(
			response => {
				console.log("decommissioned assets:");
				console.log(response.data.decommissions);
				this.setState({ decAssets: response.data.decommissions })
			});
	}

	showStatusBar = (status, severity, message) => {
		this.setState({ showStatus: status, statusSeverity: severity, statusMessage: message });
	}

	closeShowStatus = () => {
		this.setState({ showStatus: false, statusSeverity: "", statusMessage: "" });
	}

	onSelectAllClick = (event) => {
		var newSelected = this.state.selectedItems;
		this.state.tableItems.map(n => {
			const selectedIndex = newSelected.indexOf(n.asset_number);
			if (selectedIndex === -1) {
				newSelected = newSelected.concat(n.asset_number);
			}
		});
		this.setState({ selectedItems: newSelected });
		this.forceUpdate();

	}

	deselectAllClick = () => {
		var newSelected = this.state.selectedItems;
		this.state.tableItems.map(n => {
			const selectedIndex = newSelected.indexOf(n.asset_number);
			console.log(selectedIndex);
			if (selectedIndex === 0) {
				newSelected = newSelected.slice(1);
			} else if (selectedIndex === newSelected - 1) {
				newSelected = newSelected.slice(0, -1);
			} else if (selectedIndex > 0) {
				newSelected = newSelected.slice(0, selectedIndex).concat(newSelected.slice(selectedIndex + 1));
			}
		});
		this.setState({ selectedItems: newSelected });
		this.forceUpdate();
	}

	addCheckedItem = (event, assetNum) => {
		if (event.target.getAttribute("class") !== "MuiButton-label") {
			const selectedIndex = this.state.selectedItems.indexOf(assetNum);
			let newSelected = [];

			if (selectedIndex === -1) {
				newSelected = newSelected.concat(this.state.selectedItems, assetNum);
			} else if (selectedIndex === 0) {
				newSelected = newSelected.concat(this.state.selectedItems.slice(1));
			} else if (selectedIndex === this.state.selectedItems.length - 1) {
				newSelected = newSelected.concat(this.state.selectedItems.slice(0, -1));
			} else if (selectedIndex > 0) {
				newSelected = newSelected.concat(
					this.state.selectedItems.slice(0, selectedIndex),
					this.state.selectedItems.slice(selectedIndex + 1),
				);
			}
			console.log(newSelected);
			this.setState({ selectedItems: newSelected });
		}
	}

	openSpeedDial = () => {
		this.setState({ speedDialOpen: true });
	}

	closeSpeedDial = () => {
		this.setState({ speedDialOpen: false });
	}

	exitChangePlan = () => {
		this.props.updateChangePlan(false, null);
	}

	switchToDec = (switchBool) => {
		this.setState({ displayDec: switchBool });
	}

	render() {
		const { classes } = this.props;
		var allSelected = true;
		this.state.tableItems.map(elem => {
			allSelected = allSelected && this.state.selectedItems.indexOf(elem.asset_number) !== -1;
		});

		return (
			<React.Fragment>
				<Grid container spacing={3}>
					<Grid item xs={12}>
						{this.props.changePlanActive ?
							<Alert severity="info">
								<AlertTitle>Change Plan Mode</AlertTitle>
						You are currently in change plan mode! Changes made are being logged in the plan and not actually made in the system.
					</Alert> : null}
					</Grid>
					<Grid item xs={12} sm={6} md={4} lg={3}>
						{(this.props.privilege.admin || this.props.privilege.asset || this.props.privilege.datacenters.length > 0) ?
							<AddAsset
								showStatus={this.showStatusBar}
								getAssetList={this.getAssetList}
								privilege={this.props.privilege}
								changePlanActive={this.props.changePlanActive}
								changePlanID={this.props.changePlanID}
							/> : null}
					</Grid>
					<Grid item xs={12} sm={6} md={4} lg={6}>
						<FilterAsset
							updateItems={this.updateItems}
							getAssetList={this.getAssetList}
							allAssets={this.state.allAssets}
							decAssets={this.state.decAssets}
							switchToDec={this.switchToDec}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={4} lg={3}>
						<ExportAsset
							items={this.state.tableItems}
							changePlanActive={this.props.changePlanActive}
							updateChangePlan={this.props.updateChangePlan}
							privilege={this.props.privilege}
							username={this.props.username}
						/>
					</Grid>
				</Grid>

				<Grid item xs={12}>
					<Toolbar>
						{this.state.selectedItems.length > 0 ? (
							<Typography className={classes.title} color="inherit" variant="subtitle1">
								{this.state.selectedItems.length} {this.state.selectedItems.length === 1 ? "label" : "labels"} ready to be generated
							</Typography>
						) : null}

						{this.state.selectedItems.length > 0 ? (
							<Tooltip title="Generate Labels">
								<IconButton aria-label="generate-labels" onClick={() => this.generateLabels()}>
									<NoteAddIcon />
								</IconButton>
							</Tooltip>
						) : null}
					</Toolbar>
					<TableContainer component={Paper}>
						<Table className={classes.table} aria-label="customized table" style={{
							backgroundColor: this.props.changePlanActive ? "#64b5f6" : "",
						}}>
							<TableHead>
								<TableRow className={classes.styledTableRow}>
									<TableCell padding="checkbox">
										<Tooltip title="Select All">
											<IconButton aria-label="select-all" onClick={() => this.onSelectAllClick()}>
												<CheckIcon />
											</IconButton>
										</Tooltip>
										<Tooltip title="Deselect All">
											<IconButton aria-label="deselect-all" onClick={() => this.deselectAllClick()}>
												<ClearIcon />
											</IconButton>
										</Tooltip>
									</TableCell>
									{headCells.map(headCell => (
										<TableCell
											className={classes.tableCellHead}
											key={headCell.id}
											align={headCell.align}
											sortDirection={this.state.orderBy === headCell.id ? this.state.order : false}
										>
											<TableSortLabel
												active={this.state.orderBy === headCell.id}
												direction={this.state.orderBy === headCell.id ? this.state.order : 'asc'}
												onClick={(event) => { this.createSortHandler(event, headCell.id) }}
											>
												<span style={{ fontWeight: "bold" }}>{headCell.label}</span>
												{this.state.orderBy === headCell.id ? (
													<span className={classes.visuallyHidden}>
														{this.state.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
													</span>
												) : null}
											</TableSortLabel>
										</TableCell>
									))}
									{this.state.displayDec ?
										decommissionHeadCells.map(headCell => (
											<TableCell
												className={classes.tableCellHead}
												key={headCell.id}
												align={headCell.align}
												sortDirection={this.state.orderBy === headCell.id ? this.state.order : false}
											>
												<TableSortLabel
													active={this.state.orderBy === headCell.id}
													direction={this.state.orderBy === headCell.id ? this.state.order : 'asc'}
													onClick={(event) => { this.createSortHandler(event, headCell.id) }}
												>
													<span style={{ fontWeight: "bold" }}>{headCell.label}</span>
													{this.state.orderBy === headCell.id ? (
														<span className={classes.visuallyHidden}>
															{this.state.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
														</span>
													) : null}
												</TableSortLabel>
											</TableCell>)) : null}
									<TableCell align="left" className={classes.tableCellHead}>{""}</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{stableSort(this.state.tableItems, getComparator(this.state.order, this.state.orderBy))
									.map((row, index) => {
										const labelId = `enhanced-table-checkbox-${index}`;
										return (
											<TableRow
												hover
												onClick={event => this.addCheckedItem(event, row.asset_number)}
												role="checkbox"
												aria-checked={this.state.selectedItems.indexOf(row.asset_number) !== -1}
												selected={this.state.selectedItems.indexOf(row.asset_number) !== -1}
												tabIndex={-1}
												key={row.assetNum}
												role="checkbox"
											>
												<TableCell padding="checkbox">
													<Checkbox
														checked={this.state.selectedItems.indexOf(row.asset_number) !== -1}
														inputProps={{ 'aria-labelledby': labelId }}
													/>
												</TableCell>
												<TableCell component="th" id={labelId} scope="row">{row.datacenter_name}</TableCell>
												<TableCell align="left">{row.hostname}</TableCell>
												<TableCell align="left">{row.model}</TableCell>
												<TableCell align="left">{row.rack}</TableCell>
												<TableCell align="left">{row.owner}</TableCell>
												<TableCell align="right">{row.asset_number}</TableCell>
												{this.state.displayDec ? <TableCell align="right">{row.decommission_user}</TableCell> : null}
												{this.state.displayDec ? <TableCell align="right">{row.timestamp}</TableCell> : null}
												<TableCell align="center">
													<Button
														color="primary"
														variant="contained"
														onClick={(event) => { this.openDetailedView(event, row); }}
													>
														More Details
													</Button>
												</TableCell>
											</TableRow>
										);
									})}
							</TableBody>
						</Table>
					</TableContainer>
				</Grid>
				{this.state.showDetailedView ?
					<DetailAsset
						open={this.state.showDetailedView}
						close={this.closeDetailedView}
						search={this.search}
						asset={this.state.detailAsset}
						search={this.getAssetList}
						privilege={this.props.privilege}
						changePlanActive={this.props.changePlanActive}
						changePlanID={this.props.changePlanID}
						disabled={this.props.privilege === Privilege.USER || this.state.displayDec /* && username !== row.owner*/}
						privilege={this.props.privilege}
						username={this.props.username}
					/> : null}
				<SpeedDial
					ariaLabel="SpeedDial openIcon example"
					style={{
						position: 'absolute',
						bottom: '30px',
						right: '30px',
					}}
					hidden={!this.props.changePlanActive}
					icon={<TrackChangesIcon />}
					onClose={this.closeSpeedDial}
					onOpen={this.openSpeedDial}
					open={this.state.speedDialOpen}
				>
					<SpeedDialAction
						key="exit"
						icon={<ExitToAppIcon />}
						tooltipTitle="Exit Change Plan"
						onClick={this.exitChangePlan}
					/>
				</SpeedDial>
				<StatusDisplay
					open={this.state.showStatus}
					severity={this.state.statusSeverity}
					closeStatus={this.closeShowStatus}
					message={this.state.statusMessage}
				/>
			</React.Fragment>
		);
	}
}

export default withStyles(useStyles)(TableAsset);
