import React from 'react';

import axios from 'axios';
import { CSVLink } from "react-csv";

import Paper from '@material-ui/core/Paper';

import { AssetCommand } from '../enums/AssetCommands.ts'
import { AssetInput } from '../enums/AssetInputs.ts'
import { Privilege } from '../../enums/privilegeTypes.ts'
import AssetButtons from '../helpers/ButtonsAsset';
import FilterAsset from '../helpers/FilterAsset';
import UploadModal from '../../helpers/UploadModal';
import getURL from '../../helpers/functions/GetURL';
import DetailAsset from '../helpers/DetailsAsset';
import CreateAsset from '../helpers/CreateAsset';
import StatusDisplay from '../../helpers/StatusDisplay';
import TableView from '../../helpers/TableView';
import ErrorBoundary from '../../errors/ErrorBoundry';
import Asset from "../Asset.ts";

import * as AssetConstants from "../AssetConstants";
import "../stylesheets/AssetStyles.css";

const columns = [
    'model',
    'hostname',
    'rack',
    'rack_position',
]

const assetsMainPath = 'instances/';
const assetDownloadFileName = 'assets.csv';
const successToken = "success";
const errorToken = "error";

export default class AssetsView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showCreate:false,
            showImport:false,
            items:[],
            createdAsset: new Asset(),
            searchedAsset: new Asset(),
            statusOpen:false,
            statusSeverity:'',
            statusMessage:'',
            detailStatusOpen:false,
            detailStatusSeverity:'',
            detailStatusMessage:'',
            createStatusOpen:false,
            createStatusSeverity:'',
            createStatusMessage:'',
            deleteAssetRack:'',
            deleteAssetrack_position:'',
            viewAssetRack:'',
            viewAssetrack_position:'',
            csvData:'',
            importedFile:null,
            showDetailedView: false,
            detailViewLoading:false,
            detailedValues : new Asset(),
            originalRack:'',
            originalrack_position:'',

            modelList:[],
            madeModelQuery: false,
            ownerList:[],
            madeOwnerQuery: false,
        };

        axios.defaults.headers.common['token'] = this.props.token;
        axios.defaults.headers.common['privilege'] = this.props.privilege;

    }

    createAsset = () => {
        axios.post(
            getURL(assetsMainPath, AssetCommand.create),this.state.createdAsset.getAssetAsJSON()
            ).then(response => {
                if (response.data.message === successToken) {
                    this.setState({
                        showStatus: true,
                        statusMessage: "Successfully created asset",
                        statusSeverity:successToken,
                        createdAsset : new Asset(),
                        showCreate:false,
                    });
                    this.searchAssets();
                } else {
                    this.setState({ createStatusOpen: true, createStatusMessage: response.data.message, createStatusSeverity:errorToken })
                }
            });
    }

    editAsset = () => {
        let body = this.state.detailedValues.getAssetAsJSON();
        body[AssetInput.RACK_ORIGINAL] = this.state.originalRack;
        body[AssetInput.RACK_U_ORIGINAL] = this.state.originalrack_position;
        axios.post(
            getURL(assetsMainPath, AssetCommand.edit),body
            ).then(response => {
                if (response.data.message === successToken) {
                    this.setState({
                        showStatus: true,
                        statusMessage: "Successfully edited asset",
                        statusSeverity:successToken,
                        detailedValues : new Asset(),
                        showDetailedView:false,
                    });
                    this.searchAssets();

                } else {
                    this.setState({ detailStatusOpen: true, detailStatusMessage: response.data.message, detailStatusSeverity:errorToken })
                }
            });
    }


    deleteAsset = () => {
        var body = {};
        body[AssetInput.RACK] = this.state.originalRack;
        body[AssetInput.RACK_U] = this.state.originalrack_position;

        axios.post(
            getURL(assetsMainPath, AssetCommand.delete), body
            ).then(response => {
                if (response.data.message === successToken) {
                    this.setState({
                        showStatus: true,
                        statusMessage: "Successfully deleted asset",
                        statusSeverity:successToken,
                        originalRack:'',
                        originalrack_position:'',
                        showDetailedView:false
                    });
                    this.searchAssets();
                } else {
                    this.setState({ showStatus: true, statusMessage: response.data.message, statusSeverity:errorToken })
                }
            });
    }

    detailViewAsset = (rack, rack_position) => {
        var body = {};
        body[AssetInput.RACK] = rack;
        body[AssetInput.RACK_U] = rack_position;

        axios.post(
            getURL(assetsMainPath, AssetCommand.detailView), body
            ).then(response => this.setState({ detailedValues: response.data['assets'][0], detailViewLoading:false})
            );

        this.setState({
            viewAssetRack:'',
        });
    }

    searchAssets = () => {
        axios.post(
            getURL(assetsMainPath, AssetCommand.search),{ 'filter':this.state.searchedAsset.getAssetAsJSON() }
            ).then(response => {
                this.setState({ items: response.data['assets'] });
            });
    }

    getModelList = () => {
        this.setState({ madeModelQuery: true });
        axios.get(
            getURL(assetsMainPath, AssetCommand.GET_ALL_MODELS), {}
            ).then(response => this.setState({ modelList: response.data.results }));

    }

    getUserList = () => {
        this.setState({ madeOwnerQuery: true });
        axios.get(
            getURL(assetsMainPath, AssetCommand.GET_ALL_OWNERS)
            ).then(response => this.setState({ ownerList: response.data.results }));

    }

    sendUploadedFile = (data) => {
        axios.post(
            getURL(assetsMainPath, AssetCommand.UPLOAD_FILE), data
            ).then(response => {
                if (response.data.message === successToken) {
                    this.setState({ showStatus: true, statusMessage: response.data.summary, statusSeverity:successToken, showImport: false,})
                    this.searchAssets();
                } else {
                    this.setState({ showStatus: true, statusMessage: response.data.message, statusSeverity:errorToken })
                }
            });
    }

    search = (filters) => {
        Object.keys(filters).map(function(key) {
            this.state.searchedAsset.updateVal(key, filters[key]);
        });

        this.searchAssets();
    }

    downloadTable = () => {
        axios.post(
            getURL(assetsMainPath, AssetCommand.EXPORT_FILE), { 'filter':this.state.searchedAsset.getAssetAsJSON() }
            ).then(response => {
                this.setState({ csvData: response.data.csvData });
                this.csvLink.link.click();
            });
    }

    openCreateModal = () => {
        this.getModelList();
        this.setState({showCreate: true});
    }

    openImportModal = () => {
        this.setState({showImport: true});
    }

    showDetailedView = (id) => {
        this.setState({
            showDetailedView: true,
            detailViewLoading:true,
            originalRack: this.state.items[id][AssetInput.RACK],
            originalrack_position: this.state.items[id][AssetInput.RACK_U],
        });

        var rack = this.state.items[id][AssetInput.RACK];
        var rack_position = this.state.items[id][AssetInput.RACK_U];

        this.detailViewAsset(rack, rack_position);
    }

    closeCreateModal = () => {
        this.setState({showCreate: false});
    }

    closeImportModal = () => {
        this.setState({showImport: false});
    }

    closeDetailedView = () => {
        this.setState({ showDetailedView: false })
    }

    updateAssetCreator = (event) => {
        this.state.createdAsset.updateVal(event.target.value);
        this.forceUpdate();
    }

    updateAssetEdited = (event) => {
        this.state.detailedValues.updateVal(event.target.value);
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
        console.log(this.state.madeModelQuery);
        console.log(this.state.madeOwnerQuery)
        this.searchAssets();
        this.getModelList();
        this.getUserList();
    }

    render() {
        return (
            <div class="root">
                <ErrorBoundary>
                <Paper elevation={3}>
                <StatusDisplay
                    open={this.state.showStatus}
                    severity={this.state.statusSeverity}
                    closeStatus={this.closeShowStatus}
                    message={this.state.statusMessage}
                />
                {(this.props.privilege === Privilege.ADMIN) ?
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

                            showCreate={this.state.showCreate}
                            closeCreateModal={this.closeCreateModal}
                            createAsset={this.createAsset}
                            updateAssetCreator={this.updateAssetCreator}
                            options={this.state.modelList}
                            useAutocomplete={true}
                        />
                        <UploadModal
                            showImport={this.state.showImport}
                            closeImportModal={this.closeImportModal}
                            uploadFile={this.uploadFile}
                            chooseFile={this.chooseFile}
                            textDescription="The following format should be used for each row: hostname,rack,rack_position,vendor,model_number,owner,comment"
                        />
                        </div>):null}
                {/*<FilterAsset
                    search={this.search}
                    filters={columns}
                />*/}
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
                    updateModelEdited={this.updateAssetEdited}
                    defaultValues={this.state.detailedValues}
                    loading={this.state.detailViewLoading}
                    edit={this.editAsset}
                    delete={this.deleteAsset}
                    disabled={this.props.privilege===Privilege.USER}
                />
            </Paper>
            </ErrorBoundary>
            </div>
        );
    }
}
