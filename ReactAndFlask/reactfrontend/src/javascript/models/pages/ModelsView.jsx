import React from 'react';
import axios from 'axios';
import { CSVLink } from "react-csv";

import { ModelCommand } from '../enums/ModelCommands.ts'
import { ModelInput } from '../enums/ModelInputs.ts'

import ExportModel from '../helpers/ExportModel';
import FilterModel from '../helpers/FilterModel';
import CreateModel from '../helpers/CreateModel';

import getURL from '../../helpers/functions/GetURL';
import ModelsTable from '../helpers/ModelsTable';
import { Typography } from '@material-ui/core';

import * as ModelConstants from "../ModelConstants";
import Grid from '@material-ui/core/Grid';

import StatusDisplay from "../../helpers/StatusDisplay";

const columns = [
    'Vendor',
    'Model Number',
    'Mount Type',
    'Height',
    'Display Color',
    'Network Ports',
    'Power Ports',
    'CPU',
    'Memory',
    'Storage',
    'Comment',
]

const adminColumns = [
    'Actions',
    'Vendor',
    'Model Number',
    'Mount Type',
    'Height',
    'Display Color',
    'Network Ports',
    'Power Ports',
    'CPU',
    'Memory',
    'Storage',
    'Comment',
]

const columnLookup = {
    "vendor": "Vendor",
    "model_number": "Model Number",
    'mount_type': "Mount Type",
    "height": "Height",
    'display_color': 'Display Color',
    'ethernet_ports': 'Network Ports',
    'power_ports': 'Power Ports',
    'cpu': 'CPU',
    'memory': 'Memory',
    'storage': 'Storage',
    'comment': "Comment"
}

const modelsMainPath = 'models/';
const modelDownloadFileName = 'models.csv';

export default class ModelsView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // modals
            showCreateModal: false,
            showImportModal: false,

            // table items
            items: [],
            rows: [],

            // vals for creating a new model
            createdModel : {
                'vendor': '',
                'model_number': '',
                'mount_type': '',
                'height': '',
                'display_color': '#A52A2A',
                'ethernet_ports': '',
                'power_ports': '',
                'cpu': '',
                'memory': '',
                'storage': '',
                'comment': '',
            },
            createdVendor: '',
            createdModelNum: '',
            createdMountType: '',
            createdHeight: '',
            createdDispClr: '',
            createdEthPorts: '',
            createdPwrPorts: '',
            createdCPU: '',
            createdMem: '',
            createdStorage: '',
            createdComments: '',

            detailedValues : {
                'vendor': '',
                'model_number': '',
                'mount_type': '',
                'height': '',
                'display_color': '',
                'ethernet_ports': '',
                'power_ports': '',
                'cpu': '',
                'memory': '',
                'storage': '',
                'comment': '',
            },

            // vals for deleting a model
            deleteVendor:'',
            deleteModel:'',

            // vals for viewing a model
            viewVendor:'',
            viewModel:'',

            // searching a model
            searchText: "",
            searchVendor: '',
            searchModelNum: '',
            searchMountType: '',
            searchMinHeight: '',
            searchMaxHeight: '',
            searchMinNetworkPorts: '',
            searchMaxNetworkPorts: '',
            searchMinPower: '',
            searchMaxPower: '',
            searchCPU: '',
            searchMinMem: '',
            searchMaxMem: '',
            searchStore: '',
            searchComment: '',

            // csv data
            csvData: '',

            showStatus: false,
            statusSeverity: '',
            statusMessage: '',
            detailshowStatus: false,
            detailStatusSeverity: '',
            detailStatusMessage: '',
            createshowStatus: false,
            statusSeverity:' ',
            statusMessage: '',

            vendorsList: [],
            madeVendorQuery: false,
        };

        axios.defaults.headers.common['token'] = this.props.token;
        axios.defaults.headers.common['privilege'] = this.props.privilege;
    }

    componentDidMount() {
        this.searchModels();
        this.getVendorList();
    }

    createModel = (networkPorts, mountType, color) => {
        axios.post(
            getURL(modelsMainPath, ModelCommand.create),
            {
                'vendor': this.state.createdModel[ModelInput.Vendor],
                'model_number': this.state.createdModel[ModelInput.model_number],
                'mount_type': mountType,
                'height': this.state.createdModel[ModelInput.Height],
                'display_color': color,
                'ethernet_ports': this.state.createdModel[ModelInput.ethernet_ports],
                'power_ports': this.state.createdModel[ModelInput.power_ports],
                'cpu': this.state.createdModel[ModelInput.CPU],
                'memory': this.state.createdModel[ModelInput.Memory],
                'storage': this.state.createdModel[ModelInput.Storage],
                'comment': this.state.createdModel[ModelInput.Comment],
                'ethernet_ports': networkPorts,
            }
            ).then(
                response => {
                    if (response.data.message === 'success') {
                        this.setState({
                            showStatus: true,
                            statusMessage: "Successfully created model",
                            statusSeverity: "success",
                            createdModel : {
                                'vendor': '',
                                'model_number': '',
                                'mount_type': '',
                                'height': '',
                                'display_color': '',
                                'ethernet_ports': '',
                                'power_ports': '',
                                'cpu': '',
                                'memory': '',
                                'storage': '',
                                'comment': '',
                            },
                            showCreateModal:false,
                        });
                        this.getVendorList();
                        this.searchModels();
                    } else {
                        this.setState({ createshowStatus: true, showStatus:true, statusMessage: response.data.message, statusSeverity: "error" })
                    }
                }).catch(
                    this.setState({ createshowStatus: true, statusMessage: ModelConstants.GENERAL_MODEL_ERROR, statusSeverity: "error" })
                );
    }

    editModel = (originalVendor, originalModelNum, originalHeight, detailedValues, networkPorts) => {
        axios.post(
            getURL(modelsMainPath, ModelCommand.edit),
            {
                'vendorOriginal': originalVendor,
                'model_numberOriginal': originalModelNum,
                'heightOriginal': originalHeight,
                'vendor': detailedValues[ModelInput.Vendor],
                'model_number': detailedValues[ModelInput.model_number],
                'mount_type': detailedValues[ModelInput.mount_type],
                'height': detailedValues[ModelInput.Height],
                'display_color': detailedValues[ModelInput.display_color],
                'ethernet_ports': networkPorts,
                'power_ports': detailedValues[ModelInput.power_ports],
                'cpu': detailedValues[ModelInput.CPU],
                'memory': detailedValues[ModelInput.Memory],
                'storage': detailedValues[ModelInput.Storage],
                'comment': detailedValues[ModelInput.Comment],
            }
            ).then(
                response => {
                    if (response.data.message === 'success') {
                        this.setState({
                            showStatus: true,
                            statusSeverity: 'success',
                            statusMessage: "Successfully edited model",
                            showDetailedView: false
                        });
                        this.getVendorList();
                        this.searchModels();
                    } else {
                        this.setState({ detailshowStatus: true, detailStatusMessage: response.data.message, detailStatusSeverity: "error" })
                    }
                }).catch(
                    this.setState({ detailshowStatus: true, detailStatusMessage: ModelConstants.GENERAL_MODEL_ERROR, detailStatusSeverity: "error" })
                );
    }

    deleteModel = (originalVendor, originalModelNumber) => {
        axios.post(
            getURL(modelsMainPath, ModelCommand.delete),
            {
                'vendor': originalVendor,
                'model_number': originalModelNumber,
            }
            ).then(
                response => {
                    if (response.data.message === 'success') {
                        this.setState({
                            showStatus: true,
                            statusSeverity:'success',
                            statusMessage: "Successfully deleted model",
                        });
                        this.getVendorList();
                        this.searchModels();
                    } else {
                        this.setState({ showStatus: true, statusMessage: response.data.message, statusSeverity: "error" })
                    }
                });
    }

    detailViewModel = (vendor, modelNum) => {
        axios.post(
            getURL(modelsMainPath, ModelCommand.detailView),
            {
                'vendor': vendor,
                'model_number': modelNum,
            }
            ).then(response => {
                this.setState({ detailedValues: response.data['models'][0], detailViewLoading: false});
            }
            ).catch(function(error) {
                this.setState({ showStatus: true, statusMessage: ModelConstants.GENERAL_MODEL_ERROR, statusSeverity:"error" });
            });

        this.setState({
            viewVendor: '',
            viewModel: '',
        });
    }

    searchModels = () => {
        const filter = {
            "vendor": this.state.searchVendor,
            "model_number": this.state.searchModelNum,
            'mount_type': this.state.searchMountType,
            "min_height": this.state.searchMinHeight,
            "max_height": this.state.searchMaxHeight,
            "min_ethernet_ports": this.state.searchMinNetworkPorts,
            "max_ethernet_ports": this.state.searchMaxNetworkPorts,
            "min_power_ports": this.state.searchMinPower,
            "max_power_ports": this.state.searchMaxPower,
            'cpu': this.state.searchCPU,
            'min_memory': this.state.searchMinMem,
            'max_memory': this.state.searchMaxMem,
            'storage': this.state.searchStore,
            'comment': this.state.searchComment,
        };

        axios.post(
            getURL(modelsMainPath, ModelCommand.search),
            {
                'filter': {
                    'vendor': "",
                    'model_number': "",
                    'height': ""
                }
            }
            ).then(response => {
                const models = response.data['models'] === undefined ? [] : response.data['models'];
                var rows = [];
                Object.values(models).forEach(model => {
                    var row = {};
                    Object.keys(model).forEach(key => {
                        if (key in columnLookup) {
                            row[columnLookup[key]] = model[key];
                        } else {
                            row[key] = model[key];
                        }
                    });


                    if (
                        (filter["vendor"] == undefined || filter["vendor"] === "" || row["Vendor"] === undefined || row["Vendor"].includes(filter["vendor"])) &&
                        (filter["model_number"] === undefined || filter["model_number"] === "" || row["Model Number"].includes(filter["model_number"])) &&
                        (filter["mount_type"] === undefined || filter["mount_type"] === "" || row["Mount Type"] === filter["mount_type"]) &&
                        (filter["min_height"] === undefined || filter["min_height"] === "" ||  row["Height"] >= parseInt(filter["min_height"])) &&
                        (filter["max_height"] === undefined || filter["max_height"] === "" ||  row["Height"] <= parseInt(filter["max_height"])) &&

                        (filter["min_ethernet_ports"] === undefined || filter["min_ethernet_ports"] === "" ||  row["Network Ports"].length >= parseInt(filter["min_ethernet_ports"])) &&
                        (filter["max_ethernet_ports"] === undefined || filter["max_ethernet_ports"] === "" ||  row["Network Ports"].length <= parseInt(filter["max_ethernet_ports"])) &&


                        (filter["min_power_ports"] === undefined || filter["min_power_ports"] === "" ||  row["Power Ports"] >= parseInt(filter["min_power_ports"])) &&
                        (filter["max_power_ports"] === undefined || filter["max_power_ports"] === "" ||  row["Power Ports"] <= parseInt(filter["max_power_ports"])) &&


                        (filter["cpu"] === undefined || filter["cpu"] === "" || row["CPU"] === null || row["CPU"].includes(filter["cpu"])) &&
                        (filter["min_memory"] === undefined || filter["min_memory"] === "" ||  row["Memory"] >= parseInt(filter["min_memory"])) &&
                        (filter["max_memory"] === undefined || filter["max_memory"] === "" ||  row["Memory"] <= parseInt(filter["max_memory"])) &&

                        (filter["storage"] === undefined || filter["storage"] === "" || row["Storage"] === null || row["Storage"].includes(filter["storage"])) &&
                        (filter["comment"] === undefined || filter["comment"] === "" || row["Comment"] === null || row["Comment"].includes(filter["comment"]))
                    ) {
                        rows.push(row);
                    }

                });

                this.setState({ rows: rows, items: models })
            });

        this.setState({
            searchText: '',
        });
    }

    getVendorList = () => {
        axios.get(
            getURL(modelsMainPath, ModelCommand.VENDOR_VALUES), {}
        ).then(response => this.setState({ vendorsList: response.data.results }));

        this.setState({ madeVendorQuery: true });
    }

    sendUploadedFile = (data) => {
        axios.post(
            getURL("models/", ModelCommand.UPLOAD_FILE), data
        ).then(response => {
                if (response.data.message === 'success') {
                    this.setState({ showStatus: true, statusMessage: response.data.summary, statusSeverity: 'success', showImportModal: false,})
                    this.searchModels();
                } else {
                    this.setState({ showStatus: true, statusMessage: response.data.message, statusSeverity: "error" })
                }
            });
    }

    downloadTable = () => {
        axios.post(
            getURL(modelsMainPath, ModelCommand.EXPORT_FILE),
            {
                'filter': {
                    'vendor': this.state.searchVendor,
                    'model_number': this.state.searchModelNum,
                    'height': this.state.searchHeight,
                }
            }
        ).then(response => {
            this.setState({ csvData: response.data.csvData });
            this.csvLink.link.click();
        });
    }

    search = (filters) => {
        this.setState({
            searchVendor: filters['vendor'],
            searchModelNum: filters['model_number'],
            searchMountType: filters['mount_type'],
            searchMinHeight: filters['min_height'],
            searchMaxHeight: filters['max_height'],
            searchMinNetworkPorts: filters["min_ethernet_ports"],
            searchMaxNetworkPorts: filters["max_ethernet_ports"],
            searchMinPower: filters["min_power_ports"],
            searchMaxPower: filters["max_power_ports"],
            searchCPU: filters["cpu"],
            searchMinMem: filters["min_memory"],
            searchMaxMem: filters["max_memory"],
            searchStore: filters["storage"],
            searchComment: filters["comment"],
        }, this.searchModels);
    }

    searchAll = () => {
        var filters = {
            'vendor': '',
            'model_number': '',
            'height': ''
        };

        this.search(filters);
    }

    openCreateModal = () => {
        this.setState({showCreateModal: true});
    }

    openImportModal = () => {
        this.setState({showImportModal: true});
    }

    showDetailedView = (row) => {
        this.setState({
            detailViewLoading: true,
         });

        var vendor = row['Vendor'];
        var modelNum = row['Model Number'];

        this.detailViewModel(vendor, modelNum);
    }

    closeCreateModal = () => {
        this.setState({showCreateModal: false});
    }

    closeImportModal = () => {
        this.setState({showImportModal: false});
    }

    closeDetailedView = () => {
        this.setState({ showDetailedView: false })
    }

    updateModelCreator = (event) => {
        this.state.createdModel[event.target.name] = event.target.value;
        this.forceUpdate();
    }

    updateModelColor = (color) => {
        this.state.createdModel['display_color'] = color;
        this.forceUpdate();
    }

    updateModelColorDetails = (color) => {
        this.state.detailedValues['display_color'] = color;
        this.forceUpdate();
    }

    updateSearchText = (event) => {
        this.setState({ searchText: event.target.value})
    }

    closeShowStatus = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({ showStatus: false })
    }

    createStatusClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({ createshowStatus: false })
    }

    detailStatusClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({ detailshowStatus: false })
    }

    render() {
        return (
            <div>
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
                            Models
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        {(this.props.privilege.admin || this.props.privilege.model) ?
                        (<div>
                            <CreateModel
                                showStatus={this.state.createshowStatus}
                                statusSeverity={this.state.statusSeverity}
                                statusClose={this.createStatusClose}
                                statusMessage={this.state.statusMessage}
                                showCreateModal={this.state.showCreateModal}
                                closeCreateModal={this.closeCreateModal}
                                createModel={this.createModel}
                                updateModelCreator={this.updateModelCreator}
                                options={this.state.vendorsList}
                                useAutocomplete={true}
                                updateModelColor={this.updateModelColor}
                                sendUploadedFile={this.sendUploadedFile}
                            />
                        </div>) : null}
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                        <FilterModel
                            updateSearchText={this.updateSearchText}
                            search={this.search}
                            filters={columns}
                            options={this.state.vendorsList}
                            useAutocomplete={true}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <ExportModel
                            downloadTable={this.downloadTable}
                            showAll={this.searchAll}
                        />
                        <CSVLink
                            data={this.state.csvData}
                            filename={modelDownloadFileName}
                            className="hidden"
                            ref={(r) => this.csvLink = r}
                            target="_blank"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <ModelsTable
                            columns={this.props.privilege.admin || this.props.privilege.model ? adminColumns : columns}
                            vals={this.state.rows}
                            privilege={this.props.privilege}
                            token={this.props.token}
                            keys={columns}
                            filters={this.props.privilege.admin || this.props.privilege.model ? adminColumns : columns}
                            updateModelColor={this.updateModelColorDetails}
                            deleteModel={this.deleteModel}
                            editModel={this.editModel}
                        />
                    </Grid>
                </Grid>
                <StatusDisplay
                    open={this.state.showStatus}
                    severity={this.state.statusSeverity}
                    closeStatus={this.closeShowStatus}
                    message={this.state.statusMessage}
                />
            </div>
        );
    }
}
