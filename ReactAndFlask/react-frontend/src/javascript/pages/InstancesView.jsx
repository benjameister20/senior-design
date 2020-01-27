import React from 'react';
import axios from 'axios';
import { InstanceInput } from '../enums/instanceInputs.ts'
import { InstanceCommand } from '../enums/instanceCommands.ts'
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

const columns = [
    "Model",
    "Hostname",
    "Rack",
    "Rack U",
    "Owner",
    "Comments",
]

const instancesMainPath = 'instances/';
const modelDownloadFileName = 'models.csv';

const csvData = [
    ["firstname", "lastname", "email"],
    ["Ahmed", "Tomi", "ah@smthing.co.com"],
    ["Raed", "Labes", "rl@smthing.co.com"],
    ["Yezzi", "Min l3b", "ymin@cocococo.com"]
  ];

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
        };
    }

    downloadTable() {
        this.csvLink.link.click();
    }

    getURL(endpoint) {
        return Constants.serverEndpoint + instancesMainPath + endpoint;
    }

    createInstance() {
        axios.post(
            this.getURL(InstanceCommand.create),
            {
                'model':this.state.createdInstance[InstanceInput.Model],
                'hostname':this.state.createdInstance[InstanceInput.Hostname],
                'rack':this.state.createdInstance[InstanceInput.Rack],
                'rackU':this.state.createdInstance[InstanceInput.RackU],
                'owner':this.state.createdInstance[InstanceInput.Owner],
                'comment':this.state.createdInstance[InstanceInput.Comment],
            }
            ).then(response => (this.setState({ items:response })));
    }

    deleteInstance() {
        axios.post(
            this.getURL(InstanceCommand.delete),
            {
                'rack':this.state.deleteInstanceRack,
                'rackU':this.state.deleteInstanceRackU
            }
            ).then(response => console.log(response));
    }

    detailViewInstance() {
        axios.post(
            this.getURL(InstanceCommand.detailView),
            {
                'rack':this.state.deleteInstanceRack,
                'rackU':this.state.deleteInstanceRackU
            }
            ).then(response => console.log(response));
    }

    viewInstance() {
        axios.post(
            this.getURL(InstanceCommand.view),
            {
                'rack':this.state.deleteInstanceRack,
                'rackU':this.state.deleteInstanceRackU
            }
            ).then(response => console.log(response));
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
                    data={csvData}
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

                        <TextField id="standard-basic" name={InstanceInput.Vendor} label={columns[0]} onChange={this.updateInstanceCreator.bind(this)}/>
                        <TextField id="standard-basic" name={InstanceInput.InstanceNumber} label={columns[1]} onChange={this.updateInstanceCreator.bind(this)}/>
                        <TextField id="standard-basic" name={InstanceInput.Height} label={columns[2]} onChange={this.updateInstanceCreator.bind(this)}/>
                        <TextField id="standard-basic" name={InstanceInput.DisplayColor} label={columns[3]} onChange={this.updateInstanceCreator.bind(this)}/>
                        <TextField id="standard-basic" name={InstanceInput.EthernetPorts} label={columns[4]} onChange={this.updateInstanceCreator.bind(this)}/>
                        <TextField id="standard-basic" name={InstanceInput.PowerPorts} label={columns[5]} onChange={this.updateInstanceCreator.bind(this)}/>

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
                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>Filters</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Filters filters={columns}/>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <TableView
                    columns={columns}
                    vals={this.state.items}
                />
            </div>
    );
    }
}
