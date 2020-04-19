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
import RackDiagrams from "../helpers/RackDiagrams";


const racksMainPath = 'racks/';

function createRackElem(color, title, index, assetNum, textColor) {
	return { color, title, index, assetNum, textColor };
}

function createRack(rackTitle, racks) {
	return { rackTitle, racks }
}

function sort(a, b) {
	if (a.rackTitle > b.rackTitle) return 1;
	if (a.rackTitle < b.rackTitle) return -1;
	return 0;
}

function sortRack(a, b) {
	if (a.index > b.index) return -1;
	if (a.index < b.index) return 1;
	return 0;
}



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
        justify: "center",
        alignItems: "center",
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
            datacentersList: [],
            loadingDCList: true,
            showConfirmationBox: false,
            currentDatacenter: "",
            showEditDC: false,
            editDCName: "",
            editDCAbbr: "",
            selectedDatacenter: "",
            fullDatacenter: {},
            racks: {},
        };
    }

    componentDidMount() {
        this.getDatacenters();
    }

    getDatacenters = () => {
        this.setState({ loadingDCList: true });
        axios.get(getURL(Constants.DATACENTERS_MAIN_PATH, DatacenterCommand.GET_ALL_DATACENTERS)).then(
            response => {
                console.log(response.data.datacenters);
                var datacenter = response.data.datacenters[0];
                console.log(datacenter);
                var name = datacenter === undefined ? "" : datacenter.name;
                console.log(name);
                this.setState({ datacentersList: response.data.datacenters, loadingDCList: false, selectedDatacenter: name, fullDatacenter: datacenter }, () => this.getRacks());
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
                        showStatus: true,
                        statusMessage: "Successfully deleted site",
                        statusSeverity: "success",
                    });
                    this.getDatacenters();
                } else {
                    this.setState({
                        showConfirmationBox: false,
                        showStatus: true,
                        statusMessage: response.data.message,
                        statusSeverity: "error",
                    });
                }

            }
        );
    }

    openConfirmationBox = (event, datacenter) => {
        this.setState({ showConfirmationBox: true, currentDatacenter: datacenter });
    }

    closeConfirmationBox = () => {
        this.setState({ showConfirmationBox: false });
    }

    openEditDatacenter = (event, datacenterName, datacenterAbbrev) => {
        this.setState({ editDCName: datacenterName, editDCAbbr: datacenterAbbrev }, () => this.setState({ showEditDC: true, }));
    }

    closeEditDatacenter = () => {
        this.setState({
            showEditDC: false,
            editDCName: "",
            editDCAbbr: "",
            showStatus: false,
            statusMessage: '',
            statusSeverity: 'info',
            isOfflineStorage: false,
            selectedDatacenter: "",
            fullDatacenter: "",

            racks: [],
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
                this.setState({ showStatus: true, statusMessage: "Success", statusSeverity: "success", showConfirmationBox: false }, () => this.getRacks());
                if (command === RackCommand.GET_RACK_DETAILS) {
                    const win = window.open(response.data.link, '_blank');
                    if (win != null) {
                        win.focus();
                    }
                }
            } else {
                this.setState({ showStatus: true, statusMessage: response.data.message, statusSeverity: "error" })
            }
        });
    }

    updateDatacenter = (event) => {
        this.setState({ selectedDatacenter: event.target.value.name, fullDatacenter: event.target.value, isOfflineStorage: event.target.value.is_offline_storage }, () => this.getRacks());
    }





    createDiagram = (startL, stopL, startN, stopN) => {
		axios.post(getURL(Constants.RACKS_MAIN_PATH, "details/"),
			{
				"start_letter": startL,
				"stop_letter": stopL,
				"start_number": startN,
				"stop_number": stopN,
				"datacenter_name": this.state.selectedDatacenter,
			}
		).then(
			response => {
				var assets = response.data.racks[0][startL + startN];
				var rack = [];

				for (let rackPos = 1; rackPos <= 42; rackPos++) {
					if (assets.length > 0) {
						var asset = assets[0];
						if (asset.rack_position === rackPos) {
							for (let assetHeight = 0; assetHeight < asset.height; assetHeight++) {
								var title = asset.model + ",  ";
								title += ((asset.hostname === "") ? asset.asset_number : asset.hostname);
								title = (assetHeight > 0) ? "" : title;

								try {
									var r = parseInt("0x" + asset.display_color.substring(1, 3));
									var g = parseInt("0x" + asset.display_color.substring(3, 5));
									var b = parseInt("0x" + asset.display_color.substring(5));

									var textColor = (r + g + b < 300 ? "#FFFFFF" : "#000000")
								} catch {
									var textColor = "#000000"
								}
								rack.push(createRackElem(asset.display_color, title, rackPos + assetHeight, asset.asset_number, textColor));
							}
							rackPos += (asset.height - 1);
						} else {
							rack.push(createRackElem("#FFFFFF", "", rackPos));
						}
					} else {
						rack.push(createRackElem("#FFFFFF", "", rackPos));
					}
				}

				rack.sort(sortRack);
				var rackTitle = startL + (startN > 9 ? startN : " " + startN);
				this.state.racks.push(createRack(rackTitle, rack));
				this.state.racks.sort(sort)
				this.forceUpdate();
			});
	}

	getRacks = () => {
		this.state.racks = [];
		this.forceUpdate();
		axios.post(getURL(Constants.RACKS_MAIN_PATH, "all/"),
			{
				"datacenter_name": this.state.selectedDatacenter,
			}
		).then(
			response => {
				var racks = [];
				response.data.racks.map(rack => {
					racks.push(rack.label);
				})
				racks.map(rack => {
					var startL = rack.substring(0, 1);
					var startN = parseInt(rack.substring(1));
					this.createDiagram(startL, startL, startN, startN);
				});
			});
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
                        style={{ margin: "0px", maxWidth: "95vw" }}
                    >
                        <Grid item xs={12}>
                            <Typography variant="h4">
                                Sites
                            </Typography>
                        </Grid>
                        <CreateDatacenter
                            disabled={!(this.props.privilege.admin || this.props.privilege.asset)}
                            search={this.getDatacenters}
                            selectedDatacenter={this.state.selectedDatacenter}
                            dc={this.state.fullDatacenter}
                            selectDatacenter={this.updateDatacenter}
                            datacenterList={this.state.datacentersList}
                        />

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
                                    privilege={this.props.privilege}
                                    dc={this.state.fullDatacenter}
                                    isOfflineStorage={this.state.isOfflineStorage}
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

                    {this.state.isOfflineStorage ? null :
                        <RackDiagrams
                            datacenter_name={this.state.selectedDatacenter}
                            privilege={this.props.privilege}
                            username={this.props.username}
                            getRacks={this.getRacks}
                            racks={this.state.racks}
                        />}
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
