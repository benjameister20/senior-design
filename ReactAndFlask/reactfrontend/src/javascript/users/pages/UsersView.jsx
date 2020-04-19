import React from 'react';
import axios from 'axios';

import {
    Typography,
    Grid,
} from '@material-ui/core';

import { UserCommand } from '../enums/UserCommands.ts'
import FilterUser from '../helpers/FilterUser';
import CreateUser from '../helpers/CreateUser';
import getURL from '../../helpers/functions/GetURL';
import UsersTable from '../helpers/UsersTable';
import StatusDisplay from '../../helpers/StatusDisplay';
import * as UserConstants from "../UserConstants";
import { PrivilegeCommand } from "../enums/PrivilegeCommands.ts";
import * as Constants from "../../Constants";
import makeCreateJSON from "../helpers/functions/MakeCreateJSON";
import makeEditJSON from "../helpers/functions/MakeEditJSON";
import makeDeleteJSON from "../helpers/functions/MakeDeleteJSON";
import makeDetailViewJSON from "../helpers/functions/MakeDetailViewJSON";

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

const blankSearch = {
    "filter":
    {
        "username": "",
        "display_name": "",
        "email": "",
        "privilege": {
            "model": false,
            "asset": false,
            "datacenters": [],
            "power": false,
            "audit": false,
            "admin": false,
        }
    }
}

export default class UsersView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            statusOpen: false,
            statusSeverity: '',
            statusMessage: '',
            searchUsernm: '',
            searchEml: '',
            searchDspNm: '',
            searchPriv: '',
            deleteUsername: '',
            viewUser: '',
            csvData: [],
            showDetailedView: false,
            detailViewLoading: false,
            originalUsername: '',
            allDCPrivileges: [],
            loadingPrivileges: true,
        };
    }

    componentDidMount() {
        this.searchUsers(blankSearch);
        this.getPrivileges();
    }

    createUser = (username, password, display_name, email, privileges, completion) => {
        axios.post(
            getURL(Constants.USERS_MAIN_PATH, UserCommand.create),
            makeCreateJSON(username, password, display_name, email, privileges)
        ).then(response => {
            if (response.data.message === UserConstants.USER_SUCCESS_TOKEN) {
                completion(true);
                this.setDisplayStatus(true, UserConstants.USER_CREATION_SUCCESS_MESSAGE, UserConstants.USER_SUCCESS_TOKEN);
                this.searchUsers(blankSearch);
            } else {
                completion(false);
                this.setDisplayStatus(true, response.data.message, UserConstants.USER_FAILURE_TOKEN)
            }
        });
    }

    editUser = (originalUsername, username, password, display_name, email, privileges, completion) => {
        axios.post(
            getURL(Constants.USERS_MAIN_PATH, UserCommand.edit),
            makeEditJSON(originalUsername, username, password, display_name, email, privileges)
        ).then(response => this.processResponse(response, UserConstants.USER_EDIT_SUCCESS_MESSAGE, UserConstants.USER_EDIT_FAILURE_MESSAGE));
    }

    deleteUser = (username) => {
        axios.post(
            getURL(Constants.USERS_MAIN_PATH, UserCommand.delete),
            makeDeleteJSON(username)
        ).then(response =>
            this.processResponse(response, UserConstants.USER_DELETE_SUCCESS_MESSAGE, UserConstants.USER_DELETE_FAILURE_MESSAGE)
        );
    }

    detailViewUser = (username) => {
        axios.post(
            getURL(Constants.USERS_MAIN_PATH, UserCommand.detailView),
            makeDetailViewJSON(username)
        ).then(response => this.setState({ detailedValues: response.data['user'], detailViewLoading: false }));
    }

    searchUsers = (filters) => {
        axios.post(
            getURL(Constants.USERS_MAIN_PATH, UserCommand.search),
            filters,
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
    }

    getPrivileges = () => {
        axios.get(getURL(Constants.PERMISSIONS_MAIN_PATH, PrivilegeCommand.GET_PRIVILEGES)).then(
            response => {
                try {
                    this.setState({
                        allDCPrivileges: response.data.datacenters,
                        loadingPrivileges: false,
                    });
                } catch {
                    this.setState({
                        allDCPrivileges: [],
                        loadingPrivileges: false,
                    });
                }
            }
        );
    }

    setDisplayStatus = (open, message, severity) => {
        this.setState({ statusOpen: open, statusMessage: message, statusSeverity: severity });
    }

    showDetailedView = (id) => {
        this.setState({
            showDetailedView: true,
            detailViewLoading: true,
            originalUsername: this.state.items[id]['username'],
        });

        var username = this.state.items[id]['username'];

        this.detailViewUser(username);
        //this.setState({ detailedValues: Constants.testUserArray[id], detailViewLoading:false})
    }

    closeDetailedView = () => {
        this.setState({ showDetailedView: false })
    }

    updateUserEdited = (event) => {
        const newDetails = this.state.detailedValues;
        newDetails[event.target.name] = event.target.value;
        this.setState({ detailedValues: newDetails });
        this.forceUpdate()
    }

    closeShowStatus = () => {
        this.setState({ statusOpen: false })
    }

    processResponse = (response, successMessage, failureMessage) => {
        console.log(response);
        if (response.data.message === UserConstants.USER_SUCCESS_TOKEN) {
            this.setDisplayStatus(true, successMessage, UserConstants.USER_SUCCESS_TOKEN);
            this.searchUsers(blankSearch);
        } else {
            this.setDisplayStatus(true, response.data.message, UserConstants.USER_FAILURE_TOKEN);
        }
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
                    style={{ margin: "0px", maxWidth: "95vw" }}
                >
                    <Grid item xs={12}>
                        <Typography variant="h4">
                            Users
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={6}>
                        {(this.props.privilege.admin) ?
                            (<div>
                                <CreateUser
                                    showCreateModal={this.state.showCreateModal}
                                    closeCreateModal={this.closeCreateModal}
                                    createModel={this.createUser}
                                    updateModelCreator={this.updateUserCreator}
                                    inputs={inputs}
                                    options={[]}
                                    useAutocomplete={false}
                                    loading={this.state.loadingPrivileges}
                                    privileges={this.state.allDCPrivileges}
                                />
                            </div>) : null}
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={6}>
                        <FilterUser
                            updateSearchText={this.updateSearchText}
                            search={this.searchUsers}
                            filters={columns}
                            loading={this.state.loadingPrivileges}
                            privileges={this.state.allDCPrivileges}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <UsersTable
                            columns={this.props.privilege.admin ? adminColumns : columns}
                            vals={this.state.items}
                            keys={columns}
                            privilege={this.props.privilege}
                            showDetailedView={this.showDetailedView}
                            filters={this.props.privilege.admin ? adminColumns : columns}
                            delete={this.deleteUser}
                            save={this.editUser}
                            editUser={this.updateEditUser}
                            loading={this.state.loadingPrivileges}
                            privileges={this.state.allDCPrivileges}
                        />
                    </Grid>
                </Grid>
            </div>
        );
    }
}
