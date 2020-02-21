import React from 'react';

import axios from 'axios';
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import StatusDisplay from '../../helpers/StatusDisplay';
import { AssetInput } from '../enums/AssetInputs.ts';
import { AssetCommand } from '../enums/AssetCommands.ts'
import getURL from '../../helpers/functions/GetURL';
import * as AssetConstants from "../AssetConstants";
import * as Constants from "../../Constants";
import { Typography } from '@material-ui/core';
import stringToMac from "./functions/StringToMacAddress"
import stringToRack from "./functions/StringToRack";
import NetworkGraph from "./NetworkGraph";

function createInputs(name, label, showTooltip, description) {
    return {label, name, showTooltip, description};
}

const emptySearch = {
    "filter": {
            "vendor":null,
            "model_number":null,
            "height":null,
            "model":null,
            "hostname":null,
            "rack":null,
            "rack_position":null,
            "username":null,
            "display_name":null,
            "email":null,
            "privilege":null,
            "model":null,
            "hostname":null,
            "starting_rack_letter":null,
            "ending_rack_letter":null,
            "starting_rack_number":null,
            "ending_rack_number":null,
            "rack":null,
            "rack_position":null
        },
    "datacenter_name":"",
}

const searchPath = "search/";
const left = "left";
const right = "right";
const off = "off";

const useStyles = theme => ({
    root: {
      flexGrow: 1,
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: "80%",
        margin:"0 auto",
        minWidth:"70%",
      },
      paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
      },
      progress: {
        display: 'flex',
        '& > * + *': {
          marginLeft: theme.spacing(2),
        },
      },
});

class DetailAsset extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            // model information
            loadingModels:true,
            modelList:[],
            networkList:null,
            powerPortList:null,

            // owner information
            loadingOwners:true,
            ownerList:[],

            // datacenter information
            loadingDatacenters:true,
            datacenterList:[],

            // hostname information
            loadingHostnames:true,
            assetNumList:[],
            assetNumToModelList:null,

            model:"",
            hostname:"",
            rack:"",
            rackU:-1,
            owner:"",
            comment:"",
            datacenter_name:"",
            tags:[],
            network_connections:null,
            power_connections:null,
            asset_number:100000,

            selectedConnection:null,

            statusOpen: false,
            statusMessage: "",
            statusSeverity:"",

            showModal:false,

            powerPortState:null,
            leftRight:null,
            availableConnections:false,

            canSubmit:false,

            detailAsset:null,
            loadingDetailAsset: true,

            inputs: {
                "model":createInputs(AssetInput.MODEL, "Model", false, "A reference to an existing model"),
                "hostname":createInputs(AssetInput.HOSTNAME, "Hostname", false, "A short string compliant with RFC 1034’s definition of 'label'"),
                "rack":createInputs(AssetInput.RACK, "Rack", false, "The rack the equipment is installed in, written as a row letter and rack number, e.g. 'B12'"),
                "rackU":createInputs(AssetInput.RACK_U, "Rack U", false, "An integer indicating the vertical location of the bottom of the equipment (e.g. '5')"),
                "owner":createInputs(AssetInput.OWNER, "Owner", false, "A reference to an existing user on the system who owns this equipment"),
                "comment":createInputs(AssetInput.COMMENT, "Comment", false, "Any additional information associated with this asset"),
                "datacenter":createInputs(AssetInput.DATACENTER, "Datacenter", false, "A reference to an existing datacenter"),
                "macAddress":createInputs(AssetInput.MAC_ADDRESS, "Mac Address", false, "A 6-byte hexadecimal string per network port shown canonically in lower case with colon delimiters (e.g., '00:1e:c9:ac:78:aa')"),
                "networkConnections":createInputs(AssetInput.NETWORK_CONNECTIONS, "Port Name", false, "For each network port, a reference to another network port on another piece of gear"),
                "powerConnections":createInputs(AssetInput.POWER_CONNECTIONS, "Power Connections", false, "Choice of PDU port number (0 means not plugged in)"),
                "assetNum":createInputs(AssetInput.ASSET_NUMBER, "Asset Number", false, "A six-digit serial number unique associated with an asset."),
            },
        };
    }

    componentDidMount() {
        this.getLists();
        this.getDetailView();
    }

    getDetailView = () => {
        axios.post(getURL(Constants.ASSETS_MAIN_PATH, AssetCommand.detailView), { "asset_number":this.props.asset }).then(
            response => {
                this.setState({ detailAsset: response.data.instances[0], loadingDetailAsset: false});
            }
        );

        var detailTemp = {
            "model": "Dell 27",
            "hostname": "HOSTNAME",
            "rack": "A1",
            "rack_position": 1,
            "owner": "OWNER",
            "comment": "COMMENT",
            "datacenter_name": "DATACENTER NAME",
            "tags": "TAGS",
            "network_connections": "",
            "power_connections": "",
            "asset_number": 1000005,
        };
        this.setState({ detailAsset: detailTemp });
    }

    getLists = () => {
        this.getModelList();
        this.getOwnerList();
        this.getDatacenterList();
        this.getAssetList();
    }

    getModelList = () => {
        axios.post(
            getURL(Constants.MODELS_MAIN_PATH, searchPath), emptySearch).then(
            response => {
                var models = response.data.models;

                var modelNames = [];
                var networkNames = {};
                var powerPortNames = {};

                models.map(model => {
                    var modelKey = model.vendor + " " + model.model_number;
                    modelNames.push(modelKey);
                    networkNames[modelKey] = model.ethernet_ports;
                    powerPortNames[modelKey] = parseInt(model.power_ports);
                });

                this.setState({ loadingModels: false, modelList: modelNames, networkList: networkNames, powerPortList: powerPortNames }, this.availableNetworkConnections())
            });
    }

    getOwnerList = () => {
        axios.post(
            getURL(Constants.USERS_MAIN_PATH, searchPath), emptySearch).then(
            response => {
                var users = [];
                response.data.users.map(user => users.push(user.username));
                this.setState({ loadingOwners: false, ownerList: users });
            });
    }

    getDatacenterList = () => {
        axios.get(
            getURL(Constants.DATACENTERS_MAIN_PATH, "all/")).then(
            response => {
                var datacenters = [];
                response.data.datacenters.map(datacenter => datacenters.push(datacenter.name));
                this.setState({ loadingDatacenters: false, datacenterList: datacenters })
            });
    }

    getAssetList = () => {
        axios.post(
            getURL(Constants.ASSETS_MAIN_PATH, searchPath),emptySearch).then(
            response => {
                var instances = response.data.instances;

                var assetNums = [];
                var assetNumToModel = {};
                instances.map(instance => {
                    assetNums.push(instance.asset_number);
                    assetNumToModel[instance.asset_number] = instance.model;
                })

                this.setState({ loadingHostnames: false, assetNumList: assetNums, assetNumToModelList: assetNumToModel }, this.availableNetworkConnections());
            });
    }

    validJSON = (json) => {
        var valid = (json.model !== ""
        && json.owner !== ""
        && json.datacenter_name !== ""
        && json.rack !== ""
        && json.rack_position !== -1
        && json.asset_number >= 100000 && json.asset_number <= 999999)

        Object.entries(json.network_connections).map(([port, vals]) => {
            var validConnection = (vals.connection_hostname !== undefined && vals.connection_port === undefined) || (vals.connection_hostname === undefined && vals.connection_port !== undefined);
            valid = valid && validConnection;
        });

        return valid;
    }

    createAsset = (event) => {
        event.preventDefault();
        var json = this.createJSON();
        if (this.validJSON(json)) {
            axios.post(
                getURL(AssetConstants.ASSETS_MAIN_PATH, AssetCommand.create),
                json).then(
                    response => {
                    if (response.data.message === AssetConstants.SUCCESS_TOKEN) {
                        this.setState({
                            statusOpen: true,
                            statusMessage: "Successfully created asset",
                            statusSeverity:AssetConstants.SUCCESS_TOKEN,
                            showModal:false,

                            model:"",
                            hostname:"",
                            rack:"",
                            rackU:-1,
                            owner:"",
                            comment:"",
                            datacenter_name:"",
                            tags:[],
                            network_connections:[],
                            power_connections:[],
                            asset_number:-1,
                        }, this.props.search());
                    } else {
                        this.setState({ statusOpen: true, statusMessage: response.data.message, statusSeverity:AssetConstants.ERROR_TOKEN }, console.log(this.state.statusOpen));
                    }
                });
        }

    }

    updateModel = (event) => {
        this.setState({ model: event.target.value }, () => { this.validateForm() });
    }

    updateHostname = (event) => {
        this.setState({ hostname: event.target.value }, () => { this.validateForm() });
    }

    updateRack = (event) => {
        //var rackVal = stringToRack(event.target.value);
        this.setState({ rack: event.target.value }, () => { this.validateForm() });
    }

    updateRackU = (event) => {
        this.setState({ rackU: event.target.value }, () => { this.validateForm() });
    }

    updateOwner = (event) => {
        this.setState({ owner: event.target.value }, () => { this.validateForm() });
    }

    updateComment = (event) => {
        this.setState({ comment: event.target.value }, () => { this.validateForm() });
    }

    updateDatacenter = (event) => {
        this.setState({ datacenter_name: event.target.value }, () => { this.validateForm() });
    }

    updateTags = (event) => {
        this.setState({ tags: event.target.value }, () => { this.validateForm() });
    }

    changeNetworkMacAddress = (event, port) => {
        var val = stringToMac(event.target.value);


        this.setState(prevState => {
            let network_connections = Object.assign({}, prevState.network_connections);
            if (network_connections[port] === undefined) {
                network_connections[port] = {
                    "mac_address":val,
                }
            } else {
                network_connections[port].mac_address = val;
            }

            network_connections[port] = (network_connections[port] === null) ? {} : network_connections[port];
            network_connections[port].mac_address = val;
            return { network_connections };
        }, () => { this.validateForm() });
    }

    changeNetworkHostname = (event, port) => {
        var val = event.target.value;

        this.setState(prevState => {
            let network_connections = Object.assign({}, prevState.network_connections);
            network_connections[port] = (network_connections[port] === null) ? {} : network_connections[port];
            network_connections[port].connection_hostname = val;
            return { network_connections };
        }, () => { this.validateForm() });
    }

    changeNetworkPort = (event, port) => {
        var val = event.target.value;

        this.setState(prevState => {
            let network_connections = Object.assign({}, prevState.network_connections);
            network_connections[port] = (network_connections[port] === null) ? {} : network_connections[port];
            network_connections[port].connection_port = val;
            return { network_connections };
        }, () => { this.validateForm() });
    }

    updatePowerPort = (event, port) => {
        var val = event.target.value;

        this.setState(prevState => {
            let power_connections = Object.assign({}, prevState.power_connections);
            power_connections[port] = val;
            return { power_connections };
        }, () => { this.validateForm() });
    }

    changePowerPortState = (event, portNum) => {
        var val = event.target.value;

        this.setState(prevState => {
            let leftRight = Object.assign({}, prevState.leftRight);
            leftRight[portNum] = val;
            return { leftRight };
        }, () => { this.validateForm() });
    }

    updateAssetNumber = (event) => {
        this.setState({ asset_number: event.target.value }, () => { this.validateForm() });
    }

    getPowerConnections = () => {
        if (this.state.leftRight===null) {
            return [];
        }

        var pwrConns = [];
        var defaultValue = 1;
        Object.entries(this.state.leftRight).map(([key, value]) => {
            var num = this.state.power_connections===null ? defaultValue : this.state.power_connections[key];
            switch(value) {
                case left:
                    pwrConns.push("L" + num);
                    break;
                case right:
                    pwrConns.push("R" + num);
                    break;
                default:
                    break;
            }
        });

        return pwrConns;
    }

    createJSON = () => {
        return {
            "model":this.state.model,
            "hostname":this.state.hostname,
            "rack":this.state.rack,
            "rack_position":this.state.rackU,
            "owner":this.state.owner,
            "comment":this.state.comment,
            "datacenter_name":this.state.datacenter_name,
            "tags":this.state.tags,
            "network_connections":(this.state.network_connections===null) ? {}:this.state.network_connections,
            "power_connections":this.getPowerConnections(),
            'asset_number':this.state.asset_number,
        }
    }

    availableNetworkConnections = () => {
        var availableNetworks = false;

        var assets = this.state.assetNumList;
        assets.map(asset => {
            if (Object.keys(this.state.networList[this.state.assetNumToModelList[asset]].length).length > 0) {
                availableNetworks = true;
            }
        });
        this.setState({ availableConnections: availableNetworks });
    }

    showModal = () => {
        this.setState({ showModal: true });
    }

    closeModal = () => {
        this.setState({

            // model information
            loadingModels:true,
            modelList:[],
            networkList:null,
            powerPortList:null,

            // owner information
            loadingOwners:true,
            ownerList:[],

            // datacenter information
            loadingDatacenters:true,
            datacenterList:[],

            // hostname information
            loadingHostnames:true,
            assetNumList:[],
            assetNumToModelList:null,

            model:"",
            hostname:"",
            rack:"",
            rackU:-1,
            owner:"",
            comment:"",
            datacenter_name:"",
            tags:[],
            network_connections:null,
            power_connections:null,
            asset_number:100000,

            selectedConnection:null,

            statusOpen: false,
            statusMessage: "",
            statusSeverity:"",

            showModal:false,

            powerPortState:null,
            leftRight:null,
            availableConnections:false,

            canSubmit:false,
        }, this.getLists());
    }

    statusClose = () => {
        this.setState({ statusOpen: false, statusMessage: "", statusSeverity:"" });
    }

    validateForm = () => {
        this.setState({ canSubmit:this.validJSON(this.createJSON()) });
    }


    render() {
        const { classes } = this.props;

        return (
        <span>
            <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={this.props.open}
                    onClose={this.props.close}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    scroll="body"
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={this.props.open}>
                    <div className={classes.paper}>

                    <ExpansionPanel>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="fields-header"
                        >
                        <Typography>Asset General Details</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>


                            {(
                            this.state.loadingDatacenters
                            || this.state.loadingModels
                            || this.state.loadingHostnames
                            || this.state.loadingOwners
                            //|| this.state.loadingDetailAsset
                            //&& false
                            ) ? <div className={classes.progress}><CircularProgress /></div> :
                                <form>
                                <Grid container spacing={3}>
                                    <Grid item xs={3}>
                                        <Tooltip placement="top" open={this.state.inputs.model.Tooltip} title={this.state.inputs.model.description}>
                                            <Autocomplete
                                                id="select-model"
                                                options={this.state.modelList}
                                                includeInputInList
                                                defaultValue={this.state.detailAsset.model}
                                                renderInput={params => (
                                                <TextField
                                                    {...params}
                                                    label={this.state.inputs.model.label}
                                                    name={this.state.inputs.model.name}
                                                    onChange={this.updateModel}
                                                    onBlur={this.updateModel}
                                                    variant="outlined"
                                                    fullWidth
                                                    required

                                                />
                                                )}
                                            />
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Tooltip placement="top" open={this.state.inputs.owner.Tooltip} title={this.state.inputs.owner.description}>
                                            <Autocomplete
                                                id="select-owner"
                                                options={this.state.ownerList}
                                                includeInputInList
                                                defaultValue={this.state.detailAsset.owner}
                                                renderInput={params => (
                                                <TextField
                                                    {...params}
                                                    label={this.state.inputs.owner.label}
                                                    name={this.state.inputs.owner.name}
                                                    onChange={this.updateOwner}
                                                    onBlur={this.updateOwner}
                                                    variant="outlined"
                                                    fullWidth
                                                    required
                                                />
                                                )}
                                            />
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Tooltip placement="top" open={this.state.inputs.datacenter.Tooltip} title={this.state.inputs.datacenter.description}>
                                            <Autocomplete
                                                id="input-datacenter"
                                                options={this.state.datacenterList}
                                                includeInputInList
                                                defaultValue={this.state.detailAsset.datacenter_name}
                                                renderInput={params => (
                                                <TextField
                                                    {...params}
                                                    label={this.state.inputs.datacenter.label}
                                                    name={this.state.inputs.datacenter.name}
                                                    onChange={this.updateDatacenter}
                                                    onBlur={this.updateDatacenter}
                                                    variant="outlined"
                                                    fullWidth
                                                    required
                                                />
                                                )}
                                            />
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Tooltip placement="top" open={this.state.inputs.rack.Tooltip} title={this.state.inputs.rack.description}>
                                            <TextField
                                                id="input-rack"
                                                variant="outlined"
                                                label={this.state.inputs.rack.label}
                                                name={this.state.inputs.rack.name}
                                                onChange={this.updateRack}
                                                required
                                                fullWidth
                                                defaultValue={this.state.detailAsset.rack}
                                            />
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Tooltip placement="top" open={this.state.inputs.rackU.Tooltip} title={this.state.inputs.rackU.description}>
                                            <TextField
                                                id="input-rackU"
                                                variant="outlined"
                                                type="number"
                                                InputProps={{ inputProps: { min: 1, max:42} }}
                                                label={this.state.inputs.rackU.label}
                                                name={this.state.inputs.rackU.name}
                                                onChange={this.updateRackU}
                                                required
                                                fullWidth
                                                defaultValue={this.state.detailAsset.rack_position}
                                            />
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Tooltip placement="top" open={this.state.inputs.assetNum.Tooltip} title={this.state.inputs.assetNum.description}>
                                            <TextField
                                                id="input-asset-number"
                                                variant="outlined"
                                                type="number"
                                                InputProps={{ inputProps: { min: 100000, max:999999} }}
                                                label={this.state.inputs.assetNum.label}
                                                name={this.state.inputs.assetNum.name}
                                                onChange={this.updateAssetNumber}
                                                required
                                                fullWidth
                                                defaultValue={this.state.detailAsset.asset_number}
                                            />
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Tooltip placement="top" open={this.state.inputs.hostname.Tooltip} title={this.state.inputs.hostname.description}>
                                            <TextField
                                                id="input-hostname"
                                                variant="outlined"
                                                label={this.state.inputs.hostname.label}
                                                name={this.state.inputs.hostname.name}
                                                onChange={this.updateHostname}
                                                fullWidth
                                                defaultValue={this.state.detailAsset.hostname}
                                            />
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={6}>
                                            <TextField
                                                id="input-comment"
                                                variant="outlined"
                                                label={this.state.inputs.comment.label}
                                                name={this.state.inputs.comment.name}
                                                onChange={this.updateComment}
                                                multiline={true}
                                                fullWidth
                                                defaultValue={this.state.detailAsset.comment}
                                            />
                                    </Grid>
                                </Grid></form>}
                                <StatusDisplay
                                    open={this.statusOpen}
                                    severity={this.statusSeverity}
                                    closeStatus={this.statusClose}
                                    message={this.statusMessage}
                                />

                        </ExpansionPanelDetails>
                    </ExpansionPanel>

                    <ExpansionPanel>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="networks-header"
                        >
                            <Typography>Asset Network Management</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <NetworkGraph
                                vals={{
                                         "host1": [ "host2", "host4", "host11" ],
                                         "host3": ["host5", "host7", "host9", "host11"]
                                    }}
                                host={this.props.hostname}
                            />
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="power-header"
                        >
                            <Typography>Asset Power Management</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <Button>
                        Save edits
                    </Button>
                    <Button>
                        Delete asset
                    </Button>
                    <Button>
                        Close without saving
                    </Button>


                    </div>
                    </Fade>
                </Modal>
        </span>
        );
    }
}


export default withStyles(useStyles)(DetailAsset);
