import React from 'react';
import axios from 'axios';
import { ModelCommand } from '../enums/modelCommands.ts'
import { ModelInput } from '../enums/modelInputs.ts'
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import TableView from '../helpers/TableView';
import { CSVLink } from "react-csv";
import ButtonMenu from '../helpers/ButtonMenu';
import Filters from '../helpers/Filters';
import UploadModal from '../helpers/UploadModal';
import getURL from '../helpers/functions/GetURL';
import jsonToArr from '../helpers/functions/JSONtoArr';
import DetailedView from '../helpers/DetailedView';

const inputs = [
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

const columns = [
    "Vendor",
    "Model Number",
    "Height (U)",
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

            // detailed view
            showDetailedView: false,
            detailedValues : {
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
        };

        this.openCreateModal = this.openCreateModal.bind(this);
        this.openImportModal = this.openImportModal.bind(this);
        this.downloadTable = this.downloadTable.bind(this);
        this.updateSearchText = this.updateSearchText.bind(this);
        this.searchModels = this.searchModels.bind(this);
        this.closeImportModal = this.closeImportModal.bind(this);
        this.closeCreateModal = this.closeCreateModal.bind(this);
        this.showDetailedView = this.showDetailedView.bind(this);
        this.editModel = this.editModel.bind(this);
        this.closeDetailedView = this.closeDetailedView.bind(this);
    }

    createModel() {
        axios.post(
            getURL(modelsMainPath, ModelCommand.create),
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
            getURL(modelsMainPath, ModelCommand.delete),
            {
                'vendor':this.state.deleteVendor,
                'modelNumber':this.state.deleteModel,
            }
            ).then(response => console.log(response));

        this.setState({
            deleteVendor:'',
            deleteModel:'',
        });
    }

    detailViewModel() {
        axios.post(
            getURL(modelsMainPath, ModelCommand.detailView),
            {
                'vendor':this.state.viewVendor,
                'modelNumber':this.state.viewModel,
            }
            ).then(response => console.log(response));

        this.setState({
            viewVendor:'',
            viewModel:'',
        });
    }

    searchModels() {
        axios.post(
            getURL(modelsMainPath, ModelCommand.search),
            {
                'filter':this.state.searchText,
            }
            ).then(response => this.setState({ items: jsonToArr(response.data['models']) }));

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

    closeCreateModal() {
        this.setState({showCreateModal: true});
    }

    closeImportModal() {
        this.setState({showImportModal: false});
    }

    updateModelCreator(event) {
        this.state.createdModel[event.target.name] = event.target.value;
        this.forceUpdate()
    }

    updateSearchText(event) {
        this.setState({ searchText: event.target.value})
    }

    showDetailedView() {
        this.setState({ showDetailedView: true })
    }

    closeDetailedView() {
        this.setState({ showDetailedView: false })
    }

    editModel() {

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

                        <TextField id="standard-basic" name={ModelInput.Vendor} label={inputs[0]} onChange={this.updateModelCreator.bind(this)}/>
                        <TextField id="standard-basic" name={ModelInput.ModelNumber} label={inputs[1]} onChange={this.updateModelCreator.bind(this)}/>
                        <TextField id="standard-basic" name={ModelInput.Height} label={inputs[2]} onChange={this.updateModelCreator.bind(this)}/>
                        <TextField id="standard-basic" name={ModelInput.DisplayColor} label={inputs[3]} onChange={this.updateModelCreator.bind(this)}/>
                        <TextField id="standard-basic" name={ModelInput.EthernetPorts} label={inputs[4]} onChange={this.updateModelCreator.bind(this)}/>
                        <TextField id="standard-basic" name={ModelInput.PowerPorts} label={inputs[5]} onChange={this.updateModelCreator.bind(this)}/>
                        <TextField id="standard-basic" name={ModelInput.CPU} label={inputs[6]} onChange={this.updateModelCreator.bind(this)}/>
                        <TextField id="standard-basic" name={ModelInput.Memory} label={inputs[7]} onChange={this.updateModelCreator.bind(this)}/>
                        <TextField id="standard-basic" name={ModelInput.Storage} label={inputs[8]} onChange={this.updateModelCreator.bind(this)}/>
                        <TextField id="standard-basic" name={ModelInput.Comment} label={inputs[9]} onChange={this.updateModelCreator.bind(this)}/>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.createModel.bind(this)}
                        >
                            Create
                        </Button>
                    </div>
                </Modal>
                <UploadModal
                    showImportModal={this.state.showImportModal}
                    closeImportModal={this.closeImportModal}
                />
                <Filters
                    updateSearchText={this.updateSearchText}
                    searchModels={this.searchModels}
                />
                <TableView
                    columns={columns}
                    vals={this.state.items}
                />
                <DetailedView
                    show={this.state.showDetailedView}
                    inputs={inputs}
                    vals={this.state.detailedValues}
                    edit={this.editModel}
                    close={this.closeDetailedView}
                />
            </div>
    );
    }
}
