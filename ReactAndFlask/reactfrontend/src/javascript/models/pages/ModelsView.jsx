import React from 'react';
import axios from 'axios';
import { CSVLink } from "react-csv";

import { ModelCommand } from '../enums/ModelCommands.ts'
import { ModelInput } from '../enums/ModelInputs.ts'

import ExportModel from '../helpers/ExportModel';
import FilterModel from '../helpers/FilterModel';
import CreateModel from '../helpers/CreateModel';

import { Privilege } from '../../enums/privilegeTypes.ts'

import getURL from '../../helpers/functions/GetURL';
import ModelsTable from '../helpers/ModelsTable';
import { Typography } from '@material-ui/core';

import * as ModelConstants from "../ModelConstants";
import Grid from '@material-ui/core/Grid';

const columns = [
    'Vendor',
    'Model Number',
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
                'vendor':'',
                'model_number':'',
                'height':'',
                'display_color':'',
                'ethernet_ports':'',
                'power_ports':'',
                'cpu':'',
                'memory':'',
                'storage':'',
                'comment':'',
            },
            createdVendor:'',
            createdModelNum:'',
            createdHeight:'',
            createdDispClr:'',
            createdEthPorts:'',
            createdPwrPorts:'',
            createdCPU:'',
            createdMem:'',
            createdStorage:'',
            createdComments:'',

            // vals for deleting a model
            deleteVendor:'',
            deleteModel:'',

            // vals for viewing a model
            viewVendor:'',
            viewModel:'',

            // searching a model
            searchText:"",
            searchVendor:'',
            searchModelNum:'',
            searchHeight:'',

            // csv data
            csvData:'',

            // detailed view
            showDetailedView: false,
            detailViewLoading:false,
            detailedValues : {
                'vendor':'',
                'model_number':'',
                'height':'',
                'display_color':'',
                'ethernet_ports':'',
                'power_ports':'',
                'cpu':'',
                'memory':'',
                'storage':'',
                'comment':'',
            },
            originalVendor:'',
            originalModelNumber:'',
            originalHeight:'',

            statusOpen:false,
            statusSeverity:'',
            statusMessage:'',
            detailStatusOpen:false,
            detailStatusSeverity:'',
            detailStatusMessage:'',
            createStatusOpen:false,
            createStatusSeverity:'',
            createStatusMessage:'',

            vendorsList:[],
            madeVendorQuery:false,

        };

        axios.defaults.headers.common['token'] = this.props.token;
        axios.defaults.headers.common['privilege'] = this.props.privilege;
    }

    componentDidMount() {
        this.searchModels();
        this.getVendorList();
    }

    createModel = (networkPorts) => {
        axios.post(
            getURL(modelsMainPath, ModelCommand.create),
            {
                'vendor':this.state.createdModel[ModelInput.Vendor],
                'model_number':this.state.createdModel[ModelInput.model_number],
                'height':this.state.createdModel[ModelInput.Height],
                'display_color':this.state.createdModel[ModelInput.display_color],
                'ethernet_ports':this.state.createdModel[ModelInput.ethernet_ports],
                'power_ports':this.state.createdModel[ModelInput.power_ports],
                'cpu':this.state.createdModel[ModelInput.CPU],
                'memory':this.state.createdModel[ModelInput.Memory],
                'storage':this.state.createdModel[ModelInput.Storage],
                'comment':this.state.createdModel[ModelInput.Comment],
                'ethernet_ports': networkPorts,
            }
            ).then(
                response => {
                    if (response.data.message === 'success') {
                        this.setState({
                            showStatus: true,
                            statusMessage: "Successfully created model",
                            statusSeverity:"success",
                            createdModel : {
                                'vendor':'',
                                'model_number':'',
                                'height':'',
                                'display_color':'',
                                'ethernet_ports':'',
                                'power_ports':'',
                                'cpu':'',
                                'memory':'',
                                'storage':'',
                                'comment':'',
                            },
                            showCreateModal:false,
                        });
                        this.getVendorList();
                        this.searchModels();
                    } else {
                        this.setState({ createStatusOpen: true, createStatusMessage: response.data.message, createStatusSeverity:"error" })
                    }
                }).catch(
                    this.setState({ createStatusOpen: true, createStatusMessage: ModelConstants.GENERAL_MODEL_ERROR, createStatusSeverity:"error" })
                );
    }

    editModel = (networkPorts) => {
        axios.post(
            getURL(modelsMainPath, ModelCommand.edit),
            {
                'vendorOriginal':this.state.originalVendor,
                'model_numberOriginal':this.state.originalModelNumber,
                'heightOriginal':this.state.originalHeight,
                'vendor':this.state.detailedValues[ModelInput.Vendor],
                'model_number':this.state.detailedValues[ModelInput.model_number],
                'height':this.state.detailedValues[ModelInput.Height],
                'display_color':this.state.detailedValues[ModelInput.display_color],
                'ethernet_ports': networkPorts,
                'power_ports':this.state.detailedValues[ModelInput.power_ports],
                'cpu':this.state.detailedValues[ModelInput.CPU],
                'memory':this.state.detailedValues[ModelInput.Memory],
                'storage':this.state.detailedValues[ModelInput.Storage],
                'comment':this.state.detailedValues[ModelInput.Comment],
            }
            ).then(
                response => {
                    if (response.data.message === 'success') {
                        this.setState({
                            showStatus: true,
                            statusSeverity:'success',
                            statusMessage: "Successfully edited model",
                            originalVendor:'',
                            originalModelNumber:'',
                            originalHeight:'',
                            detailedValues : {
                                'vendor':'',
                                'model_number':'',
                                'height':'',
                                'display_color':'',
                                'ethernet_ports':'',
                                'power_ports':'',
                                'cpu':'',
                                'memory':'',
                                'storage':'',
                                'comment':'',
                            },
                            showDetailedView:false
                        });
                        this.getVendorList();
                        this.searchModels();
                    } else {
                        this.setState({ detailStatusOpen: true, detailStatusMessage: response.data.message, detailStatusSeverity:"error" })
                    }
                }).catch(
                    this.setState({ detailStatusOpen: true, detailStatusMessage: ModelConstants.GENERAL_MODEL_ERROR, detailStatusSeverity:"error" })
                );
    }


    deleteModel = () => {
        axios.post(
            getURL(modelsMainPath, ModelCommand.delete),
            {
                'vendor':this.state.originalVendor,
                'model_number':this.state.originalModelNumber,
            }
            ).then(
                response => {
                    if (response.data.message === 'success') {
                        this.setState({
                            showStatus: true,
                            statusSeverity:'success',
                            statusMessage: "Successfully deleted model",
                            detailedValues : {
                                'vendor':'',
                                'model_number':'',
                                'height':'',
                                'display_color':'',
                                'ethernet_ports':'',
                                'power_ports':'',
                                'cpu':'',
                                'memory':'',
                                'storage':'',
                                'comment':'',
                            },
                            showDetailedView:false
                        });
                        this.getVendorList();
                        this.searchModels();
                    } else {
                        this.setState({ showStatus: true, statusMessage: response.data.message, statusSeverity:"error" })
                    }
                }).catch(
                    this.setState({ showStatus: true, statusMessage: ModelConstants.GENERAL_MODEL_ERROR, statusSeverity:"error" })
                );
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
        axios.post(
            getURL(modelsMainPath, ModelCommand.search),
            {
                'filter': {
                    'vendor': this.state.searchVendor,
                    'model_number': this.state.searchModelNum,
                    'height': this.state.searchHeight,
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
                    rows.push(row);
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
            getURL(modelsMainPath, ModelCommand.UPLOAD_FILE), data
            ).then(response => {
                if (response.data.message === 'success') {
                    this.setState({ showStatus: true, statusMessage: response.data.summary, statusSeverity:'success', showImportModal: false,})
                    this.searchModels();
                } else {
                    this.setState({ showStatus: true, statusMessage: response.data.message, statusSeverity:"error" })
                }
            });
    }

    downloadTable = () => {
        axios.post(
            getURL(modelsMainPath, ModelCommand.EXPORT_FILE),
            {
                'filter': {
                    'vendor':this.state.searchVendor,
                    'model_number':this.state.searchModelNum,
                    'height':this.state.searchHeight,
                }
            }
            ).then(response => {
                this.setState({ csvData: response.data.csvData });
                this.csvLink.link.click();
            });
    }

    search = (filters) => {
        this.setState({ searchVendor: filters['vendor'], searchModelNum: filters['model_number'], searchHeight: filters['height']}, this.searchModels);
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

    showDetailedView = (id) => {
        this.setState({
            showDetailedView: true,
            detailViewLoading: true,

            originalHeight: this.state.items[id]['height'],
            originalModelNumber: this.state.items[id]['model_number'],
            originalVendor: this.state.items[id]['vendor'],
         });

        var vendor = this.state.items[id]['vendor'];
        var modelNum = this.state.items[id]['model_number'];

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

    updateModelEdited = (event) => {
        this.state.detailedValues[event.target.name] = event.target.value;
        this.forceUpdate()
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
        this.setState({ createStatusOpen: false })
    }

    detailStatusClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({ detailStatusOpen: false })
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
                        {(this.props.privilege == Privilege.ADMIN) ?
                        (<div>
                            <CreateModel
                                statusOpen={this.state.createStatusOpen}
                                statusSeverity={this.state.createStatusSeverity}
                                statusClose={this.createStatusClose}
                                statusMessage={this.state.createStatusMessage}
                                showCreateModal={this.state.showCreateModal}
                                closeCreateModal={this.closeCreateModal}
                                createModel={this.createModel}
                                updateModelCreator={this.updateModelCreator}
                                options={this.state.vendorsList}
                                useAutocomplete={true}
                                updateModelColor={this.updateModelColor}
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
                        {(this.props.privilege === Privilege.ADMIN) ?
                        (<div>

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
                        </div>):null
                        }
                    </Grid>
                    <Grid item xs={12}>
                        <ModelsTable
                            columns={this.props.privilege == Privilege.ADMIN ? adminColumns : columns}
                            vals={this.state.rows}
                            privilege={this.props.privilege}
                            keys={columns}
                            showDetailedView={this.showDetailedView}
                            filters={this.props.privilege == Privilege.ADMIN ? adminColumns : columns}
                            updateModelEdited={this.updateModelEdited}
                            updateModelColor={this.updateModelColorDetails}
                            saveModel={this.editModel}
                            deleteModel={this.deleteModel}
                        />
                    </Grid>
                </Grid>
            </div>
        );
    }
}
