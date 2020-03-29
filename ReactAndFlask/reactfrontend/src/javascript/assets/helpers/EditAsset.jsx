import React from 'react';

import axios from 'axios';

import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';

import StatusDisplay from '../../helpers/StatusDisplay';
import { AssetInput } from '../enums/AssetInputs.ts';
import { AssetCommand } from '../enums/AssetCommands.ts'
import getURL from '../../helpers/functions/GetURL';
import * as AssetConstants from "../AssetConstants";
import * as Constants from "../../Constants";
import { Typography } from '@material-ui/core';
import stringToMac from "./functions/StringToMacAddress"
import stringToRack from "./functions/StringToRack";

function createInputs(name, label, showTooltip, description) {
    return { label, name, showTooltip, description };
}

const emptySearch = {
    "filter": {
        "vendor": null,
        "model_number": null,
        "height": null,
        "model": null,
        "hostname": null,
        "rack": null,
        "rack_position": null,
        "username": null,
        "display_name": null,
        "email": null,
        "privilege": null,
        "model": null,
        "hostname": null,
        "starting_rack_letter": null,
        "ending_rack_letter": null,
        "starting_rack_number": null,
        "ending_rack_number": null,
        "rack": null,
        "rack_position": null
    },
    "datacenter_name": "",
}

const searchPath = "search/";
const left = "left";
const right = "right";
const off = "off";

const useStyles = theme => ({
    root: {
        flexGrow: 1,
    },
    dialogDiv: {
        padding: theme.spacing(2, 4, 3),
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class EditAsset extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // next available asset number
            loadingAssetNumber: true,

            // model information
            loadingModels: true,
            modelList: [],
            networkList: null,
            powerPortList: null,

            // owner information
            loadingOwners: true,
            ownerList: [],

            // datacenter information
            loadingDatacenters: true,
            datacenterList: [],

            // hostname information
            loadingHostnames: true,
            assetNumList: [],
            assetNumToModelList: null,

            model: "",
            hostname: "",
            rack: "",
            rackU: -1,
            owner: "",
            comment: "",
            datacenter_name: "",
            tags: [],
            network_connections: null,
            power_connections: null,
            asset_number: -1,

            selectedConnection: null,

            statusOpen: false,
            statusMessage: "",
            statusSeverity: "",

            showModal: false,

            powerPortState: null,
            leftRight: null,
            availableConnections: false,
            portOptions: [],

            canSubmit: false,
            updated: false,
            showConfirmationBox: false,

            inputs: {
                "model": createInputs(AssetInput.MODEL, "Model", false, "A reference to an existing model"),
                "hostname": createInputs(AssetInput.HOSTNAME, "Hostname", false, "A short string compliant with RFC 1034’s definition of 'label'"),
                "rack": createInputs(AssetInput.RACK, "Rack", false, "The rack the equipment is installed in, written as a row letter and rack number, e.g. 'B12'"),
                "rackU": createInputs(AssetInput.RACK_U, "Rack U", false, "An integer indicating the vertical location of the bottom of the equipment (e.g. '5')"),
                "owner": createInputs(AssetInput.OWNER, "Owner", false, "A reference to an existing user on the system who owns this equipment"),
                "comment": createInputs(AssetInput.COMMENT, "Comment", false, "Any additional information associated with this asset"),
                "datacenter": createInputs(AssetInput.DATACENTER, "Datacenter", false, "A reference to an existing datacenter"),
                "macAddress": createInputs(AssetInput.MAC_ADDRESS, "Mac Address", false, "A 6-byte hexadecimal string per network port shown canonically in lower case with colon delimiters (e.g., '00:1e:c9:ac:78:aa').\nA hostname is required to enter in this value"),
                "networkConnections": createInputs(AssetInput.NETWORK_CONNECTIONS, "Port Name", false, "For each network port, a reference to another network port on another piece of gear"),
                "powerConnections": createInputs(AssetInput.POWER_CONNECTIONS, "Power Connections", false, "Choice of PDU port number (0 means not plugged in)"),
                "assetNum": createInputs(AssetInput.ASSET_NUMBER, "Asset Number", false, "A six-digit serial number unique associated with an asset."),
            },
        };
    }

    componentWillMount() {
        console.log("comp did update");
        if ((this.props.defaultValues.model !== this.state.model
            || this.props.defaultValues.hostname !== this.state.hostname
            || this.props.defaultValues.rack !== this.state.rack
            || this.props.defaultValues.rack_position !== this.state.rackU
            || this.props.defaultValues.owner !== this.state.owner
            || this.props.defaultValues.comment !== this.state.comment
            || this.props.defaultValues.datacenter_name !== this.state.datacenter_name
            || this.props.defaultValues.tags !== this.state.tags
            || this.props.defaultValues.network_connections !== this.state.network_connections
            || this.props.defaultValues.power_connections !== this.state.power_connections
            || this.props.defaultValues.asset_number !== this.state.asset_number)
            && !this.state.updated
        ) {
            this.setState({
                model: this.props.defaultValues.model,
                hostname: this.props.defaultValues.hostname,
                rack: this.props.defaultValues.rack,
                rackU: this.props.defaultValues.rack_position,
                owner: this.props.defaultValues.owner,
                comment: this.props.defaultValues.comment,
                datacenter_name: this.props.defaultValues.datacenter_name,
                tags: this.props.defaultValues.tags,
                network_connections: this.props.defaultValues.network_connections,
                power_connections: this.getPowerPortFromProps(this.props.defaultValues.power_connections),
                asset_number: this.props.defaultValues.asset_number,

                leftRight: this.getPowerFromProps(this.props.defaultValues.power_connections),
            });
        } else {
            //this.setState({ updated: true, });
        }

    }

    componentDidMount() {
        this.getLists();
    }

    getPowerFromProps = (pwrCons) => {
        var pwr = [];

        pwrCons.map(pwrCon => {
            if (pwrCon.includes("L")) {
                pwr.push("left");
            } else if (pwrCon.includes("R")) {
                pwr.push("right");
            } else {
                pwr.push("off");
            }
        })

        return pwr;
    }

    getPowerPortFromProps = (pwrCons) => {
        var pwrPorts = [];

        try {
            pwrCons.map(pwrCon => {
                pwrPorts.push(parseInt(pwrCon.substring(1)));
            });
        } catch {

        }

        return pwrPorts;
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

                    this.setState({ loadingModels: false, modelList: modelNames, networkList: networkNames, powerPortList: powerPortNames });
                });
    }

    getOwnerList = () => {
        axios.post(
            getURL(Constants.USERS_MAIN_PATH, searchPath), {
            "filter":
            {
                "username": "",
                "display_name": "",
                "email": "",
                "privilege": {
                    "model": true,
                    "asset": true,
                    "datacenters": ["*"],
                    "power": true,
                    "audit": true,
                    "admin": true
                }
            }
        }).then(
            response => {
                try {
                    console.log(response);
                    var users = [];
                    response.data.users.map(user => users.push(user.username + "/" + user.display_name));
                    this.setState({ loadingOwners: false, ownerList: users });
                } catch {
                    this.setState({ loadingOwners: false })
                }

            });
    }

    getDatacenterList = () => {
        axios.get(
            getURL(Constants.DATACENTERS_MAIN_PATH, "all/")).then(
                response => {
                    var datacenters = [];
                    response.data.datacenters.map(datacenter => {
                        if (this.props.privilege.datacenters.length > 0) {
                            if (this.props.privilege.datacenters[0] === "*" || this.props.privilege.datacenters.includes(datacenter.abbreviation) || this.props.privilege.asset) {
                                datacenters.push(datacenter.name);
                            }
                        }
                    });
                    this.setState({ loadingDatacenters: false, datacenterList: datacenters })
                });

    }

    getAssetList = () => {
        axios.post(
            getURL(Constants.ASSETS_MAIN_PATH, searchPath), emptySearch).then(
                response => {
                    var instances = response.data.instances;

                    var hostnames = [];
                    var hostToModel = {};
                    instances.map(instance => {
                        hostnames.push(instance.hostname);
                        hostToModel[instance.hostname] = instance.model;
                    })

                    this.setState({ loadingHostnames: false, assetNumList: hostnames, assetNumToModelList: hostToModel }, this.availableNetworkConnections());
                });
    }

    editAsset = (event) => {
        event.preventDefault();
        var json = this.createJSON();
        console.log(json);
        axios.post(
            getURL(AssetConstants.ASSETS_MAIN_PATH, AssetCommand.edit),
            json).then(
                response => {
                    if (response.data.message === AssetConstants.SUCCESS_TOKEN) {
                        this.setState({ statusOpen: true, statusMessage: "Successfully saved edits", statusSeverity: AssetConstants.SUCCESS_TOKEN });
                    } else {
                        this.setState({ statusOpen: true, statusMessage: response.data.message, statusSeverity: AssetConstants.ERROR_TOKEN });
                    }
                });

    }

    updateModel = (event) => {
        var model = event.target.value;

        if (model !== "") {
            var ports = this.state.networkList[model];
            var networkConns = {};
            ports.map(port => {
                var defaultNetworkPort = {
                    "mac_address": "",
                    "connection_hostname": "",
                    "connection_port": "",
                }
                networkConns[port] = defaultNetworkPort;
            });
        } else {
            var networkConns = {};
        }


        this.setState({ model: model, network_connections: networkConns }, () => { });
    }

    updateHostname = (event) => {
        this.setState({ hostname: event.target.value });
    }

    updateRack = (event) => {
        var rackVal = stringToRack(event.target.value);
        this.setState({ rack: rackVal }, () => { });
    }

    updateRackU = (event) => {
        this.setState({ rackU: event.target.value }, () => { });
    }

    updateOwner = (event) => {
        this.setState({ owner: event.target.value }, () => { });
    }

    updateComment = (event) => {
        this.setState({ comment: event.target.value }, () => { });
    }

    updateDatacenter = (event) => {
        this.setState({ datacenter_name: event.target.value }, () => { });
    }

    updateTags = (event) => {
        this.setState({ tags: event.target.value }, () => { });
    }

    changeNetworkMacAddress = (event, port) => {
        var val = stringToMac(event.target.value);
        this.setState(prevState => {
            let network_connections = Object.assign({}, prevState.network_connections);
            network_connections[port].mac_address = val;
            return { network_connections };
        }, () => { });
    }

    changeNetworkHostname = (value, port) => {
        var val = value === undefined ? "" : value;
        this.setState(prevState => {
            let network_connections = Object.assign({}, prevState.network_connections);
            network_connections[port].connection_hostname = val;
            return { network_connections };
        }, () => { this.getPortOptions(val); });
    }

    changeNetworkPort = (value, port) => {
        var val = value === undefined ? "" : value;

        this.setState(prevState => {
            let network_connections = Object.assign({}, prevState.network_connections);
            network_connections[port] = (network_connections[port] === null) ? {} : network_connections[port];
            network_connections[port].connection_port = val;
            return { network_connections };
        }, () => { });
    }

    updatePowerPort = (event, port) => {
        var val = event.target.value;

        this.setState(prevState => {
            let power_connections = Object.assign({}, prevState.power_connections);
            power_connections[port] = val;
            return { power_connections };
        }, () => { });
    }

    changePowerPortState = (event, portNum) => {
        var val = event.target.value;

        this.setState(prevState => {
            let leftRight = Object.assign({}, prevState.leftRight);
            leftRight[portNum] = val;
            return { leftRight };
        }, () => { });
    }

    updateAssetNumber = (event) => {
        this.setState({ asset_number: event.target.value }, () => { });
    }

    getPowerConnections = () => {
        if (this.state.leftRight === null) {
            return [];
        }

        var pwrConns = [];
        var defaultValue = 1;
        Object.entries(this.state.leftRight).map(([key, value]) => {
            var num = this.state.power_connections === null ? defaultValue : this.state.power_connections[key];
            switch (value) {
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
            "asset_numberOriginal": this.props.defaultValues.asset_number,
            "model": this.state.model,
            "hostname": this.state.hostname,
            "rack": this.state.rack,
            "rack_position": this.state.rackU,
            "owner": this.state.owner.split("/")[0],
            "comment": this.state.comment,
            "datacenter_name": this.state.datacenter_name,
            "tags": this.state.tags,
            "network_connections": ((this.state.network_connections === null) ? {} : this.state.network_connections),
            "power_connections": this.getPowerConnections(),
            'asset_number': this.state.asset_number,
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
        window.location.reload();
    }

    statusClose = () => {
        this.setState({ statusOpen: false, statusMessage: "", statusSeverity: "" });
    }

    getPortOptions = (hostname) => {
        try {
            this.setState({ portOptions: this.state.networkList[this.state.assetNumToModelList[hostname]] });
        } catch {

        }
    }

    getModel = () => {
        return this.state.model;
    }

    displayNetworks = () => {
        var model = this.getModel();
        return (this.state.networkList && this.state.networkList[model]);
    }

    getNetworkConnections = () => {
        return this.state.network_connections;
    }

    getMacValue = (port) => {
        var netCons = this.getNetworkConnections();
        if (netCons === null) {
            return "";
        }
        return netCons[port] ? netCons[port].mac_address : ""
    }

    getConnectingHostname = (port) => {
        var netCons = this.getNetworkConnections();
        if (netCons === null) {
            return "";
        }
        return netCons[port] ? netCons[port].connection_hostname : ""
    }

    getConnectionPort = (port) => {
        var netCons = this.getNetworkConnections();
        if (netCons === null) {
            return "";
        }
        return netCons[port] ? netCons[port].connection_port : ""
    }

    connectionsDisabled = () => {
        return this.state.hostname === "";
    }

    deleteAsset = () => {
        this.setState({ showConfirmationBox: false })
        axios.post(getURL(Constants.ASSETS_MAIN_PATH, AssetCommand.delete),
            { "asset_number": this.props.defaultValues.asset_number, "datacenter_name": this.props.defaultValues.datacenter_name }).then(
                response => {
                    if (response.data.message === "success") {
                        this.props.close();
                        window.location.reload();
                    } else {
                        this.setState({ statusOpen: true, statusMessage: response.data.message, statusSeverity: AssetConstants.ERROR_TOKEN });
                    }
                }
            )
    }

    decommissionAsset = () => {
        axios.post(getURL(Constants.DECOMMISSIONS_MAIN_PATH, AssetCommand.DECOMMISSION),
            {
                "asset_number": this.props.defaultValues.asset_number,
                "datacenter_name": this.props.defaultValues.datacenter_name,
                "decommission_user":this.props.username,
            }
            ).then(
                response => {
                    if (response.data.message === "success") {
                        this.props.close();
                    } else {
                        this.setState({ statusOpen: true, statusMessage: response.data.message, statusSeverity: AssetConstants.ERROR_TOKEN });
                    }
                }
            )
    }

    openConfirmationBox = () => {
        this.setState({ showConfirmationBox: true });
    }

    closeConfirmationBox = () => {
        this.setState({ showConfirmationBox: false })
    }

    render() {
        const { classes } = this.props;

        return (
            <span>
                {(
                    (this.state.loadingDatacenters
                        || this.state.loadingModels
                        || this.state.loadingHostnames
                        || this.state.loadingOwners)
                    //&& false
                ) ? <div className={classes.progress}><CircularProgress /></div> :
                    <form
                        onSubmit={(event) => { this.editAsset(event) }}
                    >
                        <div className={classes.dialogDiv}>
                            <Grid container spacing={3}>
                                <Grid item xs={3}>
                                    <Tooltip placement="top" open={this.state.inputs.model.Tooltip} title={this.state.inputs.model.description}>
                                        {this.props.disabled ?
                                            <TextField
                                                label={this.state.inputs.model.label}
                                                name={this.state.inputs.model.name}
                                                variant="outlined"
                                                fullWidth
                                                value={this.state.model}
                                                disabled
                                            /> :
                                            <Autocomplete
                                                id="select-model"
                                                options={this.state.modelList}
                                                includeInputInList
                                                value={this.state.model}
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
                                            />}
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={3}>
                                    <Tooltip placement="top" open={this.state.inputs.owner.Tooltip} title={this.state.inputs.owner.description}>
                                        {this.props.disabled ?
                                            <TextField
                                                label={this.state.inputs.owner.label}
                                                name={this.state.inputs.owner.name}
                                                variant="outlined"
                                                fullWidth
                                                value={this.state.owner}
                                                disabled
                                            /> :
                                            <Autocomplete
                                                id="select-owner"
                                                options={this.state.ownerList}
                                                includeInputInList
                                                value={this.state.owner}
                                                renderInput={params => (
                                                    <TextField
                                                        {...params}
                                                        label={this.state.inputs.owner.label}
                                                        name={this.state.inputs.owner.name}
                                                        onChange={this.updateOwner}
                                                        onBlur={this.updateOwner}
                                                        variant="outlined"
                                                        fullWidth
                                                        disabled={this.props.disabled}
                                                    />
                                                )}
                                            />}
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={3}>
                                    <Tooltip placement="top" open={this.state.inputs.datacenter.Tooltip} title={this.state.inputs.datacenter.description}>
                                        {this.props.disabled ?
                                            <TextField
                                                label={this.state.inputs.datacenter.label}
                                                name={this.state.inputs.datacenter.name}
                                                variant="outlined"
                                                fullWidth
                                                value={this.state.datacenter_name}
                                                disabled
                                            /> :
                                            <Autocomplete
                                                id="input-datacenter"
                                                options={this.state.datacenterList}
                                                includeInputInList
                                                value={this.state.datacenter_name}
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
                                                        disabled={this.props.disabled}

                                                    />
                                                )}
                                            />}
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
                                            value={this.state.rack}
                                            required
                                            fullWidth
                                            disabled={this.props.disabled}
                                            defaultValue={this.props.defaultValues.rack}
                                        />
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={3}>
                                    <Tooltip placement="top" open={this.state.inputs.rackU.Tooltip} title={this.state.inputs.rackU.description}>
                                        <TextField
                                            id="input-rackU"
                                            variant="outlined"
                                            type="number"
                                            InputProps={{ inputProps: { min: 1, max: 42 } }}
                                            label={this.state.inputs.rackU.label}
                                            name={this.state.inputs.rackU.name}
                                            onChange={this.updateRackU}
                                            required
                                            fullWidth
                                            disabled={this.props.disabled}
                                            value={this.state.rackU}
                                        />
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={3}>
                                    <Tooltip placement="top" open={this.state.inputs.assetNum.Tooltip} title={this.state.inputs.assetNum.description}>
                                        <TextField
                                            id="input-asset-number"
                                            variant="outlined"
                                            type="number"
                                            InputProps={{ inputProps: { min: 100000, max: 999999 } }}
                                            label={this.state.inputs.assetNum.label}
                                            name={this.state.inputs.assetNum.name}
                                            onChange={this.updateAssetNumber}
                                            value={this.state.asset_number}
                                            required
                                            fullWidth
                                            disabled={this.props.disabled}
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
                                            disabled={this.props.disabled}
                                            value={this.state.hostname}
                                        />
                                    </Tooltip>
                                </Grid>

                                {this.displayNetworks() ?
                                    <Grid item xs={12}>
                                        {this.state.networkList[this.getModel()].map(networkPort => (
                                            <Grid container spacing={3}>
                                                <Grid item xs={2}>
                                                    <Typography>{networkPort + ": "}</Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Tooltip placement="top" open={this.state.inputs.macAddress.Tooltip} title={this.state.inputs.macAddress.description}>
                                                        <TextField
                                                            id="input-mac-address"
                                                            variant="outlined"
                                                            label={this.state.inputs.macAddress.label}
                                                            name={this.state.inputs.macAddress.name}
                                                            onChange={(event) => { this.changeNetworkMacAddress(event, networkPort) }}
                                                            fullWidth
                                                            disabled={this.state.hostname === "" || this.props.defaultValues.hostname}
                                                            value={this.getMacValue(networkPort)}
                                                        />
                                                    </Tooltip>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Tooltip placement="top" open={this.state.inputs.networkConnections.Tooltip} title={this.state.inputs.networkConnections.description}>
                                                        {this.props.disabled ?
                                                            <TextField
                                                                label={"Connection Hostname"}
                                                                name={"Connection Hostname"}
                                                                variant="outlined"
                                                                fullWidth
                                                                value={this.getConnectingHostname(networkPort)}
                                                                disabled
                                                            /> :
                                                            <Autocomplete
                                                                id="input-network-ports-hostname"
                                                                options={this.state.assetNumList}
                                                                includeInputInList
                                                                onChange={(event, value) => { this.changeNetworkHostname(value, networkPort) }}
                                                                required={this.getNetworkConnections()[networkPort].connection_port !== ""}
                                                                value={this.getConnectingHostname(networkPort)}
                                                                renderInput={params => (
                                                                    <TextField
                                                                        {...params}
                                                                        label={"Connection Hostname"}
                                                                        name={"Connection Hostname"}
                                                                        variant="outlined"
                                                                        fullWidth
                                                                    />
                                                                )}
                                                            />}
                                                    </Tooltip>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Tooltip placement="top" open={this.state.inputs.networkConnections.Tooltip} title={this.state.inputs.networkConnections.description}>
                                                        {this.props.disabled ?
                                                            <TextField
                                                                label={"Connection Port"}
                                                                name={"Connection Port"}
                                                                variant="outlined"
                                                                fullWidth
                                                                value={this.getConnectionPort(networkPort)}
                                                                disabled
                                                            /> :
                                                            <Autocomplete
                                                                id="input-network-ports-connection-port"
                                                                options={this.state.portOptions}
                                                                includeInputInList
                                                                onChange={(event, value) => { this.changeNetworkPort(value, networkPort) }}
                                                                required={this.getNetworkConnections()[networkPort].connection_hostname !== ""}
                                                                value={this.getConnectionPort(networkPort)}
                                                                disabled={this.connectionsDisabled()}
                                                                renderInput={params => (
                                                                    <TextField
                                                                        {...params}
                                                                        label={"Connection Port"}
                                                                        name={"Connection Port"}
                                                                        variant="outlined"
                                                                        fullWidth
                                                                    />
                                                                )}
                                                            />}
                                                    </Tooltip>
                                                </Grid>
                                            </Grid>
                                        ))}
                                    </Grid> : null}

                                {(
                                    !(this.state.powerPortList
                                        && this.state.powerPortList[this.state.model])
                                ) ? null :
                                    Array.from({ length: this.state.powerPortList[this.state.model] }, (_, k) => (
                                        <Grid item xs={12}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12}>
                                                    <Typography>{"Power Port: " + k}</Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <FormControl component="fieldset">
                                                        <RadioGroup
                                                            id={"power-port-" + k}
                                                            aria-label="position"
                                                            name={"position" + k}
                                                            value={(this.state.leftRight === null) ? off : (this.state.leftRight[k] === undefined ? off : this.state.leftRight[k])}
                                                            onChange={(event) => { this.changePowerPortState(event, k) }}
                                                            row
                                                        >
                                                            <FormControlLabel
                                                                value={left}
                                                                control={<Radio color="primary" />}
                                                                label="Left"
                                                                labelPlacement="bottom"
                                                                disabled={this.props.disabled}
                                                            />
                                                            <FormControlLabel
                                                                value={right}
                                                                control={<Radio color="primary" />}
                                                                label="Right"
                                                                labelPlacement="bottom"
                                                                disabled={this.props.disabled}
                                                            />
                                                            <FormControlLabel
                                                                value={off}
                                                                control={<Radio color="primary" />}
                                                                label="No Connection"
                                                                labelPlacement="bottom"
                                                                disabled={this.props.disabled}
                                                            />
                                                        </RadioGroup>
                                                    </FormControl>
                                                </Grid>
                                                {(this.state.leftRight === null) ? null : (this.state.leftRight[k] === undefined || this.state.leftRight[k] === off ? null :
                                                    <Grid item xs={2}>
                                                        <TextField
                                                            type="number"
                                                            value={(this.state.power_connections === null) ? 1 : (this.state.power_connections[k] === undefined ? 1 : this.state.power_connections[k])}
                                                            InputProps={{ inputProps: { min: 1, max: 24 } }}
                                                            onChange={(event) => { this.updatePowerPort(event, k) }}
                                                            disabled={this.props.disabled}
                                                        />
                                                        <FormHelperText>Power Port Number</FormHelperText>
                                                    </Grid>
                                                )}
                                            </Grid>
                                        </Grid>
                                    ))
                                }
                                <Grid item xs={6}>
                                    <TextField
                                        id="input-comment"
                                        variant="outlined"
                                        label={this.state.inputs.comment.label}
                                        name={this.state.inputs.comment.name}
                                        onChange={this.updateComment}
                                        multiline={true}
                                        fullWidth
                                        defaultValue={this.props.defaultValues.comment}
                                        disabled={this.props.disabled}
                                    />
                                </Grid>
                                <Grid item xs={6} />
                                {this.props.disabled ? null :
                                    <Grid item xs={1}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            type="submit"
                                        >
                                            Save
                        </Button>
                                    </Grid>}
                                {this.props.disabled ? null :
                                    <Grid item xs={1}>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => this.openConfirmationBox()}
                                        >
                                            Delete
                        </Button>
                                    </Grid>}
                                {this.props.disabled ? null :
                                    <Grid item xs={8}>
                                        <Button
                                            variant="contained"
                                            onClick={() => this.decommissionAsset()}
                                        >
                                            Decommission
                        </Button>
                                    </Grid>}
                            </Grid></div></form>}
                {this.state.statusOpen ?
                    <Alert
                        severity={this.state.statusSeverity}
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    this.statusClose()
                                }}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                    >
                        {this.state.statusMessage}
                    </Alert> : null}

                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={this.state.showConfirmationBox}
                    onClose={this.closeConfirmationBox}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <div className={classes.paper}>
                        <Grid container spacing={5}>
                            <Grid item xs={12}>
                                Are you sure you wish to delete?
                                    </Grid>
                            <Grid item xs={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => this.deleteAsset()}
                                >
                                    Yes
                                        </Button>
                            </Grid>
                            <Grid item xs={1}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => this.closeConfirmationBox()}
                                >
                                    No
                                        </Button>
                            </Grid>
                        </Grid>
                    </div>
                </Modal>
            </span>
        );
    }
}


export default withStyles(useStyles)(EditAsset);
