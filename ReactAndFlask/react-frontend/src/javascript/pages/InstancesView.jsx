import React from 'react';
import axios from 'axios';
import { InstanceInput } from '../enums/instanceInputs.ts'
import { InstanceCommand } from '../enums/instanceCommands.ts'
import * as Constants from '../Constants';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import TableView from '../helpers/TableView';
import { CSVLink } from "react-csv";
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';

const columns = [
    "Model",
    "Hostname",
    "Rack",
    "Rack U",
    "Owner",
    "Comments",
]

const instancesMainPath = 'instances/';
const instanceDownloadFileName = 'instances.csv';

function getURL(endpoint) {
    return Constants.serverEndpoint + instancesMainPath + endpoint;
}

function jsonToArr(json) {
    var instances = json.data['instances'];
    const items = [];

    for (const [index, val] of instances.entries()) {
        const row = [];
        row.push(val[InstanceInput.Model]);
        row.push(val[InstanceInput.Hostname]);
        row.push(val[InstanceInput.Rack]);
        row.push(val[InstanceInput.RackU]);
        row.push(val[InstanceInput.Owner]);
        row.push(val[InstanceInput.Comment]);
        items.push(row);
    }
    return items;
}

export default class InstancesView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showCreateModal:false,
            showImportModal:false,
            items:[],
            instanceToken:"",
            createdInstance: {
                'model':'',
                'hostname':'',
                'rack':'',
                'rackU':'',
                'owner':'',
                'comment':'',
            },
            deleteInstanceRack:'',
            deleteInstanceRackU:'',
            viewRack:'',
            viewRackU:'',
            csvData:[],
            searchText:"",
        };
    }

    createInstance() {
        axios.post(
            getURL(InstanceCommand.create),
            {
                'model':this.state.createdInstance[InstanceInput.Model],
                'hostname':this.state.createdInstance[InstanceInput.Hostname],
                'rack':this.state.createdInstance[InstanceInput.Rack],
                'rackU':this.state.createdInstance[InstanceInput.RackU],
                'owner':this.state.createdInstance[InstanceInput.Owner],
                'comment':this.state.createdInstance[InstanceInput.Comment],
            }
            ).then(response => (this.setState({ items:jsonToArr(response) })));
    }

    deleteInstance() {
        axios.post(
            getURL(InstanceCommand.delete),
            {
                'rack':this.state.deleteInstanceRack,
                'rackU':this.state.deleteInstanceRackU
            }
            ).then(response => (this.setState({ items:jsonToArr(response) })));
    }

    detailViewInstance() {
        axios.post(
            getURL(InstanceCommand.detailView),
            {
                'rack':this.state.deleteInstanceRack,
                'rackU':this.state.deleteInstanceRackU
            }
            ).then(response => (this.setState({ items:jsonToArr(response) })));
    }

    viewInstance() {
        axios.post(
            getURL(InstanceCommand.view),
            {
                'rack':this.state.deleteInstanceRack,
                'rackU':this.state.deleteInstanceRackU
            }
            ).then(response => (this.setState({ items:jsonToArr(response) })));
    }

    searchInstances() {
        axios.post(
            getURL(InstanceCommand.search),
            {
                'filter':this.state.searchText,
            }
            ).then(response => this.setState({ items: jsonToArr(response)}));
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

    updateInstanceCreator(event) {
        this.state.createdInstance[event.target.name] = event.target.value;
        this.forceUpdate()
    }

    updateSearchText(event) {
        this.setState({ searchText: event.target.value})
    }

    render() {
        return (
            <div>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={this.openCreateModal.bind(this)}
                >
                    Create
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<CloudUploadIcon />}
                    onClick={this.openImportModal.bind(this)}
                >
                    Import
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<CloudDownloadIcon />}
                    onClick={this.downloadTable.bind(this)}
                >
                    Export
                </Button>
                <CSVLink
                    data={this.state.csvData}
                    filename={instanceDownloadFileName}
                    className="hidden"
                    ref={(r) => this.csvLink = r}
                    target="_blank"/>
                <Modal
                    style={{top: `50%`,left: `50%`,transform: `translate(-50%, -50%)`,}}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.showCreateModal}
                    onClose={() => (this.setState({showCreateModal:false}))}
                >
                    <div>

                        <TextField id="standard-basic" name={InstanceInput.Model} label={columns[0]} onChange={this.updateInstanceCreator.bind(this)}/>
                        <TextField id="standard-basic" name={InstanceInput.Hostname} label={columns[1]} onChange={this.updateInstanceCreator.bind(this)}/>
                        <TextField id="standard-basic" name={InstanceInput.Rack} label={columns[2]} onChange={this.updateInstanceCreator.bind(this)}/>
                        <TextField id="standard-basic" name={InstanceInput.RackU} label={columns[3]} onChange={this.updateInstanceCreator.bind(this)}/>
                        <TextField id="standard-basic" name={InstanceInput.Owner} label={columns[4]} onChange={this.updateInstanceCreator.bind(this)}/>
                        <TextField id="standard-basic" name={InstanceInput.Comment} label={columns[5]} onChange={this.updateInstanceCreator.bind(this)}/>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.createInstance.bind(this)}
                        >
                            Create
                        </Button>
                    </div>
                </Modal>
                <Modal
                    style={{top: `50%`,left: `50%`,transform: `translate(-50%, -50%)`,}}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.showImportModal}
                    onClose={() => (this.setState({showImportModal:false}))}
                >
                    <div>
                        <input type='file' accept=".csv" />
                        <Button
                            variant="contained"
                            color="primary"
                        >
                            Upload
                        </Button>
                    </div>
                </Modal>
                <div>
                <div>
                    <SearchIcon />
                </div>
                    <InputBase
                        placeholder="Search (blank does a search all)"
                        inputProps={{ 'aria-label': 'search' }}
                        onChange={this.updateSearchText.bind(this)}
                    />
                    <Button
                        onClick={this.searchInstances.bind(this)}
                    >
                        Search
                    </Button>
                </div>
                <TableView
                    columns={columns}
                    vals={this.state.items}
                />
            </div>
    );
    }
}
