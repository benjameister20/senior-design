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

import { AssetInput } from '../enums/AssetInputs.ts';
import { AssetCommand } from '../enums/AssetCommands.ts';
import getURL from '../../helpers/functions/GetURL';
import * as AssetConstants from "../AssetConstants";
import DetailAsset from "./DetailsAsset";
import FilterAsset from './FilterAsset';
import stableSort from "../../helpers/functions/StableSort";
import getComparator from "../../helpers/functions/GetComparator";


const useStyles = theme => ({
  styledTableRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
  tableCellHead: {
	backgroundColor: theme.palette.primary.main,
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
});

function createData(model, hostname, datacenter, rack, rackU, owner, assetNum) {
  return { model, hostname, datacenter, rack, rackU, owner, assetNum };
}

const rows = [
	createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
	createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
	createData('Eclair', 262, 16.0, 24, 6.0),
	createData('Cupcake', 305, 3.7, 67, 4.3),
	createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];

const columns = [
    'model',
    'hostname',
    'rack',
    'rack_position',
]

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
	  originalRack:'',
	  originalrack_position:'',

	  order:"asc",
	  orderBy:"model",
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



	render() {
	const { classes } = this.props;

	return (
		<React.Fragment>
			<Grid container spacing={3}>
				<Grid item xs={6}>
					<FilterAsset />
				</Grid>
				<Grid item xs={12}>
					<TableContainer component={Paper}>
						<Table className={classes.table} aria-label="customized table">
							<TableHead>
							<TableRow className={classes.styledTableRow}>
								<TableCell className={classes.tableCellHead}>Model</TableCell>
								<TableCell align="right" className={classes.tableCellHead}>Hostname</TableCell>
								<TableCell align="right" className={classes.tableCellHead}>Datacenter</TableCell>
								<TableCell align="right" className={classes.tableCellHead}>Rack</TableCell>
								<TableCell align="right" className={classes.tableCellHead}>Rack U</TableCell>
								<TableCell align="right" className={classes.tableCellHead}>Owner</TableCell>
								<TableCell align="right" className={classes.tableCellHead}>Asset Number</TableCell>
								<TableCell align="right" className={classes.tableCellHead}></TableCell>
							</TableRow>
							</TableHead>
							<TableBody>
							{rows.map(row =>
								<TableRow key={row.name}>
									<TableCell component="th" scope="row">{row.model}</TableCell>
									<TableCell align="right">{row.hostname}</TableCell>
									<TableCell align="right">{row.datacenter}</TableCell>
									<TableCell align="right">{row.rack}</TableCell>
									<TableCell align="right">{row.rackU}</TableCell>
									<TableCell align="right">{row.owner}</TableCell>
									<TableCell align="right">{row.assetNum}</TableCell>
									<TableCell align="center">
										<Button
											color="primary"
											variant="contained"
											onClick={() => this.setState({ showDetailedView: true })}
										>
											More Details
										</Button>
									</TableCell>
								</TableRow>
							)}
							</TableBody>
						</Table>
					</TableContainer>
				</Grid>
			</Grid>
		<DetailAsset
			open={this.state.showDetailedView}
			close={this.closeDetailedView}
			search={this.props.search}
			/*disabled={this.props.privilege===Privilege.USER}*/
		/>
		</React.Fragment>
	);
  }
}

export default withStyles(useStyles)(TableAsset);
