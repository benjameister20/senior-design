import React from 'react';
import axios from 'axios';
import { UserInput } from '../enums/userInputs.ts'
import { UserCommand } from '../enums/userCommands.ts'
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
    "Username",
    "Display Name",
    "Email",
]

const usersMainPath = 'users/';
const modelDownloadFileName = 'models.csv';

const csvData = [
    ["firstname", "lastname", "email"],
    ["Ahmed", "Tomi", "ah@smthing.co.com"],
    ["Raed", "Labes", "rl@smthing.co.com"],
    ["Yezzi", "Min l3b", "ymin@cocococo.com"]
  ];

export default class UsersView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showCreateModal:false,
            showImportModal:false,
            items:[],
            instanceToken:"",
            createdUser: {
                'username':'',
                'email':'',
                'displayName':'',
            },
            deleteUsername:'',
            viewUsername:'',
        };
    }

    downloadTable() {
        this.csvLink.link.click();
    }

    getURL(endpoint) {
        return Constants.serverEndpoint + usersMainPath + endpoint;
    }

    createUser() {
        axios.post(
            this.getURL(UserCommand.create),
            {
                'username':this.state.createdUser[UserInput.Username],
                'email':this.state.createdUser[UserInput.Email],
                'displayName':this.state.createdUser[UserInput.DisplayName],
            }
            ).then(response => (this.setState({ items:response })));
    }

    deleteUser() {
        axios.post(
            this.getURL(UserCommand.delete),
            {
                'username':this.state.deleteUsername,
            }
            ).then(response => console.log(response));
    }

    detailViewUser() {
        axios.post(
            this.getURL(UserCommand.detailView),
            {
                'username':this.state.viewUsername,
            }
            ).then(response => console.log(response));
    }

    viewUser() {
        axios.post(
            this.getURL(UserCommand.view),
            {
                'username':this.state.viewUsername,
            }
            ).then(response => console.log(response));
    }


    openCreateModal() {
        this.setState({showCreateModal: true});
    }

    openImportModal() {
        this.setState({showImportModal: true});
    }

    updateUserCreator(event) {
        this.state.createdUser[event.target.name] = event.target.value;
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
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.showCreateModal}
                    onClose={() => (this.setState({showCreateModal:false}))}
                >
                    <div>
                        <TextField id="standard-basic" name={UserInput.Vendor} label={columns[0]} onChange={this.updateUserCreator.bind(this)}/>
                        <TextField id="standard-basic" name={UserInput.UserNumber} label={columns[1]} onChange={this.updateUserCreator.bind(this)}/>
                        <TextField id="standard-basic" name={UserInput.Height} label={columns[2]} onChange={this.updateUserCreator.bind(this)}/>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.createUser.bind(this)}
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
