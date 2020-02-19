import React from 'react';

import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Tooltip from '@material-ui/core/Tooltip';

import StatusDisplay from '../../helpers/StatusDisplay';
import { AssetInput } from '../enums/AssetInputs.ts';

function createInputs(name, label, showTooltip, description) {
    return {label, name, showTooltip, description};
}

export default class DetailAsset extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showConfirmationBox:false,


            inputs: {
                "model":createInputs(AssetInput.MODEL, "Model", false, "A reference to an existing model"),
                "hostname":createInputs(AssetInput.HOSTNAME, "Hostname", false, "A short string compliant with RFC 1034’s definition of 'label'"),
                "rack":createInputs(AssetInput.RACK, "Rack", false, "The rack the equipment is installed in, written as a row letter and rack number, e.g. 'B12'"),
                "rackU":createInputs(AssetInput.RACK_U, "Rack U", false, "An integer indicating the vertical location of the bottom of the equipment (e.g. '5')"),
                "owner":createInputs(AssetInput.OWNER, "Owner", false, "A reference to an existing user on the system who owns this equipment"),
                "comment":createInputs(AssetInput.COMMENT, "Comment", false, "Any additional information associated with this asset"),
                "datacenter":createInputs(AssetInput.DATACENTER, "Datacenter", false, "A reference to a datacenter in which the chosen rack resides"),
                "macAddress":createInputs(AssetInput.MAC_ADDRESS, "Mac Address", false, "A 6-byte hexadecimal string per network port shown canonically in lower case with colon delimiters (e.g., '00:1e:c9:ac:78:aa')"),
                "networkConnections":createInputs(AssetInput.NETWORK_CONNECTIONS, "Network Connections", false, "For each network port, a reference to another network port on another piece of gear"),
                "powerConnections":createInputs(AssetInput.POWER_CONNECTIONS, "Power Connections", false, "For each power port, a choice of PDU in the rack (left or right) and a PDU port number (1..24)"),
                "assetNum":createInputs(AssetInput.ASSET_NUMBER, "Asset Number", false, "A six-digit serial number unique associated with an asset."),
            },
        };
    }

    confirmDelete = () => {
        this.setState({ showConfirmationBox: true });
    }

    closeModal = () => {
        this.setState({showConfirmationBox:false,});
    }

    deleteItem = () => {
        this.setState({ showConfirmationBox: false });
        this.props.delete();
    }

    render() {
        return (
        <div>
            {!this.props.showDetailedView ? null:
            <ExpansionPanel >
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <Typography>Asset Details</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <StatusDisplay
                            open={this.props.statusOpen}
                            severity={this.props.statusSeverity}
                            closeStatus={this.props.statusClose}
                            message={this.props.statusMessage}
                            autoHideDuration={6000}
                        />
                {this.props.loading ? <CircularProgress /> :
                <div>
                    <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <Typography>Create Asset</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                    {(this.state.loading) ? <CircularProgress /> : <span>
                        <StatusDisplay
                            open={this.props.statusOpen}
                            severity={this.props.statusSeverity}
                            closeStatus={this.props.statusClose}
                            message={this.props.statusMessage}
                        />
                            <Tooltip placement="top" open={this.state.inputs.model.Tooltip} title={this.state.inputs.model.description}>
                                <Autocomplete
                                    id="select-model"
                                    options={this.props.options}
                                    includeInputInList
                                    defaultValue={this.props.defaultValues.getModel()}
                                    renderInput={params => (
                                    <TextField
                                        {...params}
                                        label={this.state.inputs.model.label}
                                        name={this.state.inputs.model.name}
                                        onChange={this.props.updateModelEdited}
                                        onBlur={this.props.updateModelEdited}
                                        variant="outlined"
                                        fullWidth
                                        required
                                    />
                                    )}
                                />
                            </Tooltip>
                            <Tooltip placement="top" open={this.state.inputs.hostname.Tooltip} title={this.state.inputs.hostname.description}>
                                <TextField
                                    id="input-hostname"
                                    variant="outlined"
                                    label={this.state.inputs.hostname.label}
                                    name={this.state.inputs.hostname.name}
                                    onChange={this.props.updateModelEdited}
                                    defaultValue={this.props.defaultValues.getHostname()}
                                />
                            </Tooltip>
                            <Tooltip placement="top" open={this.state.inputs.datacenter.Tooltip} title={this.state.inputs.datacenter.description}>
                                <TextField
                                    id="input-datacenter"
                                    variant="outlined"
                                    label={this.state.inputs.datacenter.label}
                                    name={this.state.inputs.datacenter.name}
                                    onChange={this.props.updateModelEdited}
                                    onBlur={this.updateTooltip}
                                    required
                                    defaultValue={this.props.defaultValues.getDatacenter()}
                                />
                            </Tooltip>
                            <Tooltip placement="top" open={this.state.inputs.rack.Tooltip} title={this.state.inputs.rack.description}>
                                <TextField
                                    id="input-rack"
                                    variant="outlined"
                                    label={this.state.inputs.rack.label}
                                    name={this.state.inputs.rack.name}
                                    onChange={this.props.updateModelEdited}
                                    required
                                    defaultValue={this.props.defaultValues.getRack()}
                                />
                            </Tooltip>
                            <Tooltip placement="top" open={this.state.inputs.rackU.Tooltip} title={this.state.inputs.rackU.description}>
                                <TextField
                                    id="input-rackU"
                                    variant="outlined"
                                    label={this.state.inputs.rackU.label}
                                    name={this.state.inputs.rackU.name}
                                    onChange={this.props.updateModelEdited}
                                    required
                                    defaultValue={this.props.defaultValues.getRackU()}
                                />
                            </Tooltip>
                            <Tooltip placement="top" open={this.state.inputs.owner.Tooltip} title={this.state.inputs.owner.description}>
                                <Autocomplete
                                    id="select-owner"
                                    options={this.props.options}
                                    includeInputInList
                                    defaultValue={this.props.defaultValues.getOwner()}
                                    renderInput={params => (
                                    <TextField
                                        {...params}
                                        label={this.state.inputs.owner.label}
                                        name={this.state.inputs.owner.name}
                                        onChange={this.props.updateModelEdited}
                                        onBlur={this.props.updateModelEdited}
                                        variant="outlined"
                                        fullWidth
                                        required
                                    />
                                    )}
                                />
                            </Tooltip>
                            <Tooltip placement="top" open={this.state.inputs.macAddress.Tooltip} title={this.state.inputs.macAddress.description}>
                                <TextField
                                    id="input-mac-address"
                                    variant="outlined"
                                    label={this.state.inputs.macAddress.label}
                                    name={this.state.inputs.macAddress.name}
                                    onChange={this.props.updateModelEdited}
                                    defaultValue={this.props.defaultValues.getMacAddr()}
                                />
                            </Tooltip>
                            <Tooltip placement="top" open={this.state.inputs.networkConnections.Tooltip} title={this.state.inputs.networkConnections.description}>
                                <TextField
                                    id="input-network-ports"
                                    variant="outlined"
                                    label={this.state.inputs.networkConnections.label}
                                    name={this.state.inputs.networkConnections.name}
                                    onChange={this.props.updateModelEdited}
                                    defaultValue={this.props.defaultValues.getNetworkConn()}
                                />
                            </Tooltip>
                            <Tooltip placement="top" open={this.state.inputs.powerConnections.Tooltip} title={this.state.inputs.powerConnections.description}>
                                <TextField
                                    id="input-power-ports"
                                    variant="outlined"
                                    label={this.state.inputs.powerConnections.label}
                                    name={this.state.inputs.powerConnections.name}
                                    onChange={this.props.updateModelEdited}
                                    defaultValue={this.props.defaultValues.getPwrConn()}
                                />
                            </Tooltip>
                            <Tooltip placement="top" open={this.state.inputs.assetNum.Tooltip} title={this.state.inputs.assetNum.description}>
                                <TextField
                                    id="input-asset-number"
                                    variant="outlined"
                                    label={this.state.inputs.assetNum.label}
                                    name={this.state.inputs.assetNum.name}
                                    onChange={this.props.updateModelEdited}
                                    value={this.state.nextAssetNum}
                                    required
                                    defaultValue={this.props.defaultValues.getAssetNum()}
                                />
                            </Tooltip>
                            <Tooltip placement="top" open={this.state.inputs.comment.Tooltip} title={this.state.inputs.comment.description}>
                                <TextField
                                    id="input-comment"
                                    variant="outlined"
                                    label={this.state.inputs.comment.label}
                                    name={this.state.inputs.comment.name}
                                    onChange={this.props.updateModelEdited}
                                    multiline={true}
                                    defaultValue={this.props.defaultValues.getComment()}
                                />
                            </Tooltip>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => this.create()}
                            >
                                Create
                            </Button></span>}
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                    {this.props.disabled ? null:
                    <div>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.props.edit}
                            disabled={this.state.showConfirmationBox}
                        >
                            Save
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.confirmDelete}
                            disabled={this.state.showConfirmationBox}
                        >
                            Delete
                        </Button>
                    </div>}
                    {this.state.showConfirmationBox ? <div>
                        Are you sure you wish to delete?
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.deleteItem}
                        >
                            Yes
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.closeModal}
                        >
                            No
                        </Button>
                    </div>:null}
                </div>}
                    </ExpansionPanelDetails>
                </ExpansionPanel>}
        </div>
        );
    }
}
