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



const inputs = [
    'username',
    'email',
    'displayName',
    'privilege',
    'password',
]

const columns = [
    'username',
    'email',
    'displayName',
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
                'displayName':'',
                'email':'',
                'privilege':'',
            },

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
                'displayName':'',
                'email':'',
                'privilege':'',
            },
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

        axios.defaults.headers.common['token'] = this.props.token;
        axios.defaults.headers.common['privilege'] = this.props.privilege;

    }

    createUser() {
        axios.post(
            getURL(usersMainPath, UserCommand.create),
            {
                'username':this.state.createdUser[UserInput.Username],
                'password':this.state.createdUser[UserInput.Password],
                'displayName':this.state.createdUser[UserInput.DisplayName],
                'email':this.state.createdUser[UserInput.Email],
                'privilege':this.state.createdUser[UserInput.Privilege],
            }
            ).then(response => console.log(response));

        this.setState({
            createdUser : {
                'username':'',
                'password':'',
                'displayName':'',
                'email':'',
                'privilege':'',
            },
            showCreateModal:false,
        });
    }

    editUser() {
        axios.post(
            getURL(usersMainPath, UserCommand.edit),
            {
                'username':this.state.detailedValues[UserInput.Username],
                'displayName':this.state.detailedValues[UserInput.DisplayName],
                'email':this.state.detailedValues[UserInput.Email],
                'privilege':this.state.detailedValues[UserInput.Privilege],
            }
            ).then(response => console.log(response));

        this.setState({
            detailedValues : {
                'username':'',
                'displayName':'',
                'email':'',
                'privilege':'',
            },
            showDetailedView:false,
        });
    }


    deleteUser() {
        axios.post(
            getURL(usersMainPath, UserCommand.delete),
            {
                'username':this.state.deleteUsername,
            }
            ).then(response => console.log(response));

        this.setState({
            deleteUsername:'',
            showDetailedView:false
        });
    }

    detailViewUser(username) {
        axios.post(
            getURL(usersMainPath, UserCommand.detailView),
            {
                'username':username,
            }
            ).then(response => this.setState({ detailedValues: response.data['users'][0], detailViewLoading:false}));

        this.setState({
            viewUser:'',
        });
    }

    searchUsers(username, email, displayName, privilege) {
        axios.post(
            getURL(usersMainPath, UserCommand.search),
            {
                'filters':{
                    'username':username,
                    'email':email,
                    'displayName':displayName,
                    'privilege':privilege,
                }
            }
            ).then(response => this.setState({ items: response.data['users'] }));
    }

    search(filters) {
        this.searchUsers(filters['username'], filters['email'], filters['displayName'], filters['privilege']);
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
         });

        var username = this.state.items[id]['username'];
        var email = this.state.items[id]['email'];
        var displayName = this.state.items[id]['displayName'];
        var privilege = this.state.items[id]['privilege'];

        //this.detailViewUser(username, email, displayName, privilege);
        this.setState({ detailedValues: Constants.testUserArray[id], detailViewLoading:false})
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
        this.state.createdUser[event.target.label] = event.target.value;
        this.forceUpdate()
    }

    updateUserEdited(event) {
        this.state.detailedValues[event.target.label] = event.target.value;
        this.forceUpdate()
    }

    render() {
        return (
            <div>
                {(this.props.privilege == Privilege.ADMIN) ?
                    (<div>
                <ButtonMenu
                    openCreateModal={this.openCreateModal}
                    openImportModal={this.openImportModal}
                    downloadTable={this.downloadTable}
                />
                <CSVLink
                    data={this.state.csvData}
                    filename={userDownloadFileName}
                    className="hidden"
                    ref={(r) => this.csvLink = r}
                    target="_blank"
                />
                <CreateModal
                    showCreateModal={this.state.showCreateModal}
                    closeCreateModal={this.closeCreateModal}
                    createModel={this.createUser}
                    updateModelCreator={this.updateUserCreator}
                    inputs={inputs}
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
                    inputs={inputs}
                    updateModelEdited={this.updateUserEdited}
                    defaultValues={this.state.detailedValues}
                    loading={this.state.detailViewLoading}
                    edit={this.editUser}
                    delete={this.deleteUser}
                />
            </div>
        );
    }
}
