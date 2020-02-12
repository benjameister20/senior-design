import React from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';

import { UserCommand } from '../enums/UserCommands.ts'
import { UserInput } from '../enums/UserInputs.ts'


import ButtonsUser from '../helpers/ButtonsUser';
import FilterUser from '../helpers/FilterUser';
import DetailUser from '../helpers/DetailUser';
import CreateUser from '../helpers/CreateUser';

import UploadModal from '../../helpers/UploadModal';
import getURL from '../../helpers/functions/GetURL';
import TableView from '../../helpers/TableView';
import StatusDisplay from '../../helpers/StatusDisplay';

import { Privilege } from '../../enums/privilegeTypes.ts'

import ErrorBoundray from '../../errors/ErrorBoundry';
import * as UserConstants from "../UserConstants";

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

            statusOpen:false,
            statusSeverity:'',
            statusMessage:'',
            detailStatusOpen:false,
            detailStatusSeverity:'',
            detailStatusMessage:'',
            createStatusOpen:false,
            createStatusSeverity:'',
            createStatusMessage:'',

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

            initialized:false,
        };

        axios.defaults.headers.common['token'] = this.props.token;
        axios.defaults.headers.common['privilege'] = this.props.privilege;

    }

    createUser = () => {
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
                        createStatusOpen: true,
                        createStatusMessage: "Successfully created user",
                        createStatusSeverity:"success",
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
                    this.setState({ createStatusOpen: true, createStatusMessage: response.data.message, createStatusSeverity:"error" })
                }
            }).catch(
                this.setState({ createStatusOpen: true, createStatusMessage: UserConstants.GENERAL_USER_ERROR, createStatusSeverity:"error" })
            );
    }

    editUser = () => {
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
                        detailStatusOpen: true,
                        detailStatusMessage: "Successfully edited user",
                        detailStatusSeverity:"success",
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
                    this.setState({ detailStatusOpen: true, detailStatusMessage: response.data.message, detailStatusSeverity:"error" })
                }
            }).catch(
                this.setState({ detailStatusOpen: true, detailStatusMessage: UserConstants.GENERAL_USER_ERROR, detailStatusSeverity:"error" })
            );
    }


    deleteUser = () => {
        axios.post(
            getURL(usersMainPath, UserCommand.delete),
            {
                'username':this.state.originalUsername,
            }
            ).then(response => {
                if (response.data.message === 'success') {
                    this.setState({
                        statusOpen: true,
                        statusMessage: "Successfully deleted user",
                        statusSeverity:"success",
                        deleteUsername:'',
                        showDetailedView:false,
                    });
                    this.searchUsers();
                } else {
                    this.setState({ showStatus: true, statusMessage: response.data.message, statusSeverity:"error" })
                }
            }).catch(
                this.setState({ showStatus: true, statusMessage: UserConstants.GENERAL_USER_ERROR, statusSeverity:"error" })
            );
    }

    detailViewUser = (username) => {
        axios.post(
            getURL(usersMainPath, UserCommand.detailView),
            {
                'username':username,
            }
            ).then(response => this.setState({ detailedValues: response.data['user'], detailViewLoading:false})
            ).catch(
                this.setState({ showStatus: true, statusMessage: UserConstants.GENERAL_USER_ERROR, statusSeverity:"error" })
            );

        this.setState({
            viewUser:'',
        });
    }

    searchUsers = () => {
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

        this.setState({ initialized: true})
    }

    search = (filters) => {
        this.setState({
            searchUsernm:filters['username'],
            searchEml:filters['email'],
            searchDspNm: filters['display_name'],
            searchPriv:filters['privilege'],
        }, this.searchUsers);
    }

    downloadTable = () => {
        this.csvLink.link.click();
    }

    openCreateModal = () => {
        this.setState({showCreateModal: true});
    }

    openImportModal = () => {
        this.setState({showImportModal: true});
    }

    showDetailedView = (id) => {
        this.setState({
            showDetailedView: true,
            detailViewLoading:true,
            originalUsername:this.state.items[id]['username'],
         });

        var username = this.state.items[id]['username'];

        this.detailViewUser(username);
        //this.setState({ detailedValues: Constants.testUserArray[id], detailViewLoading:false})
    }

    closeCreateModal = () => {
        this.setState({showCreateModal: false});
    }

    closeImportModal = () => {
        this.setState({showImportModal: false});
    }

    closeDetailedView = () => {
        this.setState({ showDetailedView: false })
    }

    updateUserCreator = (event) => {
        this.state.createdUser[event.target.name] = event.target.value;
        this.forceUpdate()
    }

    updateUserEdited = (event) => {
        this.state.detailedValues[event.target.name] = event.target.value;
        this.forceUpdate()
    }

    closeShowStatus = () => {
        this.setState({ showStatus: false })
    }

    createStatusClose = () => {
        this.setState({ createStatusOpen: false })
    }

    detailStatusClose = () => {
        this.setState({ detailStatusOpen: false })
    }

    initialized = () => {
        this.searchUsers();
    }

    render() {
        return (
            <div>
                {(this.state.initialized) ? null: this.initialized()}
                <ErrorBoundray>
                <StatusDisplay
                    open={this.state.showStatus}
                    severity={this.state.statusSeverity}
                    closeStatus={this.closeShowStatus}
                    message={this.state.statusMessage}
                />
                {(this.props.privilege == Privilege.ADMIN) ?
                    (<div>
                <CreateUser
                    statusOpen={this.state.createStatusOpen}
                    statusSeverity={this.state.createStatusSeverity}
                    statusClose={this.createStatusClose}
                    statusMessage={this.state.createStatusMessage}

                    showStatus={this.state.createStatus}
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
                <FilterUser
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
                <DetailUser
                    statusOpen={this.state.detailStatusOpen}
                    statusSeverity={this.state.detailStatusSeverity}
                    statusClose={this.detailStatusClose}
                    statusMessage={this.state.detailStatusMessage}

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
                </ErrorBoundray>
            </div>
        );
    }
}
