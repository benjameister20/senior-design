import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { withStyles, makeStyles } from '@material-ui/core/styles';


const useStyles = theme => ({
  styledTableRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
  tableCellHead: {
	backgroundColor: theme.palette.common.black,
	color: theme.palette.common.white,
  },
  styledTableCell:{
      fontSize: 14,
  },
  table: {
    minWidth: 700,
  },
});

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
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
	  viewAssetRack:'',
	  viewAssetrack_position:'',

	  showDetailedView: false,
	  detailViewLoading:false,
	  detailedValues : null,
	  originalRack:'',
	  originalrack_position:'',
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

	detailViewAsset = (rack, rack_position) => {
		var body = {};
		body[AssetInput.RACK] = rack;
		body[AssetInput.RACK_U] = rack_position;

		axios.post(
			getURL(AssetConstants.ASSETS_MAIN_PATH, AssetCommand.detailView), body
			).then(response => this.setState({ detailedValues: response.data['assets'][0], detailViewLoading:false})
			);

		this.setState({
			viewAssetRack:'',
		});
	}



	showDetailedView = (id) => {
		this.setState({
			showDetailedView: true,
			detailViewLoading:true,
			originalRack: this.state.items[id][AssetInput.RACK],
			originalrack_position: this.state.items[id][AssetInput.RACK_U],
		});

		var rack = this.state.items[id][AssetInput.RACK];
		var rack_position = this.state.items[id][AssetInput.RACK_U];

		this.detailViewAsset(rack, rack_position);
	}

	closeDetailedView = () => {
		this.setState({ showDetailedView: false })
	}

	updateAssetEdited = (event) => {
		this.state.detailedValues.updateVal(event.target.value);
		this.forceUpdate()
	}

	closeShowStatus = () => {
		this.setState({ showStatus: false })
	}

	detailStatusClose = () => {
		this.setState({ detailStatusOpen: false })
	}

  showDetailedView(event) {
    this.props.showDetailedView(event.target.id);
  }

  render() {
	const { classes } = this.props;

    return (
      <div>
        <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow className={classes.styledTableRow}>
              <TableCell className={classes.tableCellHead}>Dessert (100g serving)</TableCell>
              <TableCell align="right" className={classes.tableCellHead}>Calories</TableCell>
              <TableCell align="right" className={classes.tableCellHead}>Fat&nbsp;(g)</TableCell>
              <TableCell align="right" className={classes.tableCellHead}>Carbs&nbsp;(g)</TableCell>
              <TableCell align="right" className={classes.tableCellHead}>Protein&nbsp;(g)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right" className={classes.styledTableCell}>{row.calories}</TableCell>
                <TableCell align="right">{row.fat}</TableCell>
                <TableCell align="right">{row.carbs}</TableCell>
                <TableCell align="right">{row.protein}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


        {/*<TableContainer component={Paper}>
          <Table className={{minWidth: 650}} aria-label="simple table">
            <TableHead>
              <TableRow >
                {this.props.columns.map(col => (<TableCell><span id={col}>{col}</span></TableCell>))}
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.vals.map((row, index)=> (
              <TableRow>
                {this.props.keys.map(key => (<TableCell scope="row"><span id={index} onClick={this.showDetailedView.bind(this)}>{row[key]}</span></TableCell>))}
              </TableRow>
              ))}
            </TableBody>
          </Table>
			  </TableContainer>
		<DetailAsset
			statusOpen={this.state.detailStatusOpen}
			statusSeverity={this.state.detailStatusSeverity}
			statusClose={this.detailStatusClose}
			statusMessage={this.state.detailStatusMessage}
			showDetailedView={this.state.showDetailedView}
			closeDetailedView={this.closeDetailedView}
			updateModelEdited={this.updateAssetEdited}
			defaultValues={this.state.detailedValues}
			loading={this.state.detailViewLoading}
			edit={this.editAsset}
			delete={this.deleteAsset}
			disabled={this.props.privilege===Privilege.USER}
		/>
		*/}
      </div>
    );
  }
}

export default withStyles(useStyles)(TableAsset);
