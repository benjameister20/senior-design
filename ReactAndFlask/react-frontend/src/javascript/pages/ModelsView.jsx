import React from 'react';
import axios from 'axios';
import { ModelCommand } from '../enums/modelCommands.ts'
import { ModelInput } from '../enums/modelInputs.ts'
import * as Constants from '../Constants';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import TableView from '../helpers/TableView';
import { CSVLink } from "react-csv";
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import ButtonMenu from '../helpers/ButtonMenu';
import Filters from '../helpers/Filters';

const columns = [
    "Vendor",
    "Model Number",
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
        items.push(row);
    }
    return items;
}

export default class ModelsView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            // modals
            showCreateModal:false,
            showImportModal:false,

            // table items
            items:[],

            modelToken:"",

            // vals for creating a new model
            createdModel : {
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
        };

        this.openCreateModal = this.openCreateModal.bind(this);
        this.openImportModal = this.openImportModal.bind(this);
        this.downloadTable = this.downloadTable.bind(this);
        this.updateSearchText = this.updateSearchText.bind(this);
        this.searchModels = this.searchModels.bind(this);
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
            ).then(response => console.log(response));

        this.setState({
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
        });
    }

    deleteModel() {
        axios.post(
            getURL(ModelCommand.delete),
            {
                'vendor':this.state.deleteVendor,
                'modelNumber':this.state.deleteModel,
            }
            ).then(response => this.setState({ items: jsonToArr(response)}));

        this.setState({
            deleteVendor:'',
            deleteModel:'',
        });
    }

    detailViewModel() {
        axios.post(
            getURL(ModelCommand.detailView),
            {
                'vendor':this.state.viewVendor,
                'modelNumber':this.state.viewModel,
            }
            ).then(response => this.setState({ items: jsonToArr(response)}));

        this.setState({
            viewVendor:'',
            viewModel:'',
        });
    }

    searchModels() {
        axios.post(
            getURL(ModelCommand.search),
            {
                'filter':this.state.searchText,
            }
            ).then(response => this.setState({ items: jsonToArr(response)}));

        this.setState({
            searchText:'',
        });
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
                <ButtonMenu
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
                <Filters
                    updateSearchText={this.updateSearchText}
                    searchModels={this.searchModels}
                />
                <TableView
                    columns={columns}
                    vals={this.state.items}
                />
            </div>
    );
    }
}
