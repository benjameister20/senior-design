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

const inputs = [
    'model',
    'hostname',
    'rack',
    'rackU',
    'owner',
    'comment',
]

const columns = [
    'model',
    'hostname',
    'rack',
    'rackU',
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
                'rackU':'',
                'owner':'',
                'comment':'',
            },

            // vals for deleting an instance
            deleteInstanceRack:'',
            deleteInstanceRackU:'',

            // vals for viewing an instance
            viewInstanceRack:'',
            viewInstanceRackU:'',

            // csv data
            csvData:[],

            // detailed view
            showDetailedView: false,
            detailViewLoading:false,
            detailedValues : {
                'model':'',
                'hostname':'',
                'rack':'',
                'rackU':'',
                'owner':'',
                'comment':'',
            },
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
                'rackU':this.state.createdInstance[InstanceInput.RackU],
                'owner':this.state.createdInstance[InstanceInput.Owner],
                'comment':this.state.createdInstance[InstanceInput.Comment],
            }
            ).then(response => console.log(response));

        this.setState({
            createdInstance : {
                'model':'',
                'hostname':'',
                'rack':'',
                'rackU':'',
                'owner':'',
                'comment':'',
            },
            showCreateModal:false,
        });
    }

    editInstance() {
        axios.post(
            getURL(instancesMainPath, InstanceCommand.edit),
            {
                'model':this.state.detailedValues[InstanceInput.Model],
                'hostname':this.state.detailedValues[InstanceInput.Hostname],
                'rack':this.state.detailedValues[InstanceInput.Rack],
                'rackU':this.state.detailedValues[InstanceInput.RackU],
                'owner':this.state.detailedValues[InstanceInput.Owner],
                'comment':this.state.detailedValues[InstanceInput.Comment],
            }
            ).then(response => console.log(response));

        this.setState({
            detailedValues : {
                'model':'',
                'hostname':'',
                'rack':'',
                'rackU':'',
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
                'rack':this.state.deleteInstanceRack,
                'rackU':this.state.deleteInstanceRackU,
            }
            ).then(response => console.log(response));

        this.setState({
            deleteInstanceRack:'',
            deleteInstanceRackU:'',
            showDetailedView:false
        });
    }

    detailViewInstance(rack, rackU) {
        axios.post(
            getURL(instancesMainPath, InstanceCommand.detailView),
            {
                'rack':rack,
                'rackU':rackU,
            }
            ).then(response => this.setState({ detailedValues: response.data['instances'][0], detailViewLoading:false}));

        this.setState({
            viewInstanceRack:'',
        });
    }

    searchInstances(model, hostname, rack, rackU) {
        axios.post(
            getURL(instancesMainPath, InstanceCommand.search),
            {
                'model':model,
                'hostname':hostname,
                'rack':rack,
                'rackU':rackU,
            }
            ).then(response => this.setState({ items: response.data['instances'] }));
    }

    search(filters) {
        this.searchInstances(filters['model'], filters['hostname'], filters['rack'], filters['rackU']);
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
        });

        var model = this.state.items[id]['model'];
        var hostname = this.state.items[id]['hostname'];
        var rack = this.state.items[id]['rack'];
        var rackU = this.state.items[id]['rackU'];

        //this.detailViewInstance(model, hostname, rack, rackU);
        this.setState({ detailedValues: Constants.testInstanceArray[id], detailViewLoading:false})
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
        this.state.createdInstance[event.target.label] = event.target.value;
        this.forceUpdate()
    }

    updateInstanceEdited(event) {
        this.state.detailedValues[event.target.label] = event.target.value;
        this.forceUpdate()
    }

    render() {
        return (
            <div>
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
