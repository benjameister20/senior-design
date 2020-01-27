import React from 'react';
import axios from 'axios';
import { ModelCommand } from '../enums/modelCommands.ts'
import { ModelInput } from '../enums/modelInputs.ts'
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
    "Vendor",
    "Model Number",
    "Height (U)",
    "Display Color",
    "Ethernet Ports",
    "Power Ports",
    "CPU",
    "Memory",
    "Storage",
    "Comments",
]

const modelsMainPath = 'models/';
const modelDownloadFileName = 'models.csv';

function getURL(endpoint) {
    return Constants.serverEndpoint + modelsMainPath + endpoint;
}

function jsonToArr(json) {
    var models = json.data['models'];
    const items = [];

    for (const [index, val] of models.entries()) {
        const row = [];
        row.push(val[ModelInput.Vendor]);
        row.push(val[ModelInput.ModelNumber]);
        row.push(val[ModelInput.Height]);
        row.push(val[ModelInput.DisplayColor]);
        row.push(val[ModelInput.EthernetPorts]);
        row.push(val[ModelInput.PowerPorts]);
        row.push(val[ModelInput.CPU]);
        row.push(val[ModelInput.Memory]);
        row.push(val[ModelInput.Storage]);
        row.push(val[ModelInput.Comment]);
        items.push(row);
    }
    return items;
}

export default class ModelsView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showCreateModal:false,
            showImportModal:false,
            items:[],
            modelToken:"",
            createdModel: {
                'vendor':'',
                'modelNumber':'',
                'height':'',
                'displayColor':'',
                'ethernetPorts':'',
                'powerPorts':'',
                'cpu':'',
                'memory':'',
                'storage':'',
                'comments':'',
            },
            deleteVendor:'',
            deleteModel:'',
            viewVendor:'',
            viewModel:'',
            csvData:[],
            searchText:"",
        };
    }

    createModel() {
        axios.post(
            getURL(ModelCommand.create),
            {
                'vendor':this.state.createdModel[ModelInput.Vendor],
                'modelNumber':this.state.createdModel[ModelInput.ModelNumber],
                'height':this.state.createdModel[ModelInput.Height],
                'displayColor':this.state.createdModel[ModelInput.DisplayColor],
                'ethernetPorts':this.state.createdModel[ModelInput.EthernetPorts],
                'powerPorts':this.state.createdModel[ModelInput.PowerPorts],
                'cpu':this.state.createdModel[ModelInput.CPU],
                'memory':this.state.createdModel[ModelInput.Memory],
                'storage':this.state.createdModel[ModelInput.Storage],
                'comments':this.state.createdModel[ModelInput.Comment],
            }
            ).then(response => this.setState({ items: jsonToArr(response)}));
    }

    deleteModel() {
        axios.post(
            getURL(ModelCommand.delete),
            {
                'vendor':this.state.deleteVendor,
                'modelNumber':this.state.deleteModel,
            }
            ).then(response => this.setState({ items: jsonToArr(response)}));
    }

    detailViewModel() {
        axios.post(
            getURL(ModelCommand.detailView),
            {
                'vendor':this.state.viewVendor,
                'modelNumber':this.state.viewModel,
            }
            ).then(response => this.setState({ items: jsonToArr(response)}));
    }

    viewModel() {
        axios.post(
            getURL(ModelCommand.view),
            {
                'vendor':this.state.viewVendor,
                'modelNumber':this.state.viewModel,
            }
            ).then(response => this.setState({ items: jsonToArr(response)}));
    }

    searchModels() {
        axios.post(
            getURL(ModelCommand.search),
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

    updateModelCreator(event) {
        this.state.createdModel[event.target.name] = event.target.value;
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
                    filename={modelDownloadFileName}
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

                        <TextField id="standard-basic" name={ModelInput.Vendor} label={columns[0]} onChange={this.updateModelCreator.bind(this)}/>
                        <TextField id="standard-basic" name={ModelInput.ModelNumber} label={columns[1]} onChange={this.updateModelCreator.bind(this)}/>
                        <TextField id="standard-basic" name={ModelInput.Height} label={columns[2]} onChange={this.updateModelCreator.bind(this)}/>
                        <TextField id="standard-basic" name={ModelInput.DisplayColor} label={columns[3]} onChange={this.updateModelCreator.bind(this)}/>
                        <TextField id="standard-basic" name={ModelInput.EthernetPorts} label={columns[4]} onChange={this.updateModelCreator.bind(this)}/>
                        <TextField id="standard-basic" name={ModelInput.PowerPorts} label={columns[5]} onChange={this.updateModelCreator.bind(this)}/>
                        <TextField id="standard-basic" name={ModelInput.CPU} label={columns[6]} onChange={this.updateModelCreator.bind(this)}/>
                        <TextField id="standard-basic" name={ModelInput.Memory} label={columns[7]} onChange={this.updateModelCreator.bind(this)}/>
                        <TextField id="standard-basic" name={ModelInput.Storage} label={columns[8]} onChange={this.updateModelCreator.bind(this)}/>
                        <TextField id="standard-basic" name={ModelInput.Comment} label={columns[9]} onChange={this.updateModelCreator.bind(this)}/>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.createModel.bind(this)}
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
                        onClick={this.searchModels.bind(this)}
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
