import React from 'react';
import axios from 'axios';
import { UserInput } from '../enums/userInputs.ts'
import { UserCommand } from '../enums/userCommands.ts'
import * as Constants from '../Constants';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import TableView from '../helpers/TableView';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';

const columns = [
    "Username",
    "Display Name",
    "Email",
]

const usersMainPath = 'users/';

function getURL(endpoint) {
    return Constants.serverEndpoint + usersMainPath + endpoint;
}

function jsonToArr(json) {
    var users = json.data['users'];
    const items = [];

    for (const [index, val] of users.entries()) {
        const row = [];
        row.push(val[UserInput.Username]);
        row.push(val[UserInput.Email]);
        row.push(val[UserInput.DisplayName]);
        items.push(row);
    }
    return items;
}

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
            searchText:"",
        };
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

    searchUsers() {
        axios.post(
            getURL(UserCommand.search),
            {
                'filter':this.state.searchText,
            }
            ).then(response => this.setState({ items: jsonToArr(response)}));
    }


    openCreateModal() {
        this.setState({showCreateModal: true});
    }

    updateUserCreator(event) {
        this.state.createdUser[event.target.name] = event.target.value;
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
                        onClick={this.searchUsers.bind(this)}
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
