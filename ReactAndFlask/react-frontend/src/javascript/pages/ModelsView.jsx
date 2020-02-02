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

const inputs = [
    'vendor',
    'model_number',
    'height',
    'display_color',
    'eth_ports',
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
                'eth_ports':'',
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

            // csv data
            csvData:[],

            // detailed view
            showDetailedView: false,
            detailViewLoading:false,
            detailedValues : {
                'vendor':'',
                'model_number':'',
                'height':'',
                'display_color':'',
                'eth_ports':'',
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
                'eth_ports':this.state.createdModel[ModelInput.eth_ports],
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
                                'eth_ports':'',
                                'power_ports':'',
                                'cpu':'',
                                'memory':'',
                                'storage':'',
                                'comments':'',
                            },
                            showCreateModal:false,
                        });
                        this.getVendorList();
                    } else {
                        this.setState({ showStatus: true, statusMessage: response.data.message, statusSeverity:"error" })
                    }
                });

        this.setState({
            createdModel : {
                'vendor':'',
                'model_number':'',
                'height':'',
                'display_color':'',
                'eth_ports':'',
                'power_ports':'',
                'cpu':'',
                'memory':'',
                'storage':'',
                'comments':'',
            },
            showCreateModal:false,
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
                'eth_ports':this.state.detailedValues[ModelInput.eth_ports],
                'power_ports':this.state.detailedValues[ModelInput.power_ports],
                'cpu':this.state.detailedValues[ModelInput.CPU],
                'memory':this.state.detailedValues[ModelInput.Memory],
                'storage':this.state.detailedValues[ModelInput.Storage],
                'comments':this.state.detailedValues[ModelInput.Comment],
            }
            ).then(response => console.log(response) );

        this.setState({
            originalVendor:'',
            originalModelNumber:'',
            originalHeight:'',
            detailedValues : {
                'vendor':'',
                'model_number':'',
                'height':'',
                'display_color':'',
                'eth_ports':'',
                'power_ports':'',
                'cpu':'',
                'memory':'',
                'storage':'',
                'comments':'',
            },
            showDetailedView:false
        });

        this.getVendorList();
    }


    deleteModel() {
        axios.post(
            getURL(modelsMainPath, ModelCommand.delete),
            {
                'vendor':this.state.originalVendor,
                'model_number':this.state.originalModelNumber,
            }
            ).then(response => console.log(response));

        this.setState({
            detailedValues : {
                'vendor':'',
                'model_number':'',
                'height':'',
                'display_color':'',
                'eth_ports':'',
                'power_ports':'',
                'cpu':'',
                'memory':'',
                'storage':'',
                'comments':'',
            },
            showDetailedView:false
        });
        this.getVendorList();
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

    searchModels(vendor, modelNum, height) {
        axios.post(
            getURL(modelsMainPath, ModelCommand.search),
            {
                'filter':{
                    'vendor':vendor,
                    'model_number':modelNum,
                    'height':height,
                }
            }
            ).then(response => this.setState({ items: response.data['models'] }));

        this.setState({
            searchText:'',
        });
    }

    getVendorList() {
        axios.get(
            getURL(modelsMainPath, ModelCommand.VENDOR_VALUES)
            ).then(response => this.setState({ vendorsList: response.data.results }));
    }

    search(filters) {
        this.searchModels(filters['vendor'], filters['model_number'], filters['height']);
    }

    downloadTable() {
        this.csvLink.link.click();
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
        //this.setState({ detailedValues: Constants.testModelArray[id], detailViewLoading:false})
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

    render() {
        return (
            <div>
                {this.getVendorList()}
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
            </div>
        );
    }
}
