import React from 'react';

import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

import getURL from "../../helpers/functions/GetURL";
import * as Constants from "../../Constants";
import { DatacenterCommand } from "../enums/DatacenterCommands.ts";
import RacksView from "../pages/RacksView";
import ErrorBoundary from "../../errors/ErrorBoundry";
import CreateDatacenter from "./CreateDatacenter";
import { Privilege } from '../../enums/privilegeTypes.ts';
import EditDatacenter from "./EditDatacenter";
import ShowDatacenters from "./functions/ShowDatacenters";

const useStyles = theme => ({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    progress: {
        display: 'flex',
        '& > * + *': {
          marginLeft: theme.spacing(2),
        },
        justify:"center",
        alignItems:"center",
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

class ConfirmDeteleDC extends React.Component {
	constructor(props) {
		super(props);

		this.state = {

		};
	}

	render() {
		const { classes } = this.props;

		return (
			<Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={this.props.showConfirmationBox}
                    onClose={this.props.closeConfirmationBox}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                    timeout: 500,
                    }}
                >
                    <Fade in={this.props.showConfirmationBox}>
                        <div className={classes.paper}>
                            <Grid container spacing={5}>
                                <Grid item xs={12}>
                                    Are you sure you wish to delete?
                                </Grid>
                                <Grid item xs={2}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={this.props.deleteDatacenter}
                                    >
                                        Yes
                                    </Button>
                                </Grid>
                                <Grid item xs={1}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => this.props.closeConfirmationBox()}
                                    >
                                        No
                                    </Button>
                                </Grid>
                            </Grid>
                        </div>
                    </Fade>
                </Modal>
		);
	}
}

export default withStyles(useStyles)(ConfirmDeteleDC);
