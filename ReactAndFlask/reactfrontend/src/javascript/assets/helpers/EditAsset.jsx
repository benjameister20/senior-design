// React
import React from 'react';
import axios from 'axios';
import { CompactPicker } from 'react-color';

// Core
import { TextField, Button, Tooltip, CircularProgress, Grid } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import { Radio, RadioGroup, FormControl, FormControlLabel, FormHelperText, Paper } from '@material-ui/core';
import { IconButton, Slide, InputLabel, MenuItem, Select, Modal, Backdrop } from '@material-ui/core';

// Lab
import { Autocomplete, Alert } from '@material-ui/lab';

//Icons
import PowerIcon from '@material-ui/icons/Power';
import PowerOffIcon from '@material-ui/icons/PowerOff';
import LoopIcon from '@material-ui/icons/Loop';
import CloseIcon from '@material-ui/icons/Close';

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
    form: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    div: {
        width: "70%",
        margin: "0 auto",
    },
    buttons: {
        '& > *': {
            margin: theme.spacing(1),
        },
    }
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
            blade_chassis: "",
            blade_position: null,
            mount_type: null,

            chassisList: [],
            mountTypes: null,

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
                "comment": createInputs(AssetInput.COMMENT, "Comments", false, "Any additional information associated with this asset"),
                "datacenter": createInputs(AssetInput.DATACENTER, "Datacenter", false, "A reference to an existing datacenter"),
                "macAddress": createInputs(AssetInput.MAC_ADDRESS, "Mac Address", false, "A 6-byte hexadecimal string per network port shown canonically in lower case with colon delimiters (e.g., '00:1e:c9:ac:78:aa').\nA hostname is required to enter in this value"),
                "networkConnections": createInputs(AssetInput.NETWORK_CONNECTIONS, "Port Name", false, "For each network port, a reference to another network port on another piece of gear"),
                "powerConnections": createInputs(AssetInput.POWER_CONNECTIONS, "Power Connections", false, "Choice of PDU port number (0 means not plugged in)"),
                "assetNum": createInputs(AssetInput.ASSET_NUMBER, "Asset Number", false, "A six-digit serial number unique associated with an asset."),
                "bladeChassis": createInputs(AssetInput.BLADE_CHASSIS, "Blade Chassis", false, "A reference to a blade chassis asset"),
                "bladePosition": createInputs(AssetInput.BLADE_POSITION, "Blade Position", false, "An integer indicating the slot number of a blade"),
            },
        };
    }

    componentWillMount() {
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
                customCPU: this.props.defaultValues.cpu,
                customColor: this.props.defaultValues.display_color,
                customMemory: this.props.defaultValues.memory,
                customStorage: this.props.defaultValues.storage,
                leftRight: this.getPowerFromProps(this.props.defaultValues.power_connections),
                mount_type: this.props.defaultValues.mount_type,
                blade_chassis: this.props.defaultValues.chassis_hostname,
                blade_position: this.props.defaultValues.chassis_slot,
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
        this.getChassisList();
    }

    getChassisList = () => {
        axios.get(
            getURL(Constants.ASSETS_MAIN_PATH, "getchassis")
        ).then(
            response => {
                var instances = response.data.instances;
                var instanceNames = [];

                instances.map(instance => {
                    instanceNames.push(instance.hostname);
                });

                this.setState({ chassisList: instanceNames });
            }
        )
    }

    getModelList = () => {
        axios.post(
            getURL(Constants.MODELS_MAIN_PATH, searchPath), emptySearch).then(
                response => {
                    var models = response.data.models;

                    var modelNames = [];
                    var networkNames = {};
                    var powerPortNames = {};
                    var mountType = {};

                    models.map(model => {
                        var modelKey = model.vendor + " " + model.model_number;
                        modelNames.push(modelKey);
                        networkNames[modelKey] = model.ethernet_ports;
                        powerPortNames[modelKey] = parseInt(model.power_ports);
                        mountType[modelKey] = model.mount_type;
                    });

                    this.setState({ loadingModels: false, modelList: modelNames, networkList: networkNames, powerPortList: powerPortNames, mountTypes: mountType });
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
                    "model": false,
                    "asset": false,
                    "datacenters": [],
                    "power": false,
                    "audit": false,
                    "admin": false
                }
            }
        }).then(
            response => {
                try {
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
                            if (this.props.privilege.datacenters[0] === "*" || this.props.privilege.datacenters.includes(datacenter.abbreviation) || this.props.privilege.asset || this.props.privilege.admin) {
                                datacenters.push(datacenter);
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
        var changePlanJSON = {
            "change_plan_id": this.props.changePlanID,
            "step": this.props.changePlanStep,
            "action": "update",
            "asset_numberOriginal": this.props.defaultValues.asset_number,
            "new_record": json
        };
        var url = this.props.changePlanActive ? getURL(AssetConstants.CHANGE_PLAN_PATH, AssetCommand.CHANGE_PLAN_CREATE_ACTION) : getURL(AssetConstants.ASSETS_MAIN_PATH, AssetCommand.edit);
        axios.post(
            url,
            this.props.changePlanActive ? changePlanJSON : json
        ).then(
            response => {
                if (response.data.message === AssetConstants.SUCCESS_TOKEN) {
                    this.props.incrementChangePlanStep();
                    this.setState({ statusOpen: true, statusMessage: "Successfully saved edits", statusSeverity: AssetConstants.SUCCESS_TOKEN });
                } else {
                    this.setState({ statusOpen: true, statusMessage: response.data.message, statusSeverity: AssetConstants.ERROR_TOKEN });
                }
            });
    }

    updateModel = (event) => {
        console.log(event.target.value);
        var model = event.target.value;

        if (model !== "") {
            var ports = this.state.networkList[model];
            var networkConns = {};

            if (ports !== null) {
                ports.map(port => {
                    var defaultNetworkPort = {
                        "mac_address": "",
                        "connection_hostname": "",
                        "connection_port": "",
                    }
                    networkConns[port] = defaultNetworkPort;
                });
            }

            this.setState({ mount_type: this.state.mountTypes[model] });
        } else {
            var networkConns = {};
        }


        this.setState({ model: model, network_connections: networkConns }, () => { });
    }

    updateBladeChassis = (event) => {
        this.setState({ blade_chassis: event.target.value });
    }

    updateBladePosition = (event) => {
        this.setState({ blade_position: event.target.value });
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
        var isOffline = false;

        this.state.datacenterList.map(dc => {
            if (dc.name === event.target.value) {
                isOffline = dc.is_offline_storage;
            }
        });

        this.setState({ datacenter_name: event.target.value, datacenterIsOffline: isOffline }, () => { });
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
            "chassis_hostname": this.state.blade_chassis,
            "chassis_slot": this.state.blade_position,
            "display_color": this.state.customColor,
            "cpu": this.state.customCPU,
            "memory": this.state.customMemory,
            "storage": this.state.customStorage,
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
        this.props.fetchAllAssets();
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
        return (this.state.networkList && this.state.networkList[model] && !this.state.datacenterIsOffline);
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
                        this.props.fetchAllAssets();
                        this.props.showStatus(true, "success", "Successfully deleted asset");
                    } else {
                        this.setState({ statusOpen: true, statusMessage: response.data.message, statusSeverity: AssetConstants.ERROR_TOKEN });
                    }
                }
            )
    }

    decommissionAsset = () => {
        if (this.props.changePlanActive) {
            var json = this.createJSON();
            console.log(json);
            var changePlanJSON = {
                "change_plan_id": this.props.changePlanID,
                "step": this.props.changePlanStep,
                "action": "decommission",
                "asset_numberOriginal": this.props.defaultValues.asset_number,
                "new_record": json
            };
            var url = getURL(AssetConstants.CHANGE_PLAN_PATH, AssetCommand.CHANGE_PLAN_CREATE_ACTION);
            axios.post(
                url,
                changePlanJSON
            ).then(
                response => {
                    if (response.data.message === AssetConstants.SUCCESS_TOKEN) {
                        this.props.incrementChangePlanStep();
                        this.props.showStatus(true, "success", "Successfully decommissioned asset");
                    } else {
                        this.setState({ statusOpen: true, statusMessage: response.data.message, statusSeverity: AssetConstants.ERROR_TOKEN });
                    }
                });
        } else {
            axios.post(getURL(Constants.DECOMMISSIONS_MAIN_PATH, AssetCommand.DECOMMISSION),
                {
                    "asset_number": this.props.defaultValues.asset_number,
                    "datacenter_name": this.props.defaultValues.datacenter_name,
                    "decommission_user": this.props.username,
                }
            ).then(
                response => {
                    if (response.data.message === "success") {
                        this.props.close();
                        this.props.fetchAllAssets();
                        this.props.showStatus(true, "success", "Successfully decommissioned asset");
                    } else {
                        this.setState({ statusOpen: true, statusMessage: response.data.message, statusSeverity: AssetConstants.ERROR_TOKEN });
                    }
                }
            )
        }

    }

    openConfirmationBox = () => {
        this.setState({ showConfirmationBox: true });
    }

    closeConfirmationBox = () => {
        this.setState({ showConfirmationBox: false })
    }

    cancelUpgrades = () => {
        this.setState({
            customizeModel: false,
            customColor: this.props.defaultValues.display_colorOriginal,
            customCPU: this.props.defaultValues.cpuOriginal,
            customMemory: this.props.defaultValues.memoryOriginal,
            customStorage: this.props.defaultValues.storageOriginal
        });
    }

    restoreDefaults = () => {
        this.setState({
            customColor: this.props.defaultValues.display_colorOriginal,
            customCPU: this.props.defaultValues.cpuOriginal,
            customMemory: this.props.defaultValues.memoryOriginal,
            customStorage: this.props.defaultValues.storageOriginal
        });
    }

    render() {
        const { classes } = this.props;

        return (
            <span className={classes.div}>
                <Paper elevation={3}>
                    {this.props.isDecommissioned ? "This asset was decommissioned by " + this.props.defaultValues.decommission_user + " on " + this.props.defaultValues.timestamp : ""}
                    {(
                        (this.state.loadingDatacenters
                            || this.state.loadingModels
                            || this.state.loadingHostnames
                            || this.state.loadingOwners)
                        //&& false
                    ) ? <div className={classes.progress}><CircularProgress /></div> :
                        <form
                            onSubmit={(event) => { this.editAsset(event) }}
                            className={classes.form}
                        >
                            <div className={classes.dialogDiv}>
                                <Tooltip placement="top" open={this.state.inputs.model.Tooltip} title={this.state.inputs.model.description}>
                                    {this.props.disabled ?
                                        <TextField
                                            label={this.state.inputs.model.label}
                                            name={this.state.inputs.model.name}
                                            value={this.props.isDecommissioned ? this.props.defaultValues.vendor + " " + this.props.defaultValues.model_number : this.state.model}
                                            disabled
                                            style={{ display: "inline-block" }}
                                        /> :
                                        <Autocomplete
                                            id="select-model"
                                            options={this.state.modelList}
                                            includeInputInList
                                            value={this.state.model}
                                            style={{ display: "inline-block" }}
                                            renderInput={params => (
                                                <TextField
                                                    {...params}
                                                    label={this.state.inputs.model.label}
                                                    name={this.state.inputs.model.name}
                                                    onChange={this.updateModel}
                                                    onBlur={this.updateModel}
                                                    required
                                                />
                                            )}
                                        />}
                                </Tooltip>
                                <Tooltip placement="top" open={this.state.inputs.owner.Tooltip} title={this.state.inputs.owner.description}>
                                    {this.props.disabled ?
                                        <TextField
                                            label={this.state.inputs.owner.label}
                                            name={this.state.inputs.owner.name}
                                            fullWidth
                                            value={this.state.owner}
                                            disabled
                                            style={{ display: "inline-block" }}
                                        /> :
                                        <Autocomplete
                                            id="select-owner"
                                            options={this.state.ownerList}
                                            includeInputInList
                                            value={this.state.owner}
                                            style={{ display: "inline-block" }}
                                            renderInput={params => (
                                                <TextField
                                                    {...params}
                                                    label={this.state.inputs.owner.label}
                                                    name={this.state.inputs.owner.name}
                                                    onChange={this.updateOwner}
                                                    onBlur={this.updateOwner}
                                                    fullWidth
                                                    disabled={this.props.disabled}
                                                />
                                            )}
                                        />}
                                </Tooltip>

                                {this.state.mount_type === "blade" ?
                                    <Autocomplete
                                        id="select-chassis"
                                        options={this.state.chassisList}
                                        includeInputInList
                                        style={{ display: "inline-block" }}
                                        value={this.state.blade_chassis}
                                        renderInput={params => (
                                            <TextField
                                                {...params}
                                                label={this.state.inputs.bladeChassis.label}
                                                name={this.state.inputs.bladeChassis.name}
                                                onChange={this.updateBladeChassis}
                                                onBlur={this.updateBladeChassis}
                                                variant="outlined"
                                                fullWidth
                                                required
                                            />
                                        )}
                                    /> : null}
                                {this.state.mount_type === "blade" ?
                                    <span>
                                        <InputLabel id="select-blade-position-label">Blade Position</InputLabel>
                                        <Select
                                            labelId="select-blade-position-label"
                                            id="select-blade-position"
                                            value={this.state.blade_position}
                                            required={true}
                                            onChange={this.updateBladePosition}
                                            style={{ width: "100%" }}
                                        >
                                            <MenuItem value={1}>1</MenuItem>
                                            <MenuItem value={2}>2</MenuItem>
                                            <MenuItem value={3}>3</MenuItem>
                                            <MenuItem value={4}>4</MenuItem>
                                            <MenuItem value={5}>5</MenuItem>
                                            <MenuItem value={6}>6</MenuItem>
                                            <MenuItem value={7}>7</MenuItem>
                                            <MenuItem value={8}>8</MenuItem>
                                            <MenuItem value={9}>9</MenuItem>
                                            <MenuItem value={10}>10</MenuItem>
                                            <MenuItem value={11}>11</MenuItem>
                                            <MenuItem value={12}>12</MenuItem>
                                            <MenuItem value={13}>13</MenuItem>
                                            <MenuItem value={14}>14</MenuItem>
                                        </Select>
                                    </span> : null}

                                <Tooltip placement="top" open={this.state.inputs.datacenter.Tooltip} title={this.state.inputs.datacenter.description}>
                                    {this.props.disabled ?
                                        <TextField
                                            label={this.state.inputs.datacenter.label}
                                            name={this.state.inputs.datacenter.name}
                                            fullWidth
                                            value={this.state.datacenter_name}
                                            disabled
                                            style={{ display: "inline-block" }}
                                        /> :
                                        <Autocomplete
                                            id="input-datacenter"
                                            options={this.state.datacenterList.map(dc => dc.name)}
                                            includeInputInList
                                            value={this.state.datacenter_name}
                                            style={{ display: "inline-block" }}
                                            renderInput={params => (
                                                <TextField
                                                    {...params}
                                                    label={this.state.inputs.datacenter.label}
                                                    name={this.state.inputs.datacenter.name}
                                                    onChange={this.updateDatacenter}
                                                    onBlur={this.updateDatacenter}

                                                    fullWidth
                                                    required
                                                    disabled={this.props.disabled}

                                                />
                                            )}
                                        />}
                                </Tooltip>

                                {(this.state.datacenterIsOffline || this.state.mount_type == "blade") ? null :
                                    <Tooltip placement="top" open={this.state.inputs.rack.Tooltip} title={this.state.inputs.rack.description}>
                                        <TextField
                                            id="input-rack"
                                            label={this.state.inputs.rack.label}
                                            name={this.state.inputs.rack.name}
                                            onChange={this.updateRack}
                                            value={this.state.rack}
                                            required
                                            fullWidth
                                            disabled={this.props.disabled}
                                            defaultValue={this.props.defaultValues.rack}
                                        />
                                    </Tooltip>}
                                {(this.state.datacenterIsOffline || this.state.mount_type == "blade") ? null :
                                    <Tooltip placement="top" open={this.state.inputs.rackU.Tooltip} title={this.state.inputs.rackU.description}>
                                        <TextField
                                            id="input-rackU"

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
                                    </Tooltip>}
                                <Tooltip placement="top" open={this.state.inputs.assetNum.Tooltip} title={this.state.inputs.assetNum.description}>
                                    <TextField
                                        id="input-asset-number"

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
                                <Tooltip placement="top" open={this.state.inputs.hostname.Tooltip} title={this.state.inputs.hostname.description}>
                                    <TextField
                                        id="input-hostname"

                                        label={this.state.inputs.hostname.label}
                                        name={this.state.inputs.hostname.name}
                                        onChange={this.updateHostname}
                                        fullWidth
                                        disabled={this.props.disabled}
                                        value={this.state.hostname}
                                    />
                                </Tooltip>

                                <div>
                                    {this.state.customizeModel || this.props.disabled ? null :
                                        <Button
                                            variant="contained"
                                            color={"primary"}
                                            onClick={() => this.setState({ customizeModel: true })}
                                        >
                                            {"Customize Model Hardware"}
                                        </Button>
                                    }
                                    {this.state.customizeModel || this.props.disabled ?
                                        <span>
                                            <CompactPicker
                                                color={this.state.customColor}
                                                onChange={color => { this.setState({ customColor: color.hex }) }}
                                                disabled={this.props.disabled}
                                            />
                                            <TextField disabled={this.props.disabled} label={"CPU"} value={this.state.customCPU} onChange={event => { this.setState({ customCPU: event.target.value }) }} />
                                            <TextField disabled={this.props.disabled} type="number" value={this.state.customMemory} label={"Memory"} onChange={event => { this.setState({ customMemory: event.target.value }) }} InputProps={{ inputProps: { min: 0 } }} />
                                            <TextField disabled={this.props.disabled} label={"Storage"} value={this.state.customStorage} onChange={event => { this.setState({ customStorage: event.target.value }) }} />
                                            {this.props.disabled ? null : <div className={classes.buttons}>
                                                <Button
                                                    variant="contained"
                                                    color={"primary"}
                                                    onClick={() => this.restoreDefaults()}
                                                >
                                                    Use original Model Values
                                        </Button>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => this.cancelUpgrades()}
                                                >
                                                    Cancel Upgrades
                                        </Button>
                                            </div>}
                                        </span>
                                        : null}
                                </div>


                                {this.displayNetworks() ?
                                    <span>
                                        {this.state.networkList[this.getModel()].length === Object.keys(this.state.network_connections).length ?
                                            this.state.networkList[this.getModel()].map(networkPort => (
                                                <div>
                                                    <Typography style={{ display: "inline-block", }}>{"Network Port: " + networkPort + ": "}</Typography>
                                                    <Tooltip placement="top" open={this.state.inputs.macAddress.Tooltip} title={this.state.inputs.macAddress.description}>
                                                        <TextField
                                                            id="input-mac-address"
                                                            style={{ display: "inline-block" }}
                                                            label={this.state.inputs.macAddress.label}
                                                            name={this.state.inputs.macAddress.name}
                                                            onChange={(event) => { this.changeNetworkMacAddress(event, networkPort) }}
                                                            fullWidth
                                                            value={this.getMacValue(networkPort)}
                                                        />
                                                    </Tooltip>
                                                    <Tooltip placement="top" open={this.state.inputs.networkConnections.Tooltip} title={this.state.inputs.networkConnections.description}>
                                                        {this.props.disabled ?
                                                            <TextField
                                                                label={"Connection Hostname"}
                                                                name={"Connection Hostname"}
                                                                style={{ display: "inline-block" }}
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
                                                                style={{ display: "inline-block" }}
                                                                renderInput={params => (
                                                                    <TextField
                                                                        {...params}
                                                                        label={"Connection Hostname"}
                                                                        name={"Connection Hostname"}
                                                                        fullWidth
                                                                    />
                                                                )}
                                                            />}
                                                    </Tooltip>
                                                    <Tooltip placement="top" open={this.state.inputs.networkConnections.Tooltip} title={this.state.inputs.networkConnections.description}>
                                                        {this.props.disabled ?
                                                            <TextField
                                                                label={"Connection Port"}
                                                                name={"Connection Port"}
                                                                style={{ display: "inline-block" }}
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
                                                                style={{ display: "inline-block" }}
                                                                renderInput={params => (
                                                                    <TextField
                                                                        {...params}
                                                                        label={"Connection Port"}
                                                                        name={"Connection Port"}

                                                                        fullWidth
                                                                    />
                                                                )}
                                                            />}
                                                    </Tooltip>
                                                </div>
                                            )) : null}
                                    </span> : null}

                                {(
                                    !(this.state.powerPortList
                                        && this.state.powerPortList[this.state.model])
                                    || this.state.datacenterIsOffline
                                ) ? null :
                                    Array.from({ length: this.state.powerPortList[this.state.model] }, (_, k) => (
                                        <span>
                                            <Typography>{"Power Port: " + k}</Typography>
                                            <FormControl component="fieldset">
                                                <RadioGroup
                                                    id={"power-port-" + k}
                                                    aria-label="position"
                                                    name={"position" + k}
                                                    style={{ display: "inline-block" }}
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
                                            {(this.state.leftRight === null) ? null : (this.state.leftRight[k] === undefined || this.state.leftRight[k] === off ? null :
                                                <TextField
                                                    type="number"
                                                    value={(this.state.power_connections === null) ? 1 : (this.state.power_connections[k] === undefined ? 1 : this.state.power_connections[k])}
                                                    InputProps={{ inputProps: { min: 1, max: 24 } }}
                                                    onChange={(event) => { this.updatePowerPort(event, k) }}
                                                    disabled={this.props.disabled}
                                                />
                                            )}
                                        </span>
                                    ))
                                }
                                <div>
                                    <TextField
                                        id="input-comment"
                                        fullWidth
                                        label={this.state.inputs.comment.label}
                                        name={this.state.inputs.comment.name}
                                        onChange={this.updateComment}
                                        multiline={true}
                                        fullWidth
                                        style={{ width: "50%" }}
                                        defaultValue={this.props.defaultValues.comment}
                                        disabled={this.props.disabled}
                                    />
                                </div>

                                { this.state.blade_chassis.includes("BMI") ?
                                <div className={classes.buttons}>
                                    <Button
                                        variant="contained"
                                        startIcon={<PowerIcon />}
                                        style={{
                                            backgroundColor: "green",
                                            color: "white"
                                        }}
                                    >
                                        Power On
                                    </Button>
                                    <Button
                                        variant="contained"
                                        startIcon={<PowerOffIcon />}
                                        style={{
                                            backgroundColor: "black",
                                            color: "white"
                                        }}
                                    >
                                        Power Off
                                    </Button>
                                    <Button
                                        variant="contained"
                                        startIcon={<LoopIcon />}
                                        color="primary"
                                    >
                                        Power Cycle
                                    </Button>
                                </div>
                                : null }
                                <div className={classes.buttons}>
                                    {this.props.disabled ? null :
                                        <Button
                                            variant="contained"
                                            color={this.props.changePlanActive ? "" : "primary"}
                                            type="submit"
                                            style={{
                                                backgroundColor: this.props.changePlanActive ? "#64b5f6" : ""
                                            }}
                                        >
                                            {this.props.changePlanActive ? "Save to Change Plan" : "Save"}
                                        </Button>}
                                    {this.props.disabled || this.props.changePlanActive ? null :
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => this.openConfirmationBox()}
                                        >
                                            Delete
                                        </Button>}
                                    {this.props.disabled ? null :
                                        <Button
                                            variant="contained"
                                            onClick={() => this.decommissionAsset()}
                                        >
                                            {this.props.changePlanActive ? "Decommission in Change Plan" : "Decommission"}
                                        </Button>}
                                </div>
                            </div></form>}
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
                </Paper>
            </span>
        );
    }
}


export default withStyles(useStyles)(EditAsset);
