import React from 'react';
import axios from 'axios';
import { AssetCommand } from '../enums/AssetCommands.ts'
import { AssetInput } from '../enums/AssetInputs.ts'
import { Privilege } from '../../enums/privilegeTypes.ts'
import { CSVLink } from "react-csv";
import AssetButtons from '../helpers/ButtonsAsset';
import FilterAsset from '../helpers/FilterAsset';
import UploadModal from '../../helpers/UploadModal';
import getURL from '../../helpers/functions/GetURL';
import DetailAsset from '../helpers/DetailsAsset';
import CreateAsset from '../helpers/CreateAsset';
import StatusDisplay from '../../helpers/StatusDisplay';
import TableView from '../../helpers/TableView';
import ErrorBoundary from '../../errors/ErrorBoundry';
import * as AssetConstants from "../AssetConstants";

const inputs = [
    'model',
    'hostname',
    'rack',
    'rack_position',
    'owner',
    'comment',
]

const columns = [
    'model',
    'hostname',
    'rack',
    'rack_position',
]

const assetsMainPath = 'assets/';
const assetDownloadFileName = 'assets.csv';



export default class AssetsView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            // modals
            showCreateModal:false,
            showImportModal:false,

            // table items
            items:[], //Constants.testAssetArray,

            // vals for creating a new asset
            createdAsset : {
                'model':'',
                'hostname':'',
                'rack':'',
                'rack_position':'',
                'owner':'',
                'comment':'',
            },

            statusOpen:false,
            statusSeverity:'',
            statusMessage:'',
            detailStatusOpen:false,
            detailStatusSeverity:'',
            detailStatusMessage:'',
            createStatusOpen:false,
            createStatusSeverity:'',
            createStatusMessage:'',

            // vals for deleting an asset
            deleteAssetRack:'',
            deleteAssetrack_position:'',

            // vals for viewing an asset
            viewAssetRack:'',
            viewAssetrack_position:'',

            searchModel:'',
            searchHostname:'',
            searchRack:'',
            searchRackU:'',

            // csv data
            csvData:'',
            importedFile:null,

            // detailed view
            showDetailedView: false,
            detailViewLoading:false,
            detailedValues : {
                'model':'',
                'hostname':'',
                'rack':'',
                'rack_position':'',
                'owner':'',
                'comment':'',
            },
            originalRack:'',
            originalrack_position:'',
            modelList:[],
            madeModelQuery: false,
        };

        axios.defaults.headers.common['token'] = this.props.token;
        axios.defaults.headers.common['privilege'] = this.props.privilege;

    }

    createAsset = () => {
        axios.post(
            getURL(assetsMainPath, AssetCommand.create),
            {
                'model':this.state.createdAsset[AssetInput.Model],
                'hostname':this.state.createdAsset[AssetInput.Hostname],
                'rack':this.state.createdAsset[AssetInput.Rack],
                'rack_position':this.state.createdAsset[AssetInput.RackU],
                'owner':this.state.createdAsset[AssetInput.Owner],
                'comment':this.state.createdAsset[AssetInput.Comment],
            }
            ).then(response => {
                if (response.data.message === 'success') {
                    this.setState({
                        showStatus: true,
                        statusMessage: "Successfully created asset",
                        statusSeverity:"success",
                        createdAsset : {
                            'model':'',
                            'hostname':'',
                            'rack':'',
                            'rack_position':'',
                            'owner':'',
                            'comment':'',
                        },
                        showCreateModal:false,
                    });
                    this.searchAssets();
                } else {
                    this.setState({ createStatusOpen: true, createStatusMessage: response.data.message, createStatusSeverity:"error" })
                }
            }).catch(
                this.setState({ createStatusOpen: true, createStatusMessage: AssetConstants.GENERAL_ASSET_ERROR, createStatusSeverity:"error" })
            );
    }

    editAsset = () => {
        axios.post(
            getURL(assetsMainPath, AssetCommand.edit),
            {
                'rackOriginal':this.state.originalRack,
                'rack_positionOriginal':this.state.originalrack_position,
                'model':this.state.detailedValues[AssetInput.Model],
                'hostname':this.state.detailedValues[AssetInput.Hostname],
                'rack':this.state.detailedValues[AssetInput.Rack],
                'rack_position':this.state.detailedValues[AssetInput.RackU],
                'owner':this.state.detailedValues[AssetInput.Owner],
                'comment':this.state.detailedValues[AssetInput.Comment],
            }
            ).then(response => {
                if (response.data.message === 'success') {
                    this.setState({
                        showStatus: true,
                        statusMessage: "Successfully edited asset",
                        statusSeverity:"success",
                        detailedValues : {
                            'model':'',
                            'hostname':'',
                            'rack':'',
                            'rack_position':'',
                            'owner':'',
                            'comment':'',
                        },
                        showDetailedView:false,
                    });
                    this.searchAssets();

                } else {
                    this.setState({ detailStatusOpen: true, detailStatusMessage: response.data.message, detailStatusSeverity:"error" })
                }
            }).catch(
                this.setState({ detailStatusOpen: true, detailStatusMessage: AssetConstants.GENERAL_ASSET_ERROR, detailStatusSeverity:"error" })
            );
    }


    deleteAsset = () => {
        axios.post(
            getURL(assetsMainPath, AssetCommand.delete),
            {
                'rack':this.state.originalRack,
                'rack_position':this.state.originalrack_position,
            }
            ).then(response => {
                if (response.data.message === 'success') {
                    this.setState({
                        showStatus: true,
                        statusMessage: "Successfully deleted asset",
                        statusSeverity:"success",
                        originalRack:'',
                        originalrack_position:'',
                        showDetailedView:false
                    });
                    this.searchAssets();
                } else {
                    this.setState({ showStatus: true, statusMessage: response.data.message, statusSeverity:"error" })
                }
            }).catch(
                this.setState({ showStatus: true, statusMessage: AssetConstants.GENERAL_ASSET_ERROR, statusSeverity:"error" })
            );
    }

    detailViewAsset = (rack, rack_position) => {
        axios.post(
            getURL(assetsMainPath, AssetCommand.detailView),
            {
                'rack':rack,
                'rack_position':rack_position,
            }
            ).then(response => this.setState({ detailedValues: response.data['assets'][0], detailViewLoading:false})
            ).catch(
                this.setState({ showStatus: true, statusMessage: AssetConstants.GENERAL_ASSET_ERROR, statusSeverity:"error" })
            );

        this.setState({
            viewAssetRack:'',
        });
    }

    searchAssets = () => {
        axios.post(
            getURL(assetsMainPath, AssetCommand.search),
            {
                'filter':{
                    'model':this.state.searchModel,
                    'hostname':this.state.searchHostname,
                    'rack':this.state.searchRack,
                    'rack_position':this.state.searchRackU,
                }
            }
            ).then(response => {
                this.setState({ items: response.data['assets'] });
            });
    }

    getModelList = () => {
        axios.get(
            getURL(assetsMainPath, AssetCommand.GET_ALL_MODELS), {}
            ).then(response => this.setState({ modelList: response.data.results }));
        this.setState({ madeModelQuery: true });
    }

    sendUploadedFile = (data) => {
        axios.post(
            getURL(assetsMainPath, AssetCommand.UPLOAD_FILE), data
            ).then(response => {
                if (response.data.message === 'success') {
                    this.setState({ showStatus: true, statusMessage: response.data.summary, statusSeverity:'success', showImportModal: false,})
                    this.searchAssets();
                } else {
                    this.setState({ showStatus: true, statusMessage: response.data.message, statusSeverity:"error" })
                }
            });
    }

    search = (filters) => {
        this.setState({
            searchModel:filters['model'],
            searchHostname:filters['hostname'],
            searchRack:filters['rack'],
            searchRackU:filters['rack_position'],
        }, this.searchAssets);
    }

    downloadTable = () => {
        axios.post(
            getURL(assetsMainPath, AssetCommand.EXPORT_FILE),
            {
                'filter':{
                    'model':this.state.searchModel,
                    'hostname':this.state.searchHostname,
                    'rack':this.state.searchRack,
                    'rack_position':this.state.searchRackU,
                }
            }
            ).then(response => {
                this.setState({ csvData: response.data.csvData });
                this.csvLink.link.click();
            });
    }

    openCreateModal = () => {
        this.getModelList();
        this.setState({showCreateModal: true});
    }

    openImportModal = () => {
        this.setState({showImportModal: true});
    }

    showDetailedView = (id) => {
        this.setState({
            showDetailedView: true,
            detailViewLoading:true,
            originalRack: this.state.items[id]['rack'],
            originalrack_position: this.state.items[id]['rack_position'],
        });

        var model = this.state.items[id]['model'];
        var hostname = this.state.items[id]['hostname'];
        var rack = this.state.items[id]['rack'];
        var rack_position = this.state.items[id]['rack_position'];

        this.detailViewAsset(rack, rack_position);
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

    updateAssetCreator = (event) => {
        this.state.createdAsset[event.target.name] = event.target.value;
        this.forceUpdate()
    }

    updateAssetEdited = (event) => {
        this.state.detailedValues[event.target.name] = event.target.value;
        this.forceUpdate()
    }

    closeShowStatus = () => {
        this.setState({ showStatus: false })
    }

    createStatusClose = () => {
        this.setState({ createStatusOpen: false })
    }

    detailStatusClose = () => {
        this.setState({ detailStatusOpen: false })
    }

    uploadFile = () => {
        const data = new FormData();
        data.append('file', this.state.importedFile);
        this.sendUploadedFile(data);
    }

    chooseFile = (event) => {
        this.setState({ importedFile: event.target.files[0] })
    }

    initialize = () => {
        this.searchAssets();
        this.getModelList();
    }

    render() {
        return (
            <div>
                <ErrorBoundary>
                {(this.state.madeModelQuery) ? null: this.initialize()}
                <StatusDisplay
                    open={this.state.showStatus}
                    severity={this.state.statusSeverity}
                    closeStatus={this.closeShowStatus}
                    message={this.state.statusMessage}
                />
                {(this.props.privilege == Privilege.ADMIN) ?
                    (<div>
                <AssetButtons
                    openCreateModal={this.openCreateModal}
                    openImportModal={this.openImportModal}
                    downloadTable={this.downloadTable}
                />
                <CSVLink
                    data={this.state.csvData}
                    filename={assetDownloadFileName}
                    className="hidden"
                    ref={(r) => this.csvLink = r}
                    target="_blank"
                />
                <CreateAsset
                    statusOpen={this.state.createStatusOpen}
                    statusSeverity={this.state.createStatusSeverity}
                    statusClose={this.createStatusClose}
                    statusMessage={this.state.createStatusMessage}

                    showCreateModal={this.state.showCreateModal}
                    closeCreateModal={this.closeCreateModal}
                    createModel={this.createAsset}
                    updateModelCreator={this.updateAssetCreator}
                    inputs={inputs}
                    options={this.state.modelList}
                    useAutocomplete={true}
                />
                <UploadModal
                    showImportModal={this.state.showImportModal}
                    closeImportModal={this.closeImportModal}
                    uploadFile={this.uploadFile}
                    chooseFile={this.chooseFile}
                    textDescription="The following format should be used for each row: hostname,rack,rack_position,vendor,model_number,owner,comment"
                /></div>):null
            }
                <FilterAsset
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
                <DetailAsset
                    statusOpen={this.state.detailStatusOpen}
                    statusSeverity={this.state.detailStatusSeverity}
                    statusClose={this.detailStatusClose}
                    statusMessage={this.state.detailStatusMessage}

                    showDetailedView={this.state.showDetailedView}
                    closeDetailedView={this.closeDetailedView}
                    inputs={inputs}
                    updateModelEdited={this.updateAssetEdited}
                    defaultValues={this.state.detailedValues}
                    loading={this.state.detailViewLoading}
                    edit={this.editAsset}
                    delete={this.deleteAsset}
                    disabled={this.props.privilege==Privilege.USER}
                />
            </ErrorBoundary>
            </div>
        );
    }
}
