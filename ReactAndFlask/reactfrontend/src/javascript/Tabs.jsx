import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import ModelsView from './models/pages/ModelsView';
import UsersView from './users/pages/UsersView';
import AssetsView from './assets/pages/AssetsView';
import DatacenterManagerView from './racks/pages/DatacenterManagerView';
import StatisticsView from './statistics/pages/StatisticsView';
import LogsView from "./logs/pages/LogsView";

import { Privilege } from './enums/privilegeTypes.ts'

import ErrorBoundry from './errors/ErrorBoundry';

import '../stylesheets/TabStyles.css';

const useStyles = theme => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    tab:{
        flexGrow:'flex',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: "100%",
        width:"100%",
        margin:"0 auto",
    }
  });

class TabViewer extends React.Component {
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
        const { classes } = this.props;

        return (
        <div id="homepage" className={classes.root}>
            <ErrorBoundry>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Hyposoft Server Management
                    </Typography>
                    <div>
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
                </Toolbar>
            </AppBar>

            <Tabs value={this.state.currentTabID} onChange={this.handleChange}
                indicatorColor="primary"
                textColor="primary"
                centered
            >
                    <Tab value={0} style={{flexGrow: 1,}} label="Models"> </Tab>
                    <Tab value={1} style={{flexGrow: 1,}} label="Assets" ></Tab>
                    {(this.props.privilege === Privilege.ADMIN) ? <Tab value={2} style={{flexGrow: 1,}} label="Users"></Tab> : null}
                    <Tab value={3} style={{flexGrow: 1,}} label="Datacenters" />
                    <Tab value={4} style={{flexGrow: 1,}} label="Statistics" />
                    <Tab value={5} style={{flexGrow: 1,}} label="Logs" />
            </Tabs>
            {this.state.currentTabID !== 0 ? null :
            <Typography
                component="div"
                role="tabpanel"
                id={`simple-tabpanel-0`}
                aria-labelledby={`simple-tab-0`}
            >
                <Container className={classes.tab} ><ModelsView token={this.props.token} privilege={this.props.privilege} /></Container>
            </Typography>}
            {this.state.currentTabID !== 1 ? null :
            <Typography
                component="div"
                role="tabpanel"
                id={`simple-tabpanel-0`}
                aria-labelledby={`simple-tab-0`}
            >
                <Container className={classes.tab} ><AssetsView token={this.props.token} privilege={this.props.privilege} /></Container>
            </Typography>}
            {this.state.currentTabID !== 2 ? null :
            <Typography
                component="div"
                role="tabpanel"
                id={`simple-tabpanel-0`}
                aria-labelledby={`simple-tab-0`}
            >
                <Container className={classes.tab} ><UsersView token={this.props.token} privilege={this.props.privilege} /></Container>
            </Typography>}
            {this.state.currentTabID !== 3 ? null :
            <Typography
                component="div"
                role="tabpanel"
                id={`simple-tabpanel-0`}
                aria-labelledby={`simple-tab-0`}
            >
                <Container className={classes.tab} ><DatacenterManagerView token={this.props.token} privilege={this.props.privilege} /></Container>
            </Typography>}
            {this.state.currentTabID !== 4 ? null :
            <Typography
                component="div"
                role="tabpanel"
                hidden={this.state.currentTabID !== 4}
                id={`simple-tabpanel-0`}
                aria-labelledby={`simple-tab-0`}
            >
                <Container className={classes.tab} ><StatisticsView token={this.props.token} privilege={this.props.privilege} /></Container>
            </Typography>}
            {this.state.currentTabID !== 5 ? null :
            <Typography
                component="div"
                role="tabpanel"
                hidden={this.state.currentTabID !== 5}
                id={`tab-panel-logs`}
                aria-labelledby={`tab-panel-logs`}
            >
                <Container className={classes.tab} ><LogsView /></Container>
            </Typography>}
            </ErrorBoundry>
        </div>);
    }
}


export default withStyles(useStyles)(TabViewer);
