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
import { withStyles, makeStyles } from '@material-ui/core/styles';
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


const useStyles = theme => ({
	styledTableRow: {
	'&:nth-of-type(odd)': {
		backgroundColor: theme.palette.primary.light,
	},
	},
	tableCellHead: {
		backgroundColor: theme.palette.primary.light,
		color: theme.palette.common.white,
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

function createData(model, hostname, datacenter, rack, rackU, owner, assetNum) {
  return { model, hostname, datacenter, rack, rackU, owner, assetNum };
}

const headCells = [
	{ id: 'datacenter', numeric: false, label:"Datacenter", align:"left" },
	{ id: 'hostname', numeric: false, label:"Hostname", align:"left" },
	{ id: 'model', numeric: false, label:"Model", align:"left" },
	{ id: 'rack', numeric: false, label:"Location", align:"left" },
	{ id: 'owner', numeric: false, label:"Owner", align:"left" },
	{ id: 'assetNumber', numeric: false, label:"Asset Number", align:"right" },
];

const testRows = [
	createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
	createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
	createData('Eclair', 262, 16.0, 24, 6.0),
	createData('Cupcake', 305, 3.7, 67, 4.3),
	createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];


class TableAsset extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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
    };
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

	getAssetDetails = (rack, rack_position) => {
		this.setState({ detailViewLoading: true });

		var body = {};
		body[AssetInput.RACK] = rack;
		body[AssetInput.RACK_U] = rack_position;

		axios.post(
			getURL(AssetConstants.ASSETS_MAIN_PATH, AssetCommand.detailView), body
			).then(response => this.setState({ detailedValues: response.data['assets'][0], detailViewLoading:false}));
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

	openDetailedView = (event, assetNum, hostname) => {
		this.setState({ detailAsset: assetNum, showDetailedView: true, detailHostname:hostname });
	}

	updateItems(assets) {
		var items = [];

		assets.map(asset => {
			items.push(createData(asset.model, asset.hostname, asset.datacenter_id, asset.rack, asset.rack_position, asset.owner, asset.asset_number));
		});

		this.setState({ tableItems : items });
	}

	render() {
	const { classes } = this.props;

	return (
		<React.Fragment>
			<Grid container spacing={3}>
				<Grid item xs={6}>
					<FilterAsset
						updateItems={this.updateItems}
					/>
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
									{headCell.label}
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
												<TableCell component="th" id={labelId} scope="row">{row.model}</TableCell>
												<TableCell align="left">{row.hostname}</TableCell>
												<TableCell align="left">{row.datacenter}</TableCell>
												<TableCell align="left">{row.rack + " U" + row.rackU}</TableCell>
												<TableCell align="left">{row.owner}</TableCell>
												<TableCell align="right">{row.assetNum}</TableCell>
												<TableCell align="center">
													<Button
														color="primary"
														variant="contained"
														onClick={(event) => {this.openDetailedView(event, row.assetNum, row.hostname)}}
													>
														More Details
													</Button>
												</TableCell>
											</TableRow>
										);
									})}
									{/*emptyRows > 0 && (
										<TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
										<TableCell colSpan={6} />
										</TableRow>
									)*/}
							</TableBody>
						</Table>
					</TableContainer>
				</Grid>
			</Grid>
		<DetailAsset
			open={this.state.showDetailedView}
			close={this.closeDetailedView}
			search={this.search}
			disabled={this.props.privilege===Privilege.USER /* && username !== row.owner*/}
			asset={this.state.detailAsset}
			hostname={this.state.detailHostname}
		/>
		</React.Fragment>
	);
  }
}

export default withStyles(useStyles)(TableAsset);
