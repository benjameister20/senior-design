import React from 'react';
import axios from 'axios';

import { UserCommand } from '../enums/UserCommands.ts'
import { UserInput } from '../enums/UserInputs.ts'

import FilterUser from '../helpers/FilterUser';
import DetailUser from '../helpers/DetailUser';
import CreateUser from '../helpers/CreateUser';

import getURL from '../../helpers/functions/GetURL';
import UsersTable from '../helpers/UsersTable';
import StatusDisplay from '../../helpers/StatusDisplay';

import { Privilege } from '../../enums/privilegeTypes.ts'

import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import * as UserConstants from "../UserConstants";

const inputs = [
    'username',
    'email',
    'display_name',
    'privilege',
    'password',
]

const columns = [
    'Username',
    'Email',
    'Display Name',
    'Privilege',
]

const adminColumns = [
    'Actions',
    'Username',
    'Email',
    'Display Name',
    'Privilege'
]

const columnLookup = {
    "username": "Username",
    "email": "Email",
    "display_name": "Display Name",
    'privilege': 'Privilege'
}

const usersMainPath = 'users/';

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

    componentDidMount() {
        this.searchUsers();
    }

    createUser = (username, password, display_name, email, privilege, completion) => {
        axios.post(
            getURL(usersMainPath, UserCommand.create),
            {
                'username': username,
                'password': password,
                'display_name': display_name,
                'email': email,
                'privilege': privilege,
            }
            ).then(response => {
                console.log(response.data.message);
                if (response.data.message === 'Successfully created user') {
                    completion(true);
                    this.setState({
                        statusOpen: true,
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
                    completion(false);
                    this.setState({ statusOpen: true, statusMessage: response.data.message, statusSeverity:"error" })
                }
            });
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
                if (response.data.message.includes("Success") || response.data.message.includes("Successfully")) {
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

    deleteUser = (username) => {
        console.log(username);
        axios.post(
            getURL(usersMainPath, UserCommand.delete),
            {
                'username': username,
            }
            ).then(response => {
                console.log(response.data.message.includes("Successfully"));
                if (response.data.message.includes("Success") || response.data.message.includes("Successfully")) {
                    this.setState({
                        statusOpen: true,
                        statusMessage: "Successfully deleted user",
                        statusSeverity: "success",
                        deleteUsername: '',
                        showDetailedView: false,
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
        console.log("searching");
        axios.post(
            getURL(usersMainPath, UserCommand.search),
            {
                'filter':{
                    'username': this.state.searchUsernm,
                    'email': this.state.searchEml,
                    'display_name': this.state.searchDspNm,
                    'privilege': this.state.searchPriv,
                }
            }
            ).then(response => {
                const models = response.data['users'] === undefined ? [] : response.data['users'];
                var rows = [];
                Object.values(models).forEach(model => {
                    var row = {};
                    Object.keys(model).forEach(key => {
                        if (key in columnLookup) {
                            row[columnLookup[key]] = model[key];
                        } else {
                            row[key] = model[key];
                        }
                    });
                    rows.push(row);
                });

                this.setState({ items: rows });
            });

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
        const newUser = this.state.createdUser;
        newUser[event.target.name] = event.target.value;
        this.setState({ createdUser: newUser });
        this.forceUpdate();
    }

    updateUserEdited = (event) => {
        const newDetails = this.state.detailedValues;
        newDetails[event.target.name] = event.target.value;
        this.setState({ detailedValues: newDetails });
        this.forceUpdate()
    }

    updateEditUser = (username, display, email, privilege) => {
        const newDetails = this.state.detailedValues;
        newDetails["username"] = username;
        newDetails["display_name"] = display;
        newDetails["email"] = email;
        newDetails["privilege"] = privilege;

        this.setState({ detailedValues: newDetails, originalUsername: username });
        this.forceUpdate()
    }

    closeShowStatus = () => {
        this.setState({ statusOpen: false })
    }

    createStatusClose = () => {
        this.setState({ createStatusOpen: false })
    }

    detailStatusClose = () => {
        this.setState({ detailStatusOpen: false })
    }

    render() {
        return (
            <div>
                <StatusDisplay
                    open={this.state.statusOpen}
                    severity={this.state.statusSeverity}
                    closeStatus={this.closeShowStatus}
                    message={this.state.statusMessage}
                />
                <Grid
                    container
                    spacing={5}
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                    style={{margin: "0px", maxWidth: "95vw"}}
                >
                    <Grid item xs={12}>
                        <Typography variant="h4">
                            Users
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        {(this.props.privilege === Privilege.ADMIN) ?
                        (<div>
                            <CreateUser
                                showCreateModal={this.state.showCreateModal}
                                closeCreateModal={this.closeCreateModal}
                                createModel={this.createUser}
                                updateModelCreator={this.updateUserCreator}
                                inputs={inputs}
                                options={[]}
                                useAutocomplete={false}
                            />
                        </div>) : null}
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <FilterUser
                            updateSearchText={this.updateSearchText}
                            search={this.search}
                            filters={columns}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <UsersTable
                            columns={this.props.privilege == Privilege.ADMIN ? adminColumns : columns}
                            vals={this.state.items}
                            keys={columns}
                            privilege={this.props.privilege}
                            showDetailedView={this.showDetailedView}
                            filters={this.props.privilege == Privilege.ADMIN ? adminColumns : columns}
                            delete={this.deleteUser}
                            save={this.editUser}
                            editUser={this.updateEditUser}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <DetailUser
                            showDetailedView={this.state.showDetailedView}
                            closeDetailedView={this.closeDetailedView}
                            inputs={columns}
                            updateModelEdited={this.updateUserEdited}
                            defaultValues={this.state.detailedValues}
                            loading={this.state.detailViewLoading}
                            edit={this.editUser}
                            delete={this.deleteUser}
                            disabled={this.props.privilege === Privilege.USER}
                        />
                    </Grid>
                </Grid>
            </div>
        );
    }
}
