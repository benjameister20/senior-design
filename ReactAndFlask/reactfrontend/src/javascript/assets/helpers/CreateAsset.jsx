import React from 'react';

import axios from 'axios';

import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

import StatusDisplay from '../../helpers/StatusDisplay';
import { AssetInput } from '../enums/AssetInputs.ts';
import { AssetCommand } from '../enums/AssetCommands.ts'
import getURL from '../../helpers/functions/GetURL';
import * as AssetConstants from "../AssetConstants";

function createInputs(name, label, showTooltip, description) {
    return {label, name, showTooltip, description};
}

const useStyles = theme => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
});

class CreateAsset extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loadingAssetNumber:true,
            loadingModels:true,
            modelList:[],
            loadingOwners:true,
            ownerList:[],
            loadingDatacenters:true,
            datacenterList:[],
            loadingHostnames:true,
            hostnameList:[],

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
            asset_number:1,

            statusOpen: false,
            statusMessage: "",
            statusSeverity:"",

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
        this.getNextAssetNum();
        this.getModelList();
        this.getOwnerList();
    }

    getNextAssetNum = () => {
        axios.get(
            getURL(AssetConstants.ASSETS_MAIN_PATH, AssetCommand.GET_NEXT_ASSET_NUM)).then(
            response => this.setState({ loadingAssetNumber: false, asset_number: response.asset_number }));
    }

    getModelList = () => {
        axios.get(
            getURL(AssetConstants.ASSETS_MAIN_PATH, AssetCommand.GET_ALL_MODELS)).then(
            response => this.setState({ loadingModels: false, modelList: response.data.results }));
    }

    getOwnerList = () => {
        axios.get(
            getURL(AssetConstants.ASSETS_MAIN_PATH, AssetCommand.GET_ALL_OWNERS)).then(
            response => this.setState({ loadingOwners: false, ownerList: response.data.results }));
    }

    getDatacenterList = () => {
        axios.get(
            getURL(AssetConstants.ASSETS_MAIN_PATH, AssetCommand.GET_ALL_DATACENTERS)).then(
            response => this.setState({ loadingDatacenters: false, datacenterList: response.data.results }));
    }

    getHostnameList = () => {
        axios.get(
            getURL(AssetConstants.ASSETS_MAIN_PATH, AssetCommand.GET_ALL_HOSTNAME)).then(
            response => this.setState({ loadingHostnames: false, hostnameList: response.data.results }));
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

    updateNetworkConnections = (event, newValue) => {
        this.setState({ network_connections: newValue });
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

    render() {
        const { classes } = this.props;

        return (
        <div className={classes.root}>
            <StatusDisplay
                open={this.statusOpen}
                severity={this.statusSeverity}
                closeStatus={this.statusClose}
                message={this.statusMessage}
            />
            <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <Typography>Create Asset</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        {(this.state.loading) ? <CircularProgress /> :
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
                                        onChange={this.updateRack}
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
                                <Grid container spacing={3}>
                                    <Grid item xs={3}>
                                        <Tooltip placement="top" open={this.state.inputs.networkConnections.Tooltip} title={this.state.inputs.networkConnections.description}>
                                            <TextField
                                                id="input-network-ports"
                                                variant="outlined"
                                                label={"Network Port Name"}
                                                name={"Network Port Name"}
                                                onChange={this.props.updateAssetCreator}
                                                fullWidth
                                            />
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Tooltip placement="top" open={this.state.inputs.macAddress.Tooltip} title={this.state.inputs.macAddress.description}>
                                            <TextField
                                                id="input-mac-address"
                                                variant="outlined"
                                                label={this.state.inputs.macAddress.label}
                                                name={this.state.inputs.macAddress.name}
                                                onChange={this.props.updateAssetCreator}
                                                fullWidth
                                            />
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Tooltip placement="top" open={this.state.inputs.networkConnections.Tooltip} title={this.state.inputs.networkConnections.description}>
                                            <TextField
                                                id="input-network-ports"
                                                variant="outlined"
                                                label={"Connection Hostname"}
                                                name={"Connection Hostname"}
                                                onChange={this.props.updateAssetCreator}
                                                fullWidth
                                            />
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Tooltip placement="top" open={this.state.inputs.networkConnections.Tooltip} title={this.state.inputs.networkConnections.description}>
                                            <TextField
                                                id="input-network-ports"
                                                variant="outlined"
                                                label={"Connection Port"}
                                                name={"Connection Port"}
                                                onChange={this.props.updateAssetCreator}
                                                fullWidth
                                            />
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={3}>
                                <Tooltip placement="top" open={this.state.inputs.networkConnections.Tooltip} title={this.state.inputs.networkConnections.description}>
                                    <FormControl>
                                            <TextField
                                                id="starting-num-selector"
                                                type="number"
                                                value={1}
                                                InputProps={{ inputProps: { min: 0} }}
                                            />
                                            <FormHelperText>Left Power Port</FormHelperText>
                                    </FormControl>
                                </Tooltip>
                            </Grid>
                            <Grid item xs={9}>
                                <Tooltip placement="top" open={this.state.inputs.macAddress.Tooltip} title={this.state.inputs.macAddress.description}>
                                    <FormControl>
                                            <TextField
                                                id="starting-num-selector"
                                                type="number"
                                                value={1}
                                                InputProps={{ inputProps: { min: 0} }}
                                            />
                                            <FormHelperText>Right Power Port</FormHelperText>
                                    </FormControl>
                                </Tooltip>
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

                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    onClick={() => this.createAsset()}
                                >
                                    Create
                                </Button>
                            </Grid>
                        </Grid></form>}
                    </ExpansionPanelDetails>
                </ExpansionPanel>
        </div>
        );
    }
}


export default withStyles(useStyles)(CreateAsset);
