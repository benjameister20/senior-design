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
    dialogDiv: {
        padding: theme.spacing(2, 4, 3),
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: "80%",
        margin:"0 auto",
        minWidth:"70%",
        maxHeight:"600px",
        overflow:"scroll",
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

class CreateAsset extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // next available asset number
            loadingAssetNumber:true,

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
            portOptions:[],

            canSubmit:false,

            next_pair:-1,
            free_left:-1,
            free_right:-1,

            inputs: {
                "model":createInputs(AssetInput.MODEL, "Model", false, "A reference to an existing model"),
                "hostname":createInputs(AssetInput.HOSTNAME, "Hostname", false, "A short string compliant with RFC 1034’s definition of 'label'"),
                "rack":createInputs(AssetInput.RACK, "Rack", false, "The rack the equipment is installed in, written as a row letter and rack number, e.g. 'B12'"),
                "rackU":createInputs(AssetInput.RACK_U, "Rack U", false, "An integer indicating the vertical location of the bottom of the equipment (e.g. '5')"),
                "owner":createInputs(AssetInput.OWNER, "Owner", false, "A reference to an existing user on the system who owns this equipment"),
                "comment":createInputs(AssetInput.COMMENT, "Comment", false, "Any additional information associated with this asset"),
                "datacenter":createInputs(AssetInput.DATACENTER, "Datacenter", false, "A reference to an existing datacenter"),
                "macAddress":createInputs(AssetInput.MAC_ADDRESS, "Mac Address", false, "A 6-byte hexadecimal string per network port shown canonically in lower case with colon delimiters (e.g., '00:1e:c9:ac:78:aa').\nA hostname is required to enter in this value"),
                "networkConnections":createInputs(AssetInput.NETWORK_CONNECTIONS, "Port Name", false, "For each network port, a reference to another network port on another piece of gear"),
                "powerConnections":createInputs(AssetInput.POWER_CONNECTIONS, "Power Connections", false, "Choice of PDU port number (0 means not plugged in)"),
                "assetNum":createInputs(AssetInput.ASSET_NUMBER, "Asset Number", false, "A six-digit serial number unique associated with an asset."),
            },
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
                        if (this.props.privilege.datacenters[0] === "*" || this.props.privilege.datacenters.includes(datacenter.abbreviation) || this.props.privilege.asset) {
                            datacenters.push(datacenter.name);
                        }
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
            getURL(Constants.ASSETS_MAIN_PATH, searchPath),emptySearch).then(
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

    validJSON = (json) => {
        var valid = (json.model !== ""
        && json.datacenter_name !== ""
        && json.rack !== ""
        && json.rack_position !== -1
        && json.asset_number >= 100000 && json.asset_number <= 999999)

        // Object.entries(json.network_connections).map(([port, vals]) => {
        //     var validConnection = (vals.connection_hostname !== undefined && vals.connection_port === undefined) || (vals.connection_hostname === undefined && vals.connection_port !== undefined);
        //     valid = valid && validConnection;
        // });

        return valid;
    }

    createAsset = (event) => {
        event.preventDefault();
        var json = this.createJSON();
        console.log(this.props.changePlanStep);
        var changePlanJSON = {
            "change_plan_id": this.props.changePlanID,
            "step": this.props.changePlanStep,
            "action": "create",
            "asset_numberOriginal": "",
            "new_record": json
        };
        var url = this.props.changePlanActive ? getURL(AssetConstants.CHANGE_PLAN_PATH, AssetCommand.CHANGE_PLAN_CREATE_ACTION) : getURL(AssetConstants.ASSETS_MAIN_PATH, AssetCommand.create);

        if (this.validJSON(json)) {
            axios.post(
                url,
                this.props.changePlanActive ? changePlanJSON : json
            ).then(
                    response => {
                    console.log(response);
                    if (response.data.message === AssetConstants.SUCCESS_TOKEN) {
                        this.props.incrementChangePlanStep();
                        this.props.showStatus(true, "success", "Successfully created asset");
                        this.closeModal();
                    } else {
                        this.setState({ statusOpen: true, statusMessage: response.data.message, statusSeverity:AssetConstants.ERROR_TOKEN });
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
                        "mac_address":"",
                        "connection_hostname":"",
                        "connection_port":"",
                    }
                    networkConns[port] = defaultNetworkPort;
                });
            }
        } else {
            var networkConns = {};
        }


        this.setState({ model: model, network_connections:networkConns }, () => { this.validateForm() });
    }

    updateHostname = (event) => {
        this.setState({ hostname: event.target.value }, () => { this.validateForm() });
    }

    updateRack = (event) => {
        var rackVal = stringToRack(event.target.value);
        this.setState({ rack: rackVal }, () => { this.validateForm() });
        if (rackVal.length === 2 && this.state.datacenter_name !== "") {
            axios.post(getURL(Constants.RACKS_MAIN_PATH, "nextPDU/"), {
                "rack":rackVal,
                "datacenter_name":this.state.datacenter_name,
            }).then(response => {
                console.log(this.state.power_connections);
                try {
                    var firstFree = response.data.free_left;
                    var pwrLst = [];
                    console.log("updating power ports");
                    this.state.power_connections.map((powerPort, index) => {
                        if (index%2===0 && index<this.state.power_connections.length-1) {
                            console.log(index);
                            pwrLst[index] = firstFree[index];
                            pwrLst[index+1] = firstFree[index+1];
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
        this.setState({ datacenter_name: event.target.value }, () => { this.validateForm() });
    }

    updateTags = (event) => {
        this.setState({ tags: event.target.value }, () => { this.validateForm() });
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
        var val = value===undefined ? "" : value;
        this.setState(prevState => {
            let network_connections = Object.assign({}, prevState.network_connections);
            network_connections[port].connection_hostname = val;
            return { network_connections };
        }, () => { this.getPortOptions(val); this.validateForm() });
    }

    changeNetworkPort = (value, port) => {
        var val = value===undefined ? "" : value;

        this.setState(prevState => {
            let network_connections = Object.assign({}, prevState.network_connections);
            network_connections[port] = (network_connections[port] === null) ? {} : network_connections[port];
            network_connections[port].connection_port = val;
            return { network_connections };
        }, () => {  this.validateForm() });
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
            "owner":this.state.owner.split("/")[0],
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
        this.props.fetchAllAssets();
        this.props.close();
    }

    statusClose = () => {
        this.setState({ statusOpen: false, statusMessage: "", statusSeverity:"" });
    }

    validateForm = () => {
        this.setState({ canSubmit:this.validJSON(this.createJSON()) });
    }

    getPortOptions = (hostname) => {
        try {
            this.setState({ portOptions:this.state.networkList[this.state.assetNumToModelList[hostname]] });
        } catch {

        }
    }

    render() {
        const { classes } = this.props;

        return (
        <span>
            {(
            (this.state.loadingAssetNumber
            || this.state.loadingDatacenters
            || this.state.loadingModels
            || this.state.loadingHostnames
            || this.state.loadingOwners)
            //&& false
            ) ? <div className={classes.progress}><CircularProgress /></div> :
                <form
                    onSubmit={(event) => {this.createAsset(event)}}
                >
                <div className={classes.dialogDiv}>
                <Grid container spacing={3}>
                    <Grid item xs={3}>
                        <Tooltip placement="top" open={this.state.inputs.model.Tooltip} title={this.state.inputs.model.description}>
                            <Autocomplete
                                id="select-model"
                                options={this.state.modelList}
                                includeInputInList

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
                                renderInput={params => (
                                <TextField
                                    {...params}
                                    label={this.state.inputs.owner.label}
                                    name={this.state.inputs.owner.name}
                                    onChange={this.updateOwner}
                                    onBlur={this.updateOwner}
                                    variant="outlined"
                                    fullWidth
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
                                value={this.state.rack}
                                required
                                fullWidth
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
                                value={this.state.asset_number}
                                required
                                fullWidth
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
                            />
                        </Tooltip>
                    </Grid>

                    {!(this.state.networkList && this.state.networkList[this.state.model]) ? null :
                    <Grid item xs={12}>
                        {this.state.networkList[this.state.model].map(networkPort => (
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
                                        onChange={(event) => {this.changeNetworkMacAddress(event, networkPort)}}
                                        fullWidth
                                        value={ (this.state.network_connections !== null && this.state.network_connections[networkPort]!==undefined) ? this.state.network_connections[networkPort].mac_address : "" }
                                    />
                                </Tooltip>
                            </Grid>
                            <Grid item xs={3}>
                                <Tooltip placement="top" open={this.state.inputs.networkConnections.Tooltip} title={this.state.inputs.networkConnections.description}>
                                    <Autocomplete
                                        id="input-network-ports"
                                        options={this.state.assetNumList}
                                        includeInputInList
                                        onChange={(event, value) => {this.changeNetworkHostname(value, networkPort)}}
                                        required={this.state.network_connections[networkPort].connection_port!==""}
                                        renderInput={params => (
                                            <TextField
                                                {...params}
                                                label={"Connection Hostname"}
                                                name={"Connection Hostname"}
                                                variant="outlined"
                                                fullWidth
                                                disabled={this.state.hostname===""}
                                            />
                                        )}
                                    />
                                </Tooltip>
                            </Grid>
                            <Grid item xs={3}>
                                <Tooltip placement="top" open={this.state.inputs.networkConnections.Tooltip} title={this.state.inputs.networkConnections.description}>
                                    <Autocomplete
                                        id="input-network-ports"
                                        options={this.state.portOptions}
                                        includeInputInList
                                        onChange={(event, value) => {this.changeNetworkPort(value, networkPort)}}
                                        renderInput={params => (
                                            <TextField
                                                {...params}
                                                label={"Connection Port"}
                                                name={"Connection Port"}
                                                variant="outlined"
                                                fullWidth
                                                required={this.state.network_connections[networkPort].connection_hostname!==""}
                                                disabled={this.state.hostname===""}
                                            />
                                        )}
                                    />
                                </Tooltip>
                            </Grid>
                        </Grid>
                        ))}
                    </Grid>}

                    {(
                        !(this.state.powerPortList
                        && this.state.powerPortList[this.state.model])
                        ) ? null :
                    Array.from( { length: this.state.powerPortList[this.state.model] }, (_, k) => (
                    <Grid item xs={12}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography>{"Power Port: " + k}</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <FormControl component="fieldset">
                                    <RadioGroup
                                        id={"power-port-"+k}
                                        aria-label="position"
                                        name={"position"+k}
                                        value={(this.state.leftRight===null) ? off:(this.state.leftRight[k]===undefined ? off:this.state.leftRight[k])}
                                        onChange={(event) => {this.changePowerPortState(event, k)} }
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
                            </Grid>
                            {(this.state.leftRight===null) ? null:(this.state.leftRight[k]===undefined||this.state.leftRight[k]===off ? null:
                                <Grid item xs={2}>
                                    <TextField
                                        type="number"
                                        value={(this.state.power_connections===null) ? 1 : (this.state.power_connections[k]===undefined?1:this.state.power_connections[k])}
                                        InputProps={{ inputProps: { min: 1, max: 24} }}
                                        onChange={(event) => {this.updatePowerPort(event, k)} }
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
                            />
                    </Grid>
                    <Grid item xs={6} />
                    <Grid item xs={3}>
                        <Button
                            variant="contained"
                            type="submit"
                            disabled={!this.state.canSubmit}
                            color={this.props.changePlanActive ? "" : "primary"}
                            style={{
                                backgroundColor: this.props.changePlanActive ? "#64b5f6" : ""
                            }}
                        >
                            { this.props.changePlanActive ? "Create in Change Plan" : "Create" }
                        </Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.closeModal}
                        >
                            Cancel
                        </Button>
                    </Grid>
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
                    </Alert>:null}
        </span>
        );
    }
}


export default withStyles(useStyles)(CreateAsset);
