import React from 'react';

import axios from 'axios';
import { CompactPicker } from 'react-color';

import {
    TextField,
    Button,
    Tooltip,
    CircularProgress,
    withStyles,
    Radio,
    RadioGroup,
    FormControl,
    FormControlLabel,
    InputLabel,
    Typography,
    Paper,
    IconButton,
    Slide,
    MenuItem,
    Select
} from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';

import { AssetInput } from '../enums/AssetInputs.ts';
import { AssetCommand } from '../enums/AssetCommands.ts'
import * as Constants from "../../Constants";
import getURL from '../../helpers/functions/GetURL';
import * as AssetConstants from "../AssetConstants";
import stringToMac from "./functions/StringToMacAddress";
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
        "rack_position": null,
        "chassis_hostname": null,
        "chassis_slot": null,
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
        maxWidth: "80%",
        margin: "0 auto",
        minWidth: "70%",
        maxHeight: "600px",
        overflow: "scroll",
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

class CreateAsset extends React.Component {
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
            datacenterIsOffline: false,
            tags: [],
            network_connections: null,
            power_connections: null,
            asset_number: 100000,
            blade_chassis: null,
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

            next_pair: -1,
            free_left: -1,
            free_right: -1,

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
                "bladeChassis": createInputs(AssetInput.BLADE_CHASSIS, "Blade Chassis", false, "A reference to a blade chassis asset"),
                "bladePosition": createInputs(AssetInput.BLADE_POSITION, "Blade Position", false, "An integer indicating the slot number of a blade"),
            },

            customCPU: "",
            customColor: "",
            customMemory: "",
            customStorage: "",
        };
    }

    componentDidMount() {
        this.getLists();
    }

    getLists = () => {
        this.getModelList();
        this.getOwnerList();
        this.getDatacenterList();
        this.getNextAssetNum();
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

                    this.setState({ originalModels: models, loadingModels: false, modelList: modelNames, networkList: networkNames, powerPortList: powerPortNames, mountTypes: mountType });
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
                    "admin": false,
                }
            }
        }).then(
            response => {
                var users = [];
                response.data.users.map(user => users.push(user.username + "/" + user.display_name));
                this.setState({ loadingOwners: false, ownerList: users });
            });
    }

    getDatacenterList = () => {
        axios.get(
            getURL(Constants.DATACENTERS_MAIN_PATH, "all/")).then(
                response => {
                    var datacenters = [];
                    response.data.datacenters.map(datacenter => {
                        if (this.props.privilege.datacenters.length > 0) {
                            if (this.props.privilege.datacenters[0] === "*" || this.props.privilege.datacenters.includes(datacenter.name)) {
                                datacenters.push(datacenter);
                            }
                        } else if (this.props.privilege.asset || this.props.privilege.admin) {
                            datacenters.push(datacenter);
                        }
                    });
                    this.setState({ loadingDatacenters: false, datacenterList: datacenters })
                });
    }

    getNextAssetNum = () => {
        axios.get(
            getURL(Constants.ASSETS_MAIN_PATH, AssetCommand.GET_NEXT_ASSET_NUM)).then(
                response => this.setState({ loadingAssetNumber: false, asset_number: response.data.asset_number }));
    }

    getAssetList = () => {
        axios.post(
            getURL(Constants.ASSETS_MAIN_PATH, searchPath), emptySearch).then(
                response => {
                    var instances = response.data.instances;

                    var hostnames = [];
                    var hostToModel = {};
                    instances.map(instance => {
                        if (instance.hostname !== "") {
                            hostnames.push(instance.hostname);
                        }

                        hostToModel[instance.hostname] = instance.model;
                    })

                    this.setState({ loadingHostnames: false, assetNumList: hostnames, assetNumToModelList: hostToModel }, this.availableNetworkConnections());
                });
    }

    validJSON = (json) => {
        return (
            json.model !== "" &&
            json.datacenter_name !== "" &&
            (json.rack !== "" || this.state.mount_type == "blade") &&
            (json.rack_position !== -1 || this.state.mount_type == "blade") &&
            json.asset_number >= 100000 &&
            json.asset_number <= 999999
        );
    }

    createAsset = (event) => {
        event.preventDefault();

        var json = this.createJSON();
        var changePlanJSON = {
            "change_plan_id": this.props.changePlanID,
            "step": this.props.changePlanStep,
            "action": "create",
            "asset_numberOriginal": "",
            "new_record": json
        };
        var url = this.props.changePlanActive ? getURL(AssetConstants.CHANGE_PLAN_PATH, AssetCommand.CHANGE_PLAN_CREATE_ACTION) : getURL(AssetConstants.ASSETS_MAIN_PATH, AssetCommand.create);

        if (true) {
            axios.post(
                url,
                this.props.changePlanActive ? changePlanJSON : json
            ).then(
                response => {
                    if (response.data.message === AssetConstants.SUCCESS_TOKEN) {
                        this.props.incrementChangePlanStep();
                        this.props.showStatus(true, "success", "Successfully created asset");
                        this.closeModal();
                    } else {
                        this.setState({ statusOpen: true, statusMessage: response.data.message, statusSeverity: AssetConstants.ERROR_TOKEN });
                    }
                });
        }
    }

    updateModel = (event) => {
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


        this.setState({ model: model, network_connections: networkConns }, () => { this.validateForm(); this.restoreDefaults() });
    }

    updateBladeChassis = (event) => {
        this.setState({ blade_chassis: event.target.value });
    }

    updateBladePosition = (event) => {
        this.setState({ blade_position: event.target.value });
    }

    updateHostname = (event) => {
        this.setState({ hostname: event.target.value }, () => { this.validateForm() });
    }

    updateRack = (event) => {
        var rackVal = stringToRack(event.target.value);
        this.setState({ rack: rackVal }, () => { this.validateForm() });

        if (rackVal.length === 2 && this.state.datacenter_name !== "") {
            axios.post(getURL(Constants.RACKS_MAIN_PATH, "nextPDU/"), {
                "rack": rackVal,
                "datacenter_name": this.state.datacenter_name,
            }).then(response => {
                console.log(this.state.power_connections);
                try {
                    var firstFree = response.data.free_left;
                    var pwrLst = [];

                    this.state.power_connections.map((powerPort, index) => {
                        if (index % 2 === 0 && index < this.state.power_connections.length - 1) {
                            console.log(index);
                            pwrLst[index] = firstFree[index];
                            pwrLst[index + 1] = firstFree[index + 1];
                        } else {
                            console.log("passing");
                        }
                    });
                } catch (exception) {
                    console.log(exception);
                }
            });
        }

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
        var isOffline = false;

        this.state.datacenterList.map(dc => {
            if (dc.name === event.target.value) {
                isOffline = dc.is_offline_storage;
            }
        });
        this.setState({ datacenter_name: event.target.value, datacenterIsOffline: isOffline }, () => { this.validateForm() });
    }

    changeNetworkMacAddress = (event, port) => {
        var val = stringToMac(event.target.value);
        this.setState(prevState => {
            let network_connections = Object.assign({}, prevState.network_connections);
            network_connections[port].mac_address = val;
            return { network_connections };
        }, () => { this.validateForm() });
    }

    changeNetworkHostname = (value, port) => {
        var val = value === undefined ? "" : value;
        this.setState(prevState => {
            let network_connections = Object.assign({}, prevState.network_connections);
            network_connections[port].connection_hostname = val;
            return { network_connections };
        }, () => { this.getPortOptions(val); this.validateForm() });
    }

    changeNetworkPort = (value, port) => {
        var val = value === undefined ? "" : value;

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
            "model": this.state.model,
            "hostname": this.state.hostname,
            "rack": this.state.rack,
            "rack_position": this.state.rackU,
            "owner": this.state.owner.split("/")[0],
            "comment": this.state.comment,
            "datacenter_name": this.state.datacenter_name,
            "tags": this.state.tags,
            "network_connections": (this.state.network_connections === null) ? {} : this.state.network_connections,
            "power_connections": this.getPowerConnections(),
            'asset_number': this.state.asset_number,
            "chassis_hostname": this.state.blade_chassis,
            "chassis_slot": this.state.blade_position,
            "cpu": this.state.customCPU,
            "display_color": this.state.customColor,
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
        this.props.close();
    }

    statusClose = () => {
        this.setState({ statusOpen: false, statusMessage: "", statusSeverity: "" });
    }

    validateForm = () => {
        this.setState({ canSubmit: this.validJSON(this.createJSON()) });
    }

    getPortOptions = (hostname) => {
        try {
            this.setState({ portOptions: this.state.networkList[this.state.assetNumToModelList[hostname]] });
        } catch { }
    }

    cancelUpgrades = () => {
        this.setState({ customizeModel: false }, () => { this.restoreDefaults() });
    }

    restoreDefaults = () => {
        var currModel = null;
        this.state.originalModels.map(model => {
            if (this.state.model === model.vendor + " " + model.model_number) {
                currModel = model;
            }
        });

        if (currModel !== null && currModel !== undefined) {
            this.setState({
                customColor: currModel.display_color === null ? "#A52A2A" : currModel.display_color,
                customCPU: currModel.cpu,
                customMemory: currModel.memory,
                customStorage: currModel.storage,
            });
        } else {
            this.setState({
                customColor: "#A52A2A",
                customCPU: "",
                customMemory: "",
                customStorage: "",
            });
        }

    }

    render() {
        const { classes } = this.props;

        return (
            <span className={classes.div}>
                <Paper elevation={3}>
                    {(
                        (this.state.loadingAssetNumber
                            || this.state.loadingDatacenters
                            || this.state.loadingModels
                            || this.state.loadingHostnames
                            || this.state.loadingOwners)
                        //&& false
                    ) ? <div className={classes.progress}><CircularProgress /></div> :
                        <form
                            onSubmit={(event) => { this.createAsset(event) }}
                            className={classes.form}
                        >
                            <div className={classes.dialogDiv}>
                                <Tooltip placement="top" open={this.state.inputs.model.Tooltip} title={this.state.inputs.model.description}>
                                    <Autocomplete
                                        id="select-model"
                                        options={this.state.modelList}
                                        includeInputInList
                                        style={{ display: "inline-block" }}
                                        onSelect={this.updateModel}
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
                                    />
                                </Tooltip>

                                {this.state.mount_type === "blade" ?
                                    <div>
                                    <Autocomplete
                                        id="select-chassis"
                                        options={this.state.chassisList}
                                        includeInputInList
                                        style={{ display: "inline-block" }}
                                        renderInput={params => (
                                            <TextField
                                                {...params}
                                                label={this.state.inputs.bladeChassis.label}
                                                name={this.state.inputs.bladeChassis.name}
                                                onChange={this.updateBladeChassis}
                                                onBlur={this.updateBladeChassis}
                                                variant="outlined"
                                                required
                                            />
                                        )}
                                    />
                                    <InputLabel id="select-blade-position-label">Blade Position</InputLabel>
                                        <Select
                                            labelId="select-blade-position-label"
                                            id="select-blade-position"
                                            value={this.state.blade_position}
                                            required={true}
                                            onChange={this.updateBladePosition}
                                            style={{ display: "inline-block", width: "20%" }}
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
                                    </div>
                                    : null}

                                <Tooltip placement="top" open={this.state.inputs.owner.Tooltip} title={this.state.inputs.owner.description}>
                                    <Autocomplete
                                        id="select-owner"
                                        options={this.state.ownerList}
                                        includeInputInList
                                        style={{ display: "inline-block" }}
                                        renderInput={params => (
                                            <TextField
                                                {...params}
                                                label={this.state.inputs.owner.label}
                                                name={this.state.inputs.owner.name}
                                                onChange={this.updateOwner}
                                                onBlur={this.updateOwner}
                                            />
                                        )}
                                    />
                                </Tooltip>
                                <Tooltip placement="top" open={this.state.inputs.datacenter.Tooltip} title={this.state.inputs.datacenter.description}>
                                    <Autocomplete
                                        id="input-datacenter"
                                        options={this.state.datacenterList.map(datacenter => datacenter.name)}
                                        includeInputInList
                                        style={{ display: "inline-block" }}
                                        renderInput={params => (
                                            <TextField
                                                {...params}
                                                label={this.state.inputs.datacenter.label}
                                                name={this.state.inputs.datacenter.name}
                                                onChange={(event) => { this.updateDatacenter(event) }}
                                                onBlur={this.updateDatacenter}


                                                required
                                            />
                                        )}
                                    />
                                </Tooltip>
                                {(this.state.datacenterIsOffline || this.state.mount_type == "blade") ? null :
                                    <Tooltip placement="top" open={this.state.inputs.rack.Tooltip} title={this.state.inputs.rack.description}>
                                        <TextField
                                            id="input-rack"
                                            style={{ display: "inline-block" }}
                                            label={this.state.inputs.rack.label}
                                            name={this.state.inputs.rack.name}
                                            onChange={this.updateRack}
                                            value={this.state.rack}
                                            required

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

                                    />
                                </Tooltip>
                                <Tooltip placement="top" open={this.state.inputs.hostname.Tooltip} title={this.state.inputs.hostname.description}>
                                    <TextField
                                        id="input-hostname"

                                        label={this.state.inputs.hostname.label}
                                        name={this.state.inputs.hostname.name}
                                        onChange={this.updateHostname}

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
                                                onChange={color => { try { this.setState({ customColor: color.hex }) } catch { this.setState({ customColor: "#A52A2A" }) } }}
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

                                {!(this.state.networkList && this.state.networkList[this.state.model]) || this.state.datacenterIsOffline ? null :
                                    this.state.networkList[this.state.model].map(networkPort => (
                                        <div>
                                            <Typography style={{ display: "inline-block", }}>{"Network Port: " + networkPort + ": "}</Typography>
                                            <Tooltip placement="top" open={this.state.inputs.macAddress.Tooltip} title={this.state.inputs.macAddress.description}>
                                                <TextField
                                                    id="input-mac-address"
                                                    label={this.state.inputs.macAddress.label}
                                                    name={this.state.inputs.macAddress.name}
                                                    onChange={(event) => { this.changeNetworkMacAddress(event, networkPort) }}
                                                    value={(this.state.network_connections !== null && this.state.network_connections[networkPort] !== undefined) ? this.state.network_connections[networkPort].mac_address : ""}
                                                />
                                            </Tooltip>
                                            <Tooltip placement="top" open={this.state.inputs.networkConnections.Tooltip} title={this.state.inputs.networkConnections.description}>
                                                <Autocomplete
                                                    id="input-network-ports"
                                                    options={this.state.assetNumList}
                                                    includeInputInList
                                                    style={{ display: "inline-block" }}
                                                    onChange={(event, value) => { this.changeNetworkHostname(value, networkPort) }}
                                                    required={this.state.network_connections[networkPort].connection_port !== ""}
                                                    renderInput={params => (
                                                        <TextField
                                                            {...params}
                                                            label={"Connection Hostname"}
                                                            name={"Connection Hostname"}


                                                            disabled={this.state.hostname === ""}
                                                        />
                                                    )}
                                                />
                                            </Tooltip>
                                            <Tooltip placement="top" open={this.state.inputs.networkConnections.Tooltip} title={this.state.inputs.networkConnections.description}>
                                                <Autocomplete
                                                    id="input-network-ports"
                                                    options={this.state.portOptions}
                                                    includeInputInList
                                                    style={{ display: "inline-block" }}
                                                    onChange={(event, value) => { this.changeNetworkPort(value, networkPort) }}
                                                    renderInput={params => (
                                                        <TextField
                                                            {...params}
                                                            label={"Connection Port"}
                                                            name={"Connection Port"}
                                                            required={this.state.network_connections[networkPort].connection_hostname !== ""}
                                                            disabled={this.state.hostname === ""}
                                                        />
                                                    )}
                                                />
                                            </Tooltip>
                                        </div>
                                    ))}

                                {(
                                    !(this.state.powerPortList
                                        && this.state.powerPortList[this.state.model])
                                ) || this.state.datacenterIsOffline
                                    ? null :
                                    Array.from({ length: this.state.powerPortList[this.state.model] }, (_, k) => (
                                        <span>
                                            <Typography>{"Power Port: " + k}</Typography>
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
                                                    />
                                                    <FormControlLabel
                                                        value={right}
                                                        control={<Radio color="primary" />}
                                                        label="Right"
                                                        labelPlacement="bottom"
                                                    />
                                                    <FormControlLabel
                                                        value={off}
                                                        control={<Radio color="primary" />}
                                                        label="No Connection"
                                                        labelPlacement="bottom"
                                                    />
                                                </RadioGroup>
                                            </FormControl>
                                            {(this.state.leftRight === null) ? null : (this.state.leftRight[k] === undefined || this.state.leftRight[k] === off ? null :
                                                <TextField
                                                    type="number"
                                                    value={(this.state.power_connections === null) ? 1 : (this.state.power_connections[k] === undefined ? 1 : this.state.power_connections[k])}
                                                    InputProps={{ inputProps: { min: 1, max: 24 } }}
                                                    onChange={(event) => { this.updatePowerPort(event, k) }}
                                                />
                                            )}
                                        </span>
                                    ))
                                }

                                <div>
                                    <TextField
                                        id="input-comment"
                                        style={{ width: "50%" }}
                                        label={this.state.inputs.comment.label}
                                        name={this.state.inputs.comment.name}
                                        onChange={this.updateComment}
                                        multiline={true}

                                    />
                                </div>

                                <div className={classes.buttons}>
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        color={this.props.changePlanActive ? "" : "primary"}
                                        style={{
                                            backgroundColor: this.props.changePlanActive ? "#64b5f6" : ""
                                        }}
                                    >
                                        {this.props.changePlanActive ? "Create in Change Plan" : "Create"}
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={this.closeModal}
                                    >
                                        Cancel
                                    </Button>
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
                </Paper>
            </span>
        );
    }
}


export default withStyles(useStyles)(CreateAsset);
