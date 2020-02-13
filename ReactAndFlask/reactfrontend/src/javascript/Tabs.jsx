import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';

import ModelsView from './models/pages/ModelsView';
import UsersView from './users/pages/UsersView';
import InstancesView from './instances/pages/InstancesView';
import RacksView from './racks/pages/RacksView';
import StatisticsView from './statistics/pages/StatisticsView';

import { Privilege } from './enums/privilegeTypes.ts'

import ErrorBoundry from './errors/ErrorBoundry';

import '../stylesheets/TabStyles.css';

export default class TabViewer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentTabID:0,
            anchorEl: null,
            isMenuOpen:false,
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event, newValue) {
        this.setState({ currentTabID: newValue })
    }

    handleProfileMenuOpen = (event) => {
        this.setState({ anchorEl: event.currentTarget, isMenuOpen:true });
    }

    handleMenuClose = () => {
        this.setState({ anchorEl: null, isMenuOpen:false });
    };

    render() {
        return (
        <div>
            <ErrorBoundry>
            <AppBar position="static">
                <div class="root">
                    <Typography class="title" variant="h3">
                        Hyposoft Server Management
                    </Typography>
                    <span class="grow"/>
                    <IconButton
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        color="inherit"
                        onClick={this.handleProfileMenuOpen}
                    >
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        anchorEl={this.state.anchorEl}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        id='primary-search-account-menu'
                        keepMounted
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        open={this.state.isMenuOpen}
                        onClose={this.handleMenuClose}
                    >
                        <MenuItem>{"Username: " + this.props.username}</MenuItem>
                        <MenuItem>{"Privilege: " + this.props.privilege}</MenuItem>
                        <MenuItem onClick={this.props.logout} >LOGOUT</MenuItem>
                    </Menu>
                </div>
            </AppBar>

            <Tabs value={this.state.currentTabID} onChange={this.handleChange}
                indicatorColor="primary"
                textColor="primary"
                centered
            >
                    <Tab value={0} style={{flexGrow: 1,}} label="Models"> </Tab>
                    <Tab value={1} style={{flexGrow: 1,}} label="Instances" ></Tab>
                    {(this.props.privilege == Privilege.ADMIN) ? <Tab value={2} style={{flexGrow: 1,}} label="Users"></Tab> : null}
                    <Tab value={3} style={{flexGrow: 1,}} label="Racks" />
                    <Tab value={4} style={{flexGrow: 1,}} label="Statistics" />
            </Tabs>
            <Typography
                component="div"
                role="tabpanel"
                hidden={this.state.currentTabID !== 0}
                id={`simple-tabpanel-0`}
                aria-labelledby={`simple-tab-0`}
            >
                <ModelsView token={this.props.token} privilege={this.props.privilege} />
            </Typography>
            <Typography
                component="div"
                role="tabpanel"
                hidden={this.state.currentTabID !== 1}
                id={`simple-tabpanel-0`}
                aria-labelledby={`simple-tab-0`}
            >
                <InstancesView token={this.props.token} privilege={this.props.privilege} />
            </Typography>
            <Typography
                component="div"
                role="tabpanel"
                hidden={this.state.currentTabID !== 2}
                id={`simple-tabpanel-0`}
                aria-labelledby={`simple-tab-0`}
            >
                <UsersView token={this.props.token} privilege={this.props.privilege} />
            </Typography>
            <Typography
                component="div"
                role="tabpanel"
                hidden={this.state.currentTabID !== 3}
                id={`simple-tabpanel-0`}
                aria-labelledby={`simple-tab-0`}
            >
                <RacksView token={this.props.token} privilege={this.props.privilege} />
            </Typography>
            <Typography
                component="div"
                role="tabpanel"
                hidden={this.state.currentTabID !== 4}
                id={`simple-tabpanel-0`}
                aria-labelledby={`simple-tab-0`}
            >
                <StatisticsView token={this.props.token} privilege={this.props.privilege} />
            </Typography>
            </ErrorBoundry>
        </div>);
    }
}
