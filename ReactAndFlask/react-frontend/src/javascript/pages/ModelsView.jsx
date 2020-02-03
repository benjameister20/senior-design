import React from 'react';
import axios from 'axios';
import { ModelCommand } from '../enums/modelCommands.ts'
import { ModelInput } from '../enums/modelInputs.ts'
import { Privilege } from '../enums/privilegeTypes.ts'
import TableView from '../helpers/TableView';
import { CSVLink } from "react-csv";
import ButtonMenu from '../helpers/ButtonMenu';
import Filters from '../helpers/Filters';
import UploadModal from '../helpers/UploadModal';
import getURL from '../helpers/functions/GetURL';
import DetailedView from '../helpers/DetailedView';
import CreateModal from '../helpers/CreateModal';
import StatusDisplay from '../helpers/StatusDisplay';
import ErrorBoundray from '../errors/ErrorBoundry';

const inputs = [
    'vendor',
    'model_number',
    'height',
    'display_color',
    'ethernet_ports',
    'power_ports',
    'cpu',
    'memory',
    'storage',
    'comments',
]

const columns = [
    'vendor',
    'model_number',
    'height',
]

const modelsMainPath = 'models/';
const modelDownloadFileName = 'models.csv';

export default class ModelsView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            // modals
            showCreateModal:false,
            showImportModal:false,

            // table items
            items:[], //Constants.testModelArray,

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
                'comments':'',
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
            importedFile:null,

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
                'comments':'',
            },
            originalVendor:'',
            originalModelNumber:'',
            originalHeight:'',

            showStatus:false,
            statusSeverity:'',
            statusMessage:'',

            vendorsList:[],
            madeVendorQuery:false,

        };

        this.openCreateModal = this.openCreateModal.bind(this);
        this.openImportModal = this.openImportModal.bind(this);
        this.downloadTable = this.downloadTable.bind(this);
        this.updateSearchText = this.updateSearchText.bind(this);
        this.search = this.search.bind(this);
        this.closeImportModal = this.closeImportModal.bind(this);
        this.closeCreateModal = this.closeCreateModal.bind(this);
        this.showDetailedView = this.showDetailedView.bind(this);
        this.editModel = this.editModel.bind(this);
        this.closeDetailedView = this.closeDetailedView.bind(this);
        this.updateModelEdited = this.updateModelEdited.bind(this);
        this.closeCreateModal = this.closeCreateModal.bind(this);
        this.createModel = this.createModel.bind(this);
        this.updateModelCreator = this.updateModelCreator.bind(this);
        this.deleteModel = this.deleteModel.bind(this);
        this.closeShowStatus = this.closeShowStatus.bind(this);
        this.getVendorList = this.getVendorList.bind(this);
        this.chooseFile = this.chooseFile.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.sendUploadedFile = this.sendUploadedFile.bind(this);

        axios.defaults.headers.common['token'] = this.props.token;
        axios.defaults.headers.common['privilege'] = this.props.privilege;
    }

    createModel() {
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
                'comments':this.state.createdModel[ModelInput.Comment],
            }
            ).then(
                response => {
                    if (response.data.message === 'success') {
                        this.setState({
                            showStatus: true,
                            statusMessage:'success',
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
                                'comments':'',
                            },
                            showCreateModal:false,
                        });
                        this.getVendorList();
                        this.searchModels();
                    } else {
                        this.setState({ showStatus: true, statusMessage: response.data.message, statusSeverity:"error" })
                    }
                });
    }

    editModel() {
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
                'ethernet_ports':this.state.detailedValues[ModelInput.ethernet_ports],
                'power_ports':this.state.detailedValues[ModelInput.power_ports],
                'cpu':this.state.detailedValues[ModelInput.CPU],
                'memory':this.state.detailedValues[ModelInput.Memory],
                'storage':this.state.detailedValues[ModelInput.Storage],
                'comments':this.state.detailedValues[ModelInput.Comment],
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
                                'comments':'',
                            },
                            showDetailedView:false
                        });
                        this.getVendorList();
                        this.searchModels();
                    } else {
                        this.setState({ showStatus: true, statusMessage: response.data.message, statusSeverity:"error" })
                    }
                });
    }


    deleteModel() {
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
                            statusMessage:'success',
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
                                'comments':'',
                            },
                            showDetailedView:false
                        });
                        this.getVendorList();
                        this.searchModels();
                    } else {
                        this.setState({ showStatus: true, statusMessage: response.data.message, statusSeverity:"error" })
                    }
                });
    }

    detailViewModel(vendor, modelNum) {
        axios.post(
            getURL(modelsMainPath, ModelCommand.detailView),
            {
                'vendor':vendor,
                'model_number':modelNum,
            }, this.props.headers
            ).then(response => this.setState({ detailedValues: response.data['models'][0], detailViewLoading:false}));

        this.setState({
            viewVendor:'',
            viewModel:'',
        });
    }

    searchModels() {
        axios.post(
            getURL(modelsMainPath, ModelCommand.search),
            {
                'filter':{
                    'vendor':this.state.searchVendor,
                    'model_number':this.state.searchModelNum,
                    'height':this.state.searchHeight,
                }
            }
            ).then(response => this.setState({ items: response.data['models'] }));

        this.setState({
            searchText:'',
        });
    }

    getVendorList() {
        axios.get(
            getURL(modelsMainPath, ModelCommand.VENDOR_VALUES), {}
            ).then(response => this.setState({ vendorsList: response.data.results }));

        this.setState({ madeVendorQuery: true });
    }

    sendUploadedFile(data) {
        axios.post(
            getURL(modelsMainPath, ModelCommand.UPLOAD_FILE), data
            ).then(response => {
                if (response.data.message === 'success') {
                    this.setState({ showStatus: true, statusMessage: 'Successfully added models', statusSeverity:'success', showImportModal: false,})
                    this.searchModels();
                } else {
                    this.setState({ showStatus: true, statusMessage: response.data.message, statusSeverity:"error" })
                }
            });
    }

    downloadTable() {
        axios.post(
            getURL(modelsMainPath, ModelCommand.EXPORT_FILE),
            {
                'filter':{
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

    search(filters) {
        this.setState({ searchVendor:filters['vendor'], searchModelNum:filters['model_number'], searchHeight:filters['height']}, this.searchModels);
    }

    openCreateModal() {
        this.setState({showCreateModal: true});
    }

    openImportModal() {
        this.setState({showImportModal: true});
    }

    showDetailedView(id) {
        this.setState({
            showDetailedView: true,
            detailViewLoading:true,

            originalHeight:this.state.items[id]['height'],
            originalModelNumber:this.state.items[id]['model_number'],
            originalVendor:this.state.items[id]['vendor'],
         });

        var vendor = this.state.items[id]['vendor'];
        var modelNum = this.state.items[id]['model_number'];

        this.detailViewModel(vendor, modelNum);
    }

    closeCreateModal() {
        this.setState({showCreateModal: false});
    }

    closeImportModal() {
        this.setState({showImportModal: false});
    }

    closeDetailedView() {
        this.setState({ showDetailedView: false })
    }

    updateModelCreator(event) {
        this.state.createdModel[event.target.name] = event.target.value;
        this.forceUpdate()
    }

    updateModelEdited(event) {
        this.state.detailedValues[event.target.name] = event.target.value;
        this.forceUpdate()
    }

    updateSearchText(event) {
        this.setState({ searchText: event.target.value})
    }

    closeShowStatus() {
        this.setState({ showStatus: false })
    }

    uploadFile() {
        const data = new FormData();
        data.append('file', this.state.importedFile);
        this.sendUploadedFile(data);
    }

    chooseFile(event) {
        this.setState({ importedFile: event.target.files[0] })
    }

    render() {
        return (
            <div>
                <ErrorBoundray>
                {(this.state.madeVendorQuery) ? null: this.getVendorList()}
                <StatusDisplay
                    open={this.state.showStatus}
                    severity={this.state.statusSeverity}
                    closeStatus={this.closeShowStatus}
                    message={this.state.statusMessage}
                />
                {(this.props.privilege == Privilege.ADMIN) ?
                    (<div><ButtonMenu
                    openCreateModal={this.openCreateModal}
                    openImportModal={this.openImportModal}
                    downloadTable={this.downloadTable}
                />
                <CSVLink
                    data={this.state.csvData}
                    filename={modelDownloadFileName}
                    className="hidden"
                    ref={(r) => this.csvLink = r}
                    target="_blank"
                />
                <CreateModal
                    showCreateModal={this.state.showCreateModal}
                    closeCreateModal={this.closeCreateModal}
                    createModel={this.createModel}
                    updateModelCreator={this.updateModelCreator}
                    inputs={inputs}
                    options={this.state.vendorsList}
                    useAutocomplete={true}
                />
                <UploadModal
                    showImportModal={this.state.showImportModal}
                    closeImportModal={this.closeImportModal}
                    uploadFile={this.uploadFile}
                    chooseFile={this.chooseFile}
                /></div>):null
                }
                <Filters
                    updateSearchText={this.updateSearchText}
                    search={this.search}
                    filters={columns}
                />
                <TableView
                    columns={columns}
                    vals={this.state.items}
                    keys={columns}
                    showDetailedView={this.showDetailedView}
                    filters={columns}
                />
                <DetailedView
                    showDetailedView={this.state.showDetailedView}
                    closeDetailedView={this.closeDetailedView}
                    inputs={inputs}
                    updateModelEdited={this.updateModelEdited}
                    defaultValues={this.state.detailedValues}
                    loading={this.state.detailViewLoading}
                    edit={this.editModel}
                    delete={this.deleteModel}
                    disabled={this.props.privilege==Privilege.USER}
                />
            </ErrorBoundray>
            </div>
        );
    }
}
