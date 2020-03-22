import React from 'react';

import axios from 'axios';

import { Grid, CircularProgress, Typography, withStyles } from '@material-ui/core/';
import getURL from "../../helpers/functions/GetURL";
import * as Constants from "../../Constants";
import { DatacenterCommand } from "../enums/DatacenterCommands.ts";
import ErrorBoundary from "../../errors/ErrorBoundry";
import CreateDatacenter from "../helpers/CreateDatacenter";
import { Privilege } from '../../enums/privilegeTypes.ts';
import EditDatacenter from "../helpers/EditDatacenter";
import ConfirmDeteleDC from "../helpers/ConfirmDeleteDC";
import ShowDatacenters from "../helpers/functions/ShowDatacenters";
import RacksView from './RacksView';
import { RackCommand } from "../enums/RackCommands.ts";
import StatusDisplay from '../../helpers/StatusDisplay';


const racksMainPath = 'racks/';


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
            selectedDatacenter: "",
            fullDatacenter: {},
            racks: {},
        };
    }

    componentDidMount() {
        this.getDatacenters();
    }

    getDatacenters = () => {
        this.setState({ loadingDCList:true });
        axios.get(getURL(Constants.DATACENTERS_MAIN_PATH, DatacenterCommand.GET_ALL_DATACENTERS)).then(
            response => {
                console.log(response.data.datacenters);
                var datacenter = response.data.datacenters[0];
                console.log(datacenter);
                var name = datacenter === undefined ? "" : datacenter.name;
                console.log(name);
                this.setState({ datacentersList: response.data.datacenters, loadingDCList:false, selectedDatacenter: name, fullDatacenter: datacenter });
                this.getAllRacks(name, true);
            }
        );
    }

    deleteDatacenter = () => {
        console.log(this.state.currentDatacenter);
        axios.post(getURL(Constants.DATACENTERS_MAIN_PATH, DatacenterCommand.DELETE),
        {
            "datacenter_name": this.state.currentDatacenter
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
            showStatus: false,
            statusMessage: '',
            statusSeverity: 'info',
         });
    }

    closeShowStatus = () => {
        this.setState({ showStatus: false });
    }

    updateRacks = (command, rack1, rack2) => {
        axios.post(
            getURL(racksMainPath, command),
            {
                'start_letter': rack1[0],
                'stop_letter': rack2[0],
                'start_number': rack1.substring(1),
                'stop_number': rack2.substring(1),
                "datacenter_name": this.state.selectedDatacenter,
            }
            ).then(response => {
                if (response.data.message === 'success') {
                    this.setState({ showStatus: true, statusMessage: "Success", statusSeverity:"success", showConfirmationBox:false });
                    if (command === RackCommand.GET_RACK_DETAILS) {
                        const win = window.open(response.data.link, '_blank');
                        if (win != null) {
                            win.focus();
                        }
                    }
                } else {
                    this.setState({ showStatus: true, statusMessage: response.data.message, statusSeverity:"error" })
                }
                this.getAllRacks(this.state.selectedDatacenter, false);
            });
    }

    getAllRacks = (datacenter, showSnack) => {
        axios.post(getURL(racksMainPath, RackCommand.GET_ALL_RACKS), {
            "datacenter_name": datacenter
        }).then(response => {
            console.log(response.data.racks);
            var racks = {};
            for (var i = 0; i < response.data.racks.length; ++i) {
                var letter = response.data.racks[i].label[0];
                if (letter in racks) {
                    racks[letter].push(response.data.racks[i].label);
                } else {
                    racks[letter] = [response.data.racks[i].label];
                }

                racks[letter].sort();
            }

            this.setState({ racks: racks });

            if (response.data.message === 'success') {
                if (showSnack) {
                    this.setState({ showStatus: true, statusMessage: "Racks loaded", statusSeverity:"success", racksList:response.data.racks })
                }
            } else {
                this.setState({ showStatus: true, statusMessage: response.data.message, statusSeverity:"error" })
            }
        });
    }

    updateDatacenter = (event) => {
        this.setState({ selectedDatacenter: event.target.value.name, fullDatacenter: event.target.value }, this.getAllRacks(event.target.value.name, true));
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
                        justify="center"
                        alignItems="center"
                        style={{margin: "0px", maxWidth: "95vw"}}
                    >
                        <Grid item xs={12}>
                            <Typography variant="h4">
                                Datacenters
                            </Typography>
                        </Grid>
                        <CreateDatacenter disabled={this.props.disabled} search={this.getDatacenters} selectedDatacenter={this.state.selectedDatacenter} dc={this.state.fullDatacenter} selectDatacenter={this.updateDatacenter} datacenterList={this.state.datacentersList} />
                        {this.state.loadingDCList ?
                        <div className={classes.progress}><CircularProgress /></div> :

                        <Grid item xs={12}>
                        <ShowDatacenters
                            classes={classes}
                            datacentersList={this.state.datacentersList}
                            privilege={this.props.privilege}
                            openConfirmationBox={this.openConfirmationBox}
                            editDatacenter={this.openEditDatacenter}
                            selectedDatacenter={this.state.selectedDatacenter}
                            updateRacks={this.updateRacks}
                            disabled={this.props.disabled}
                            dc={this.state.fullDatacenter}
                            />
                        </Grid>}
                        <Grid item xs={6}>
                        <EditDatacenter
                            show={this.state.showEditDC}
                            close={this.closeEditDatacenter}
                            dcName={this.state.editDCName}
                            dcAbbrev={this.state.editDCAbbr}
                            search={this.getDatacenters}
                        />
                        </Grid>
                        <Grid item xs={6}>
                        <ConfirmDeteleDC
                            showConfirmationBox={this.state.showConfirmationBox}
                            closeConfirmationBox={this.closeConfirmationBox}
                            deleteDatacenter={this.deleteDatacenter}
                            close={this.closeEditDatacneter}
                        />
                        </Grid>
                    </Grid>

                    <Grid
                        container
                        spacing={5}
                        direction="row"
                        justify="center"
                        alignItems="center"
                        style={{margin: "0px", maxWidth: "95vw"}}
                    >
                    <Grid item xs={12}>
                        <RacksView
                            disabled={this.props.disabled}
                            datacenter={this.state.selectedDatacenter}
                            racks={this.state.racks}
                        />
                    </Grid>
                    </Grid>
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
