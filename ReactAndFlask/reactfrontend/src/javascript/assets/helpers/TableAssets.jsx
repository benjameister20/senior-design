import React from 'react';

import axios from 'axios';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Button } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TableSortLabel from '@material-ui/core/TableSortLabel';

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


const useStyles = theme => ({
	styledTableRow: {
	},
	tableCellHead: {
	},
	styledTableCell:{
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
});

const emptySearch = {
    "filter": {
            "vendor":null,
            "model_number":null,
            "height":null,
            "model":null,
            "hostname":null,
            "rack":null,
            "rack_position":null,
            "username":null,
            "display_name":null,
            "email":null,
            "privilege":null,
            "model":null,
            "hostname":null,
            "starting_rack_letter":null,
            "ending_rack_letter":null,
            "starting_rack_number":null,
            "ending_rack_number":null,
            "rack":null,
            "rack_position":null
        },
    "datacenter_name":"",
}

function createData(model, hostname, datacenter_name, rack, owner, asset_number) {
  return { model, hostname, datacenter_name, rack, owner, asset_number };
}

const headCells = [
	{ id: 'datacenter_name', numeric: false, label:"Datacenter", align:"left" },
	{ id: 'hostname', numeric: false, label:"Hostname", align:"left" },
	{ id: 'model', numeric: false, label:"Model", align:"left" },
	{ id: 'rack', numeric: false, label:"Rack", align:"left" },
	{ id: 'owner', numeric: false, label:"Owner", align:"left" },
	{ id: 'asset_number', numeric: false, label:"Asset Number", align:"right" },
];


class TableAsset extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
		allAssets:[],
		tableItems:[],

		detailStatusOpen:false,
		detailStatusSeverity:'',
		detailStatusMessage:'',

		deleteAssetRack:'',
		deleteAssetrack_position:'',

		showDetailedView: false,
		detailViewLoading:false,
		detailAsset:-1,
		detailHostname:"",
		originalRack:'',
		originalrack_position:'',

		order:"asc",
		orderBy:"datacenter",

		showStatus:false,
		statusSeverity:"",
		statusMessage:"",
    };
  }

  	componentDidMount() {
		axios.post(
            getURL(Constants.ASSETS_MAIN_PATH, AssetCommand.search),emptySearch).then(
            response => {
				console.log(response);
				var items = [];

				response.data.instances.map(asset => {
					items.push(createData(asset.model, asset.hostname, asset.datacenter_name, asset.rack+" U"+asset.rack_position, asset.owner, asset.asset_number));
				});
				this.setState({ allAssets: response.data.instances, tableItems:items });
			});
	}

	editAsset = () => {
		let body = this.state.detailedValues.getAssetAsJSON();
		body[AssetInput.RACK_ORIGINAL] = this.state.originalRack;
		body[AssetInput.RACK_U_ORIGINAL] = this.state.originalrack_position;
		axios.post(
			getURL(AssetConstants.ASSETS_MAIN_PATH, AssetCommand.edit),body
			).then(response => {
				if (response.data.message === AssetConstants.SUCCESS_TOKEN) {
					this.setState({
						showStatus: true,
						statusMessage: "Successfully edited asset",
						statusSeverity:AssetConstants.SUCCESS_TOKEN,
						detailedValues : null,
						showDetailedView:false,
					});
				} else {
					this.setState({ detailStatusOpen: true, detailStatusMessage: response.data.message, detailStatusSeverity:AssetConstants.ERROR_TOKEN })
				}
			});
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
						statusSeverity:AssetConstants.SUCCESS_TOKEN,
						originalRack:'',
						originalrack_position:'',
						showDetailedView:false
					});
				} else {
					this.setState({ showStatus: true, statusMessage: response.data.message, statusSeverity:AssetConstants.ERROR_TOKEN })
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
		this.setState({ order: isAsc ? 'desc' : 'asc', orderBy:property });
	}

	openDetailedView = (event, asset) => {
		var dAsset = {};
		this.state.allAssets.map(currAsset => {
			if (currAsset.asset_number === asset.asset_number ) {
				Object.assign(dAsset, currAsset);
			}
		})
		this.setState({ detailAsset: dAsset, showDetailedView: true });
	}

	updateItems = (assets) => {
		var items = [];

		assets.map(asset => {
			items.push(createData(asset.model, asset.hostname, asset.datacenter_name, asset.rack+" U"+asset.rack_position, asset.owner, asset.asset_number));
		});

		this.setState({ tableItems : items });
	}

	getAssetList = () => {
        axios.post(
            getURL(Constants.ASSETS_MAIN_PATH, AssetCommand.search),emptySearch).then(
            response => { this.setState({ allAssets: response.data.instances }); });
	}

	showStatusBar = (status, severity, message) => {
		this.setState({ showStatus:status, statusSeverity:severity, statusMessage:message });
	}

	closeShowStatus = () => {
		this.setState({ showStatus:false, statusSeverity:"", statusMessage:"" });
	}

	render() {
	const { classes } = this.props;

	return (
		<React.Fragment>
			<Grid container spacing={3}>
				<Grid item xs={12} sm={6} md={4} lg={3}>
					{(this.props.privilege === Privilege.ADMIN) ? <AddAsset showStatus={this.showStatusBar} getAssetList={this.getAssetList} /> : null}
				</Grid>
				<Grid item xs={12} sm={6} md={4} lg={6}>
					<FilterAsset
						updateItems={this.updateItems}
						getAssetList={this.getAssetList}
						allAssets={this.state.allAssets}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={4} lg={3}>
					{(this.props.privilege === Privilege.ADMIN) ? <ExportAsset downloadTable={this.downloadTable} />:null}
				</Grid>
				<Grid item xs={12}>
					<TableContainer component={Paper}>
						<Table className={classes.table} aria-label="customized table">
							<TableHead>
							<TableRow className={classes.styledTableRow}>
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
										onClick={(event) => {this.createSortHandler(event, headCell.id)} }
									>
									<span style={{fontWeight: "bold"}}>{headCell.label}</span>
									{this.state.orderBy === headCell.id ? (
										<span className={classes.visuallyHidden}>
											{this.state.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
										</span>
									) : null}
									</TableSortLabel>
								</TableCell>
								))}
								<TableCell align="left" className={classes.tableCellHead}>{""}</TableCell>
							</TableRow>
							</TableHead>
							<TableBody>
								{stableSort(this.state.tableItems, getComparator(this.state.order, this.state.orderBy))
									//.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
									.map((row, index) => {
										const labelId = `enhanced-table-checkbox-${index}`;

										return (
											<TableRow
												hover
												tabIndex={-1}
												key={row.assetNum}
											>
												<TableCell component="th" id={labelId} scope="row">{row.datacenter_name}</TableCell>
												<TableCell align="left">{row.hostname}</TableCell>
												<TableCell align="left">{row.model}</TableCell>
												<TableCell align="left">{row.rack}</TableCell>
												<TableCell align="left">{row.owner}</TableCell>
												<TableCell align="right">{row.asset_number}</TableCell>
												<TableCell align="center">
													<Button
														color="primary"
														variant="contained"
														onClick={(event) => {this.openDetailedView(event, row)}}
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
			</Grid>
			{this.state.showDetailedView ?
		<DetailAsset
			open={this.state.showDetailedView}
			close={this.closeDetailedView}
			search={this.search}
			disabled={this.props.privilege===Privilege.USER /* && username !== row.owner*/}
			asset={this.state.detailAsset}
		/>:null}
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
