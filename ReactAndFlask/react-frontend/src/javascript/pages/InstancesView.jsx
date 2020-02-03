import React from 'react';
import axios from 'axios';
import { InstanceCommand } from '../enums/instanceCommands.ts'
import { InstanceInput } from '../enums/instanceInputs.ts'
import { Privilege } from '../enums/privilegeTypes.ts'
import TableView from '../helpers/TableView';
import { CSVLink } from "react-csv";
import ButtonMenu from '../helpers/ButtonMenu';
import Filters from '../helpers/Filters';
import UploadModal from '../helpers/UploadModal';
import getURL from '../helpers/functions/GetURL';
import DetailedView from '../helpers/DetailedView';
import CreateModal from '../helpers/CreateModal';
import * as Constants from '../Constants';
import StatusDisplay from '../helpers/StatusDisplay';

const inputs = [
    'model',
    'hostname',
    'rack',
    'rack_u',
    'owner',
    'comment',
]

const columns = [
    'model',
    'hostname',
    'rack',
    'rack_u',
]

const instancesMainPath = 'instances/';
const instanceDownloadFileName = 'instances.csv';



export default class InstancesView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            // modals
            showCreateModal:false,
            showImportModal:false,

            // table items
            items:[], //Constants.testInstanceArray,

            // vals for creating a new instance
            createdInstance : {
                'model':'',
                'hostname':'',
                'rack':'',
                'rack_u':'',
                'owner':'',
                'comment':'',
            },

            showStatus:false,
            statusMessage:'',
            statusSeverity:'',

            // vals for deleting an instance
            deleteInstanceRack:'',
            deleteInstancerack_u:'',

            // vals for viewing an instance
            viewInstanceRack:'',
            viewInstancerack_u:'',

            // csv data
            csvData:[],

            // detailed view
            showDetailedView: false,
            detailViewLoading:false,
            detailedValues : {
                'model':'',
                'hostname':'',
                'rack':'',
                'rack_u':'',
                'owner':'',
                'comment':'',
            },
            originalRack:'',
            originalrack_u:'',
            modelList:[],
            madeModelQuery: false,
        };

        this.createInstance = this.createInstance.bind(this);
        this.editInstance = this.editInstance.bind(this);
        this.deleteInstance = this.deleteInstance.bind(this);
        this.detailViewInstance = this.detailViewInstance.bind(this);
        this.searchInstances = this.searchInstances.bind(this);
        this.search = this.search.bind(this);
        this.openCreateModal = this.openCreateModal.bind(this);
        this.openImportModal = this.openImportModal.bind(this);
        this.showDetailedView = this.showDetailedView.bind(this);
        this.closeCreateModal = this.closeCreateModal.bind(this);
        this.closeImportModal = this.closeImportModal.bind(this);
        this.closeDetailedView = this.closeDetailedView.bind(this);
        this.updateInstanceCreator = this.updateInstanceCreator.bind(this);
        this.updateInstanceEdited = this.updateInstanceEdited.bind(this);
        this.closeShowStatus = this.closeShowStatus.bind(this);
        this.getModelList = this.getModelList.bind(this);

        axios.defaults.headers.common['token'] = this.props.token;
        axios.defaults.headers.common['privilege'] = this.props.privilege;

    }

    createInstance() {
        axios.post(
            getURL(instancesMainPath, InstanceCommand.create),
            {
                'model':this.state.createdInstance[InstanceInput.Model],
                'hostname':this.state.createdInstance[InstanceInput.Hostname],
                'rack':this.state.createdInstance[InstanceInput.Rack],
                'rack_u':this.state.createdInstance[InstanceInput.RackU],
                'owner':this.state.createdInstance[InstanceInput.Owner],
                'comment':this.state.createdInstance[InstanceInput.Comment],
            }
            ).then(response => {
                if (response.data.message === 'success') {
                    this.setState({
                        showStatus: true,
                        statusMessage: "Successfully created instance",
                        statusSeverity:"success",
                        createdInstance : {
                            'model':'',
                            'hostname':'',
                            'rack':'',
                            'rack_u':'',
                            'owner':'',
                            'comment':'',
                        },
                        showCreateModal:false,
                    })
                } else {
                    this.setState({ showStatus: true, statusMessage: response.data.message, statusSeverity:"error" })
                }
            });
    }

    editInstance() {
        axios.post(
            getURL(instancesMainPath, InstanceCommand.edit),
            {
                'model':this.state.detailedValues[InstanceInput.Model],
                'hostname':this.state.detailedValues[InstanceInput.Hostname],
                'rack':this.state.detailedValues[InstanceInput.Rack],
                'rack_u':this.state.detailedValues[InstanceInput.rack_u],
                'owner':this.state.detailedValues[InstanceInput.Owner],
                'comment':this.state.detailedValues[InstanceInput.Comment],
            }
            ).then(response => console.log(response));

        this.setState({
            detailedValues : {
                'model':'',
                'hostname':'',
                'rack':'',
                'rack_u':'',
                'owner':'',
                'comment':'',
            },
            showDetailedView:false,
        });
    }


    deleteInstance() {
        axios.post(
            getURL(instancesMainPath, InstanceCommand.delete),
            {
                'rack':this.state.originalRack,
                'rack_u':this.state.originalrack_u,
            }
            ).then(response => console.log(response));

        this.setState({
            originalRack:'',
            originalrack_u:'',
            showDetailedView:false
        });
    }

    detailViewInstance(rack, rack_u) {
        axios.post(
            getURL(instancesMainPath, InstanceCommand.detailView),
            {
                'rack':rack,
                'rack_u':rack_u,
            }
            ).then(response => this.setState({ detailedValues: response.data['instances'][0], detailViewLoading:false}));

        this.setState({
            viewInstanceRack:'',
        });
    }

    searchInstances(model, hostname, rack, rack_u) {
        axios.post(
            getURL(instancesMainPath, InstanceCommand.search),
            {
                'filter':{
                    'model':model,
                    'hostname':hostname,
                    'rack':rack,
                    'rack_u':rack_u,
                }
            }
            ).then(response => this.setState({ items: response.data['instances'] }));
    }

    getModelList() {
        axios.get(
            getURL(instancesMainPath, InstanceCommand.GET_ALL_MODELS), {}
            ).then(response => this.setState({ modelList: response.data.results }));
        this.setState({ madeModelQuery: true });
    }

    search(filters) {
        this.searchInstances(filters['model'], filters['hostname'], filters['rack'], filters['rack_u']);
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
            originalRack: this.state.items[id]['rack'],
            originalrack_u: this.state.items[id]['rack_u'],
        });

        var model = this.state.items[id]['model'];
        var hostname = this.state.items[id]['hostname'];
        var rack = this.state.items[id]['rack'];
        var rack_u = this.state.items[id]['rack_u'];

        this.detailViewInstance(rack, rack_u);
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

    updateInstanceCreator(event) {
        this.state.createdInstance[event.target.name] = event.target.value;
        this.forceUpdate()
    }

    updateInstanceEdited(event) {
        this.state.detailedValues[event.target.name] = event.target.value;
        this.forceUpdate()
    }
    closeShowStatus() {
        this.setState({ showStatus: false })
    }

    render() {
        return (
            <div>
                {this.getModelList()}
                <StatusDisplay
                    open={this.state.showStatus}
                    severity={this.state.statusSeverity}
                    closeStatus={this.closeShowStatus}
                    message={this.state.statusMessage}
                />
                {(this.props.privilege == Privilege.ADMIN) ?
                    (<div>
                <ButtonMenu
                    openCreateModal={this.openCreateModal}
                    openImportModal={this.openImportModal}
                    downloadTable={this.downloadTable}
                />
                <CSVLink
                    data={this.state.csvData}
                    filename={instanceDownloadFileName}
                    className="hidden"
                    ref={(r) => this.csvLink = r}
                    target="_blank"
                />
                <CreateModal
                    showCreateModal={this.state.showCreateModal}
                    closeCreateModal={this.closeCreateModal}
                    createModel={this.createInstance}
                    updateModelCreator={this.updateInstanceCreator}
                    inputs={inputs}
                    options={this.state.modelList}
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
                    updateModelEdited={this.updateInstanceEdited}
                    defaultValues={this.state.detailedValues}
                    loading={this.state.detailViewLoading}
                    edit={this.editInstance}
                    delete={this.deleteInstance}
                />
            </div>
        );
    }
}
