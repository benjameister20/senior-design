import React from 'react';

import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import getURL from "../../helpers/functions/GetURL";
import * as Constants from "../../Constants";
import { DatacenterCommand } from "../enums/DatacenterCommands.ts";
import ErrorBoundary from "../../errors/ErrorBoundry";
import CreateDatacenter from "../helpers/CreateDatacenter";
import { Privilege } from '../../enums/privilegeTypes.ts';
import EditDatacenter from "../helpers/EditDatacenter";
import ConfirmDeteleDC from "../helpers/ConfirmDeleteDC";
import ShowDatacenters from "../helpers/functions/ShowDatacenters";

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
        };
    }

    componentDidMount() {
        this.getDatacenters();
    }

    getDatacenters = () => {
        axios.get(getURL(Constants.DATACENTERS_MAIN_PATH, DatacenterCommand.GET_ALL_DATACENTERS)).then(
            response => {
                this.setState({ datacentersList: response.data.datacenters, loadingDCList:false });
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
                    this.setState({ showConfirmationBox: false });
                    this.getDatacenters();
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


    render() {
        const { classes } = this.props;

        return (
            <React.Fragment>
                <ErrorBoundary>
                    {this.props.privilege === Privilege.ADMIN ? <CreateDatacenter search={this.getDatacenters} /> : null }
                    {this.state.loadingDCList ?
                    <div className={classes.progress}><CircularProgress /></div> :
                    <ShowDatacenters
                        classes={classes}
                        datacentersList={this.state.datacentersList}
                        privilege={this.props.privilege}
                        openConfirmationBox={this.openConfirmationBox}
                        editDatacenter={this.openEditDatacenter}
                    />}
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
                </ErrorBoundary>
            </React.Fragment>
        );
}
  }


  export default withStyles(useStyles)(DatacenterView);
