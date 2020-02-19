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
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Switch from '@material-ui/core/Switch';

import StatusDisplay from '../../helpers/StatusDisplay';
import { AssetInput } from '../enums/AssetInputs.ts';
import { AssetCommand } from '../enums/AssetCommands.ts'
import getURL from '../../helpers/functions/GetURL';
import * as AssetConstants from "../AssetConstants";
import * as Constants from "../../Constants";
import { Typography } from '@material-ui/core';

function createInputs(name, label, showTooltip, description) {
    return {label, name, showTooltip, description};
}

const emptySearch = {
    "filters":{

    }
}

const searchPath = "search/";

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
            datacenter_id:"",
            tags:[],
            network_connections:null,
            power_connections:[],
            asset_number:1,

            selectedConnection:null,

            statusOpen: false,
            statusMessage: "",
            statusSeverity:"",

            showModal:false,

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
        this.getModelList();
        this.getOwnerList();
        this.getDatacenterList();
        this.getNextAssetNum();
        this.getAssetList();
    }

    getModelList = () => {
        axios.get(
            getURL(Constants.MODELS_MAIN_PATH, searchPath), emptySearch).then(
            response => {
                var models = response.data.results;

                var modelNames = [];
                var networkNames = {};
                var powerPortNames = {};

                models.map(model => {
                    var modelKey = model.vendor + " " + model.model_number;
                    modelNames.push(modelKey);
                    networkNames[modelKey] = model.ethernet_ports;
                    powerPortNames[modelKey] = parseInt(model.power_ports);
                });

                this.setState({ loadingModels: false, modelList: modelNames, networkList: networkNames, powerPortList: powerPortNames })
            });
    }

    getOwnerList = () => {
        axios.get(
            getURL(Constants.USERS_MAIN_PATH, searchPath), emptySearch).then(
            response => {
                this.setState({ loadingOwners: false, ownerList: response.data.results })
            });
    }

    getDatacenterList = () => {
        axios.get(
            getURL(Constants.DATACENTERS_MAIN_PATH, "all/")).then(
            response => this.setState({ loadingDatacenters: false, datacenterList: response.data.results }));
    }

    getNextAssetNum = () => {
        axios.get(
            getURL(Constants.ASSETS_MAIN_PATH, AssetCommand.GET_NEXT_ASSET_NUM)).then(
            response => this.setState({ loadingAssetNumber: false, asset_number: response.data.asset_number }));
    }

    getAssetList = () => {
        axios.get(
            getURL(Constants.ASSETS_MAIN_PATH, searchPath), emptySearch).then(
            response => {
                var instances = response.data.results;

                var assetNums = [];
                var assetNumToModel = {};
                instances.map(instance => {
                    assetNums.push(instance.asset_number);
                    assetNumToModel[instance.asset_number] = instance.model;
                })

                this.setState({ loadingHostnames: false, assetNumList: assetNums, assetNumToModelList: assetNumToModel });
            });
    }

    createAsset = () => {
        axios.post(
            getURL(AssetConstants.ASSETS_MAIN_PATH, AssetCommand.create),
            this.createJSON()).then(
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
                        datacenter_id:"",
                        tags:[],
                        network_connections:[],
                        power_connections:[],
                        asset_number:-1,
                    }, this.props.search());
                } else {
                    this.setState({ statusOpen: true, statusMessage: response.data.message, statusSeverity:AssetConstants.ERROR_TOKEN })
                }
            });
    }

    updateModel = (event, newValue) => {
        this.setState({ model: newValue });
    }

    updateHostname = (event, newValue) => {
        this.setState({ hostname: newValue})
    }

    updateRack = (event, newValue) => {
        this.setState({ rack: newValue });
    }

    updateRackU = (event, newValue) => {
        this.setState({ rackU: newValue });
    }

    updateOwner = (event, newValue) => {
        this.setState({ owner: newValue });
    }

    updateComment = (event, newValue) => {
        this.setState({ comment: newValue });
    }

    updateDatacenter = (event, newValue) => {
        this.setState({ datacenter_id: newValue });
    }

    updateTags = (event, newValue) => {
        this.setState({ tags: newValue });
    }

    updateNetworkMac = (event, port) => {
        this.setState(network_connections => {
            let port = Object.assign({}, network_connections.port);
            port.mac_address = event.target.value;
            return { port };
          });
    }

    updateNetworkPort = (event, port) => {
        this.setState(network_connections => {
            let port = Object.assign({}, network_connections.port);
            port.connection_port = event.target.value;
            return { port };
          });
    }

    updateNetworkHostname = (event, port) => {
        this.setState(network_connections => {
            let port = Object.assign({}, network_connections.port);
            port.connection_hostname = event.target.value;
            return { port };
          });
    }

    updatePowerConnections = (event, newValue) => {
        this.setState({ power_connections: newValue });
    }

    updateAssetNumber = (event, newValue) => {
        this.setState({ asset_number: newValue });
    }

    createJSON = () => {
        return {
            "model":this.state.model,
            "hostname":this.state.hostname,
            "rack":this.state.rack,
            "rackU":this.state.rackU,
            "owner":this.state.owner,
            "comment":this.state.comment,
            "datacenter_id":this.state.datacenter_id,
            "tags":this.state.tags,
            "network_connections":this.state.network_connections,
            "power_connections":this.state.power_connections,
            'asset_number':this.state.asset_number,
        }
    }



    showModal = () => {
        this.setState({ showModal: true });
    }

    closeModal = () => {
        this.setState({ showModal: false });
    }


    render() {
        const { classes } = this.props;

        return (
        <span>
            <StatusDisplay
                open={this.statusOpen}
                severity={this.statusSeverity}
                closeStatus={this.statusClose}
                message={this.statusMessage}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={() => {this.showModal()} }
            >
                Create Asset
            </Button>
            <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={this.state.showModal}
                    onClose={this.closeModal}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                    timeout: 500,
                    }}
                >
                    <Fade in={this.state.showModal}>
                    <div className={classes.paper}>
                    {(
                    (this.state.loadingAssetNumber
                    || this.state.loadingDatacenters
                    || this.state.loadingModels
                    || this.state.loadingHostnames
                    || this.state.loadingOwners)
                    && false
                    ) ? <div className={classes.progress}><CircularProgress /></div> :
                        <form>
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
                                            onBlur={() => this.updateModel}
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
                                            onBlur={() => this.updateOwner}
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

                                        renderInput={params => (
                                        <TextField
                                            {...params}
                                            label={this.state.inputs.datacenter.label}
                                            name={this.state.inputs.datacenter.name}
                                            onChange={this.updateDatacenter}
                                            onBlur={this.updateDatacenter}
                                            required
                                            variant="outlined"
                                            fullWidth
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
                                        onChange={() => this.updateRack}
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
                                        value={this.state.nextAssetNum}
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

                            <Grid item xs={12}>
                                {(!(this.state.networkList && this.state.networkList[this.state.model]) || (this.state.hostname==="")) ? null:
                                this.state.networkList[this.state.model].map(networkPort => (
                                <Grid container spacing={3}>
                                    <Grid item xs={3}>
                                        <Typography>{networkPort + ": "}</Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            id="input-mac-address"
                                            variant="outlined"
                                            label={this.state.inputs.macAddress.label}
                                            name={this.state.inputs.macAddress.name}
                                            onChange={() => this.updateNetworkMac(networkPort)}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Autocomplete
                                            id="input-network-ports"
                                            options={this.state.assetNumList}
                                            includeInputInList
                                            renderInput={params => (
                                                <TextField
                                                    {...params}
                                                    label={"Connection Hostname"}
                                                    name={"Connection Hostname"}
                                                    onBlur={() => this.updateNetworkHostname(networkPort)}
                                                    variant="outlined"
                                                    fullWidth
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Tooltip placement="top" open={this.state.inputs.networkConnections.Tooltip} title={this.state.inputs.networkConnections.description}>
                                            <Autocomplete
                                                id="input-network-ports"
                                                options={this.state.networkList[this.state.assetNumToModel[this.state.selectedConnection[networkPort]]]}
                                                includeInputInList
                                                renderInput={params => (
                                                    <TextField
                                                        {...params}
                                                        label={"Connection Port"}
                                                        name={"Connection Port"}
                                                        onBlur={() => this.updateNetworkPort(networkPort)}
                                                        variant="outlined"
                                                        fullWidth
                                                    />
                                                )}
                                            />
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                                ))}
                            </Grid>

                            <Grid item xs={12}>
                                <Grid container spacing={3}>
                                    {(!(this.state.powerPortList && this.state.powerPortList[this.state.model])) ? null :
                                        Array.from( { length: this.state.powerPortList[this.state.model] }, (_, k) => (
                                            <Grid item xs={3}>
                                                <Tooltip placement="top" open={this.state.inputs.networkConnections.Tooltip} title={this.state.inputs.networkConnections.description}>
                                                    <TextField
                                                        id="starting-num-selector"
                                                        type="number"
                                                        value={1}
                                                        InputProps={{ inputProps: { min: 0, max: 24} }}
                                                    />
                                                    <Switch
                                                        checked={true}
                                                        value="checkedB"
                                                        color="primary"
                                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                                    />
                                                </Tooltip>
                                            </Grid>
                                        ))
                                    }
                                </Grid>
                            </Grid>
                            <Grid item xs={6}>
                                <Tooltip placement="top" open={this.state.inputs.comment.Tooltip} title={this.state.inputs.comment.description}>
                                    <TextField
                                        id="input-comment"
                                        variant="outlined"
                                        label={this.state.inputs.comment.label}
                                        name={this.state.inputs.comment.name}
                                        onChange={this.updateComment}
                                        multiline={true}
                                        fullWidth
                                    />
                                </Tooltip>
                            </Grid>
                            <Grid item xs={6} />

                            <Grid item xs={1}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    onClick={() => this.createAsset()}
                                >
                                    Create
                                </Button>
                            </Grid>
                            <Grid item xs={9}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    onClick={() => this.cancelCreation()}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid></form>}
                    </div>
                    </Fade>
                </Modal>
        </span>
        );
    }
}


export default withStyles(useStyles)(CreateAsset);
