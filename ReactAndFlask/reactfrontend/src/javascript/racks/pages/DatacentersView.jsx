import React from 'react';

import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
    Grid,
    Typography
} from "@material-ui/core/";

import getURL from "../../helpers/functions/GetURL";
import * as Constants from "../../Constants";
import { DatacenterCommand } from "../enums/DatacenterCommands.ts";
import ErrorBoundary from "../../errors/ErrorBoundry";
import CreateDatacenter from "../helpers/CreateDatacenter";
import { Privilege } from '../../enums/privilegeTypes.ts';
import EditDatacenter from "../helpers/EditDatacenter";
import ConfirmDeteleDC from "../helpers/ConfirmDeleteDC";
import ShowDatacenters from "../helpers/functions/ShowDatacenters";
import StatusDisplay from '../../helpers/StatusDisplay';

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


class DatacenterView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            datacentersList:[],
            loadingDCList:true,
            showConfirmationBox:false,
            currentDatacenter:"",
            showEditDC:false,
            editDCName:"",
            editDCAbbr:"",
            showStatus:false,
            statusMessage:"",
            statusSeverity:"",
        };
    }

    componentDidMount() {
        this.getDatacenters();
    }

    getDatacenters = () => {
        this.setState({ loadingDCList:true });
        axios.get(getURL(Constants.DATACENTERS_MAIN_PATH, DatacenterCommand.GET_ALL_DATACENTERS)).then(
            response => {
                console.log(response);
                if (response.data.message === "success") {
                    this.setState({ datacentersList: response.data.datacenters, loadingDCList:false });
                } else {
                    this.setState({
                        loadingDCList:false,
                        showStatus:true,
                        statusMessage:response.data.message,
                        statusSeverity:"error",
                     });
                }

            }
        );
    }

    deleteDatacenter = () => {
        axios.post(getURL(Constants.DATACENTERS_MAIN_PATH, DatacenterCommand.DELETE),
        {
            "datacenter_name":this.state.currentDatacenter
        }
        ).then(
            response => {
                console.log("Deleteting");
                console.log(response);
                if (response.data.message === "success") {
                    this.setState({
                        showConfirmationBox: false,
                        showStatus:true,
                        statusMessage:"Successfully deleted datacenter",
                        statusSeverity:"success",
                     });
                    this.getDatacenters();
                } else {
                    this.setState({
                        showConfirmationBox: false,
                        showStatus:true,
                        statusMessage:response.data.message,
                        statusSeverity:"error",
                     });
                }

            }
        );
    }

    openConfirmationBox = (event, datacenter) => {
        this.setState({ showConfirmationBox: true, currentDatacenter:datacenter });
    }

    closeConfirmationBox = () => {
        this.setState({ showConfirmationBox: false });
    }

    openEditDatacenter= (event, datacenterName, datacenterAbbrev) => {
        this.setState({ editDCName: datacenterName, editDCAbbr: datacenterAbbrev }, () => this.setState({ showEditDC: true, }));
    }

    closeEditDatacenter = () => {
        this.setState({
            showEditDC: false,
            editDCName:"",
            editDCAbbr:"",
         });
    }

    closeShowStatus = () => {
        this.setState({ showStatus:false });
    }


    render() {
        const { classes } = this.props;

        return (
            <React.Fragment>
                <ErrorBoundary>
                    <Grid
                        container
                        spacing={5}
                        direction="row"
                        justify="flex-start"
                        alignItems="center"
                        style={{margin: "0px", maxWidth: "95vw"}}
                    >
                        <Grid item xs={12}>
                            <Typography variant="h4">
                                Datacenters
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            {this.props.privilege === Privilege.ADMIN ? <CreateDatacenter search={this.getDatacenters} /> : null }
                        </Grid>
                        <Grid item xs={12}>
                            {this.state.loadingDCList ?
                            <div className={classes.progress}><CircularProgress /></div> :
                            <ShowDatacenters
                                classes={classes}
                                datacentersList={this.state.datacentersList}
                                privilege={this.props.privilege}
                                openConfirmationBox={this.openConfirmationBox}
                                editDatacenter={this.openEditDatacenter}
                            />}
                        </Grid>
                    </Grid>
                    <EditDatacenter
                        show={this.state.showEditDC}
                        close={this.closeEditDatacenter}
                        dcName={this.state.editDCName}
                        dcAbbrev={this.state.editDCAbbr}
                        search={this.getDatacenters}
                    />
                    <ConfirmDeteleDC
                        showConfirmationBox={this.state.showConfirmationBox}
                        closeConfirmationBox={this.closeConfirmationBox}
                        deleteDatacenter={this.deleteDatacenter}
                        close={this.closeEditDatacneter}
                    />
                    <StatusDisplay
                        open={this.state.showStatus}
                        severity={this.state.statusSeverity}
                        closeStatus={this.closeShowStatus}
                        message={this.state.statusMessage}
                    />
                </ErrorBoundary>
            </React.Fragment>
        );
}
  }


  export default withStyles(useStyles)(DatacenterView);
