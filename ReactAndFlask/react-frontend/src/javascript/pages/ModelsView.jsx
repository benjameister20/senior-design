import React from 'react';
import axios from 'axios';
import { ModelCommand } from '../enums/modelCommands.ts'
import { ModelInput } from '../enums/modelInputs.ts'
import * as Constants from '../Constants';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TextField from "@material-ui/core/TextField";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import TableView from '../helpers/TableView';
import Filters from '../helpers/Filters';
import { CSVLink } from "react-csv";
import { makeStyles } from '@material-ui/core/styles';

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

const useStyles = makeStyles(theme => ({
    table: {
      minWidth: 650,
    },
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
      },
    submit: {
        margin: theme.spacing(3, 2, 2),
    },
    root: {
        width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
  }));

  function getModalStyle() {
    return {
      top: `50%`,
      left: `50%`,
      transform: `translate(-50%, -50%)`,
    };
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
                'model':'',
                'height':'',
                'displayColor':'',
                'ethernetPorts':'',
                'powerPorts':'',
                'cpu':'',
                'memory':'',
                'storage':'',
                'comment':'',
            },
            csvData:[],
        };
    }

    getURL(endpoint) {
        return Constants.serverEndpoint + modelsMainPath + endpoint;
    }

    createModel() {
        axios.post(
            this.getURL(ModelCommand.create),
            {
                'vendor':this.state.createdModel[ModelInput.Vendor],
                'model':this.state.createdModel[ModelInput.ModelNumber],
                'height':this.state.createdModel[ModelInput.Height],
                'displayColor':this.state.createdModel[ModelInput.DisplayColor],
                'ethernetPorts':this.state.createdModel[ModelInput.EthernetPorts],
                'powerPorts':this.state.createdModel[ModelInput.PowerPorts],
                'cpu':this.state.createdModel[ModelInput.CPU],
                'memory':this.state.createdModel[ModelInput.Memory],
                'storage':this.state.createdModel[ModelInput.Storage],
                'comments':this.state.createdModel[ModelInput.Comment],
            }
            ).then(response => this.setState({ items:response }));
    }

    deleteModel(vendor, modelNum) {
        axios.post(
            this.getURL(ModelCommand.delete),
            {
                'vendor':vendor,
                'model':modelNum,
            }
            ).then(response => console.log(response));
    }

    detailViewModel(vendor, modelNum) {
        axios.post(
            this.getURL(ModelCommand.detailView),
            {
                'vendor':vendor,
                'model':modelNum,
            }
            ).then(response => console.log(response));
    }

    viewModel(vendor, modelNum) {
        axios.post(
            this.getURL(ModelCommand.view),
            {
                'vendor':vendor,
                'model':modelNum,
            }
            ).then(response => console.log(response));
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
                <Filters filters={columns}/>
                <TableView
                    columns={columns}
                    vals={this.state.items}
                />
            </div>
    );
    }
}
