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
import ChangePlansView from "./changeplans/pages/ChangePlans";

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
    tab: {
        flexGrow: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: "100%",
        width: "100%",
        margin: "0 auto",
    }
});

const currentTab = "currentTab";

class TabViewer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentTabID:0,
            anchorEl: null,
            isMenuOpen:false,

            // If change plan mode is on
            changePlanActive: false,

            // Unique id of current change plan
            changePlanID: null,

            // Current step in change plan
            changePlanStep: null,

            // Name of current change plan
            changePlanName: "",
        };
        this.handleChange = this.handleChange.bind(this);

        console.log(sessionStorage.getItem(currentTab));
    }

    componentDidMount() {
        console.log(sessionStorage.getItem(currentTab));
        if (sessionStorage.getItem(currentTab) !== null) {
            var tab =   parseInt(sessionStorage.getItem(currentTab));
            this.setState({ currentTabID:tab });
        }

    }

    componentWillUnmount() {
        sessionStorage.removeItem(currentTab);
    }

    handleChange(event, newValue) {
        this.setState({ currentTabID: newValue });
        sessionStorage.setItem(currentTab, newValue);
    }

    handleProfileMenuOpen = (event) => {
        this.setState({ anchorEl: event.currentTarget, isMenuOpen: true });
    }

    handleMenuClose = () => {
        this.setState({ anchorEl: null, isMenuOpen: false });
    }

    updateChangePlan = (status, id, step, name) => {
        console.log(status, id, step, name);
        this.setState({ changePlanActive: status, changePlanID: id,  changePlanStep: step, changePlanName: name });

        if (status === false) {
            this.setState({ changePlanStep: null, changePlanName: "" });
        }
    }

    incrementChangePlanStep = () => {
        const currentStep = this.state.changePlanStep;

        this.setState({ changePlanStep: currentStep + 1 });
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
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
                { (this.props.privilege.asset || this.props.privilege.admin || this.props.privilege.datacenters.length > 0) ? <Tab value={6} style={{flexGrow: 1,}} label="Change Plans" ></Tab> : null }
                {(this.props.privilege.admin) ? <Tab value={2} style={{flexGrow: 1,}} label="Users"></Tab> : null}
                {(this.props.privilege.admin || this.props.privilege.asset || this.props.privilege.datacenters.length > 0) ? <Tab value={3} style={{flexGrow: 1,}} label="Sites" /> : null}
                <Tab value={4} style={{flexGrow: 1,}} label="Statistics" />
                {(this.props.privilege.admin || this.props.privilege.audit) ? <Tab value={5} style={{flexGrow: 1,}} label="Logs" />:null}
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
                <Container className={classes.tab} >
                    <AssetsView
                        token={this.props.token}
                        privilege={this.props.privilege}
                        username={this.props.username}
                        changePlanActive={this.state.changePlanActive}
                        updateChangePlan={this.updateChangePlan}
                        changePlanID ={this.state.changePlanID}
                        changePlanStep={this.state.changePlanStep}
                        incrementChangePlanStep={this.incrementChangePlanStep}
                        changePlanName={this.state.changePlanName}
                    />
                </Container>
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
            { this.state.currentTabID !== 6 ? null :
            <Typography
                component="div"
                role="tabpanel"
                hidden={this.state.currentTabID !== 6}
                id={`tab-panel-logs`}
                aria-labelledby={`tab-panel-logs`}
            >
                <Container className={classes.tab} >
                    <ChangePlansView
                        token={this.props.token}
                        privilege={this.props.privilege}
                        username={this.props.username}
                        updateChangePlan={this.updateChangePlan}
                    />
                </Container>
            </Typography>}
            </ErrorBoundry>
        </div>);
    }
}


export default withStyles(useStyles)(TabViewer);
