import React from "react";

import axios from "axios";

import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import * as Constants from "../../Constants";
import { DatacenterCommand } from "../enums/DatacenterCommands";
import getURL from "../../helpers/functions/GetURL";

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

class EditDatacenter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            datacenterName:props.dcName,
            datacenterAbbreviation:props.dcAbbrev,
		};

	}

    generateEditJSON = () => {
		console.log("generating edit")
		console.log(this.props.dcName);
        return {
			"nameOriginal": this.props.dcName,
            "abbreviation" : this.state.datacenterAbbreviation||this.props.dcAbbrev,
            "datacenter_name": this.state.datacenterName||this.props.dcName,
        }
    }

    editDatacenter = () => {
		console.log("sending");
		console.log(this.state.datacenterName);
        axios.post(
            getURL(Constants.DATACENTERS_MAIN_PATH, DatacenterCommand.EDIT), this.generateEditJSON()).then(
            response => {
                console.log(response);
                if (response.status === Constants.HTTPS_STATUS_OK) {
                    this.setState({
                        datacenterName:"",
                        datacenterAbbreviation:"",
                    }, () => {this.props.search(); this.props.close() } );
                } else {
                    this.setState({
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
            return val.substring(0,7);
        }

        return val;
	}

    render() {
        const { classes } = this.props;

        return (
            <React.Fragment>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={this.props.show}
                onClose={this.props.close}
                closeAfterTransition
                BackdropComponent={Backdrop}
                scroll="body"
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={this.props.show}>
                    <div className={classes.paper}>
                        <Grid container spacing={3}>
                            <Grid item xs={2}>
                                <Typography>Datcenter Name:</Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <TextField
                                    id="input-rack"
                                    variant="outlined"
                                    label={"datacenter-name"}
                                    name={"datacenter-name"}
									onChange={this.updateDatacenterName}
									value={this.state.datacenterName||this.props.dcName}
                                    required
									fullWidth
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <Typography>Datcenter Abbreviation:</Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <Tooltip placement="top" title={"Max 6 characters"}>
                                    <TextField
                                        id="input-rack"
                                        variant="outlined"
                                        label={"datacenter-abbreviation"}
                                        name={"datacenter-abbreviation"}
                                        onChange={this.updateDatacenterAbbrevation}
										value={this.state.datacenterAbbreviation||this.props.dcAbbrev}
                                        required
										fullWidth
                                    />
                                </Tooltip>
                            </Grid>
                            <Grid item xs={12}>
								<Button
									variant="contained"
									color="primary"
									type="submit"
									onClick={() => { this.editDatacenter() }}
								>
									Save Edits
								</Button>
                            </Grid>
							<Grid item xs={12}>
								<Button
									variant="contained"
									color="primary"
									onClick={this.props.close}
								>
									Cancel
								</Button>
                            </Grid>
                        </Grid>
                    </div>
                </Fade>
            </Modal>
            </React.Fragment>
        );
    }
}

export default withStyles(useStyles)(EditDatacenter);
