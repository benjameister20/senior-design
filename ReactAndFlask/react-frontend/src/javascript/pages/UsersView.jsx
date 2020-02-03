import React from 'react';
import axios from 'axios';
import { UserCommand } from '../enums/userCommands.ts'
import { UserInput } from '../enums/userInputs.ts'
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
import MuiAlert from '@material-ui/lab/Alert';
import StatusDisplay from '../helpers/StatusDisplay';
import Button from '@material-ui/core/Button';



const inputs = [
    'username',
    'email',
    'display_name',
    'privilege',
    'password',
]

const columns = [
    'username',
    'email',
    'display_name',
    'privilege',
]

const usersMainPath = 'users/';
const userDownloadFileName = 'users.csv';

export default class UsersView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            // modals
            showCreateModal:false,
            showImportModal:false,

            // table items
            items:[], //Constants.testUserArray,

            // vals for creating a new user
            createdUser : {
                'username':'',
                'password':'',
                'display_name':'',
                'email':'',
                'privilege':'',
            },

            showStatus:false,
            statusMessage:'',
            statusSeverity:'',

            searchUsernm:'',
            searchEml:'',
            searchDspNm:'',
            searchPriv:'',

            // vals for deleting a user
            deleteUsername:'',

            // vals for viewing a user
            viewUser:'',

            // csv data
            csvData:[],

            // detailed view
            showDetailedView: false,
            detailViewLoading:false,
            detailedValues : {
                'username':'',
                'display_name':'',
                'email':'',
                'privilege':'',
            },
            originalUsername:'',
        };

        this.createUser = this.createUser.bind(this);
        this.editUser = this.editUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.detailViewUser = this.detailViewUser.bind(this);
        this.searchUsers = this.searchUsers.bind(this);
        this.search = this.search.bind(this);
        this.openCreateModal = this.openCreateModal.bind(this);
        this.openImportModal = this.openImportModal.bind(this);
        this.showDetailedView = this.showDetailedView.bind(this);
        this.closeCreateModal = this.closeCreateModal.bind(this);
        this.closeImportModal = this.closeImportModal.bind(this);
        this.closeDetailedView = this.closeDetailedView.bind(this);
        this.updateUserCreator = this.updateUserCreator.bind(this);
        this.updateUserEdited = this.updateUserEdited.bind(this);
        this.closeShowStatus = this.closeShowStatus.bind(this);

        axios.defaults.headers.common['token'] = this.props.token;
        axios.defaults.headers.common['privilege'] = this.props.privilege;

    }

    createUser() {
        axios.post(
            getURL(usersMainPath, UserCommand.create),
            {
                'username':this.state.createdUser[UserInput.Username],
                'password':this.state.createdUser[UserInput.Password],
                'display_name':this.state.createdUser[UserInput.display_name],
                'email':this.state.createdUser[UserInput.Email],
                'privilege':this.state.createdUser[UserInput.Privilege],
            }
            ).then(response => {
                if (response.data.message === 'success') {
                    this.setState({
                        showStatus: true,
                        statusMessage: "Successfully created user",
                        statusSeverity:"success",
                        createdUser : {
                            'username':'',
                            'password':'',
                            'display_name':'',
                            'email':'',
                            'privilege':'',
                        },
                        showCreateModal:false,
                    });
                    this.searchUsers();
                } else {
                    this.setState({ showStatus: true, statusMessage: response.data.message, statusSeverity:"error" })
                }
            });
    }

    editUser() {
        axios.post(
            getURL(usersMainPath, UserCommand.edit),
            {
                'username_original':this.state.originalUsername,
                'username':this.state.detailedValues[UserInput.Username],
                'display_name':this.state.detailedValues[UserInput.display_name],
                'email':this.state.detailedValues[UserInput.Email],
                'privilege':this.state.detailedValues[UserInput.Privilege],
            }
            ).then(response => {
                if (response.data.message === 'success') {
                    this.setState({
                        showStatus: true,
                        statusMessage: "Successfully created user",
                        statusSeverity:"success",
                        originalUsername:'',
                        detailedValues : {
                            'username':'',
                            'display_name':'',
                            'email':'',
                            'privilege':'',
                        },
                        showDetailedView:false,
                    });
                    this.searchUsers();
                } else {
                    this.setState({ showStatus: true, statusMessage: response.data.message, statusSeverity:"error" })
                }
            });
    }


    deleteUser() {
        axios.post(
            getURL(usersMainPath, UserCommand.delete),
            {
                'username':this.state.originalUsername,
            }
            ).then(response => {
                if (response.data.message === 'success') {
                    this.setState({
                        showStatus: true,
                        statusMessage: "Successfully created user",
                        statusSeverity:"success",
                        deleteUsername:'',
                        showDetailedView:false,
                    });
                    this.searchUsers();
                } else {
                    this.setState({ showStatus: true, statusMessage: response.data.message, statusSeverity:"error" })
                }
            });
    }

    detailViewUser(username) {
        axios.post(
            getURL(usersMainPath, UserCommand.detailView),
            {
                'username':username,
            }
            ).then(response => this.setState({ detailedValues: response.data['user'], detailViewLoading:false}));

        this.setState({
            viewUser:'',
        });
    }

    searchUsers() {
        axios.post(
            getURL(usersMainPath, UserCommand.search),
            {
                'filter':{
                    'username':this.state.searchUsernm,
                    'email':this.state.searchEml,
                    'display_name':this.state.searchDspNm,
                    'privilege':this.state.searchPriv,
                }
            }
            ).then(response => this.setState({ items: (response.data['users']==null) ? [] : response.data['users'] }));
    }

    search(filters) {
        this.setState({
            searchUsernm:filters['username'],
            searchEml:filters['email'],
            searchDspNm: filters['display_name'],
            searchPriv:filters['privilege'],
        }, this.searchUsers);
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
            originalUsername:this.state.items[id]['username'],
         });

        var username = this.state.items[id]['username'];

        this.detailViewUser(username);
        //this.setState({ detailedValues: Constants.testUserArray[id], detailViewLoading:false})
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

    updateUserCreator(event) {
        this.state.createdUser[event.target.name] = event.target.value;
        this.forceUpdate()
    }

    updateUserEdited(event) {
        this.state.detailedValues[event.target.name] = event.target.value;
        this.forceUpdate()
    }

    closeShowStatus() {
        this.setState({ showStatus: false })
    }

    render() {
        return (
            <div>
                <StatusDisplay
                    open={this.state.showStatus}
                    severity={this.state.statusSeverity}
                    closeStatus={this.closeShowStatus}
                    message={this.state.statusMessage}
                />
                {(this.props.privilege == Privilege.ADMIN) ?
                    (<div>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={this.openCreateModal}
                >
                    Create
                </Button>
                <CreateModal
                    showCreateModal={this.state.showCreateModal}
                    closeCreateModal={this.closeCreateModal}
                    createModel={this.createUser}
                    updateModelCreator={this.updateUserCreator}
                    inputs={inputs}
                    options={[]}
                    useAutocomplete={false}
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
                    inputs={columns}
                    updateModelEdited={this.updateUserEdited}
                    defaultValues={this.state.detailedValues}
                    loading={this.state.detailViewLoading}
                    edit={this.editUser}
                    delete={this.deleteUser}
                    disabled={this.props.privilege==Privilege.USER}
                />
            </div>
        );
    }
}
