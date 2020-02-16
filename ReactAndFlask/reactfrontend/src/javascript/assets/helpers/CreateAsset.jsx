import React from 'react';

import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import StatusDisplay from '../../helpers/StatusDisplay';
import { AssetInput } from '../enums/AssetInputs.ts';

function createInputs(name, label) {
    return {label, name};
}

const inputs = {
    "model":createInputs(AssetInput.MODEL, "Model"),
    "hostname":createInputs(AssetInput.HOSTNAME, "Hostname"),
    "rack":createInputs(AssetInput.RACK, "Rack"),
    "rackU":createInputs(AssetInput.RACK_U, "Rack U"),
    "owner":createInputs(AssetInput.OWNER, "Owner"),
    "comment":createInputs(AssetInput.COMMENT, "Comment"),
    "datacenter":createInputs(AssetInput.DATACENTER, "Datacenter"),
    "macAddress":createInputs(AssetInput.MAC_ADDRESS, "Mac Address"),
    "networkConnections":createInputs(AssetInput.NETWORK_CONNECTIONS, "Network Connections"),
    "powerConnections":createInputs(AssetInput.POWER_CONNECTIONS, "Power Connections"),
    "assetNum":createInputs(AssetInput.ASSET_NUMBER, "Asset Number"),
}


export default class CreateAsset extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading:true,
        };
    }

    render() {
        return (
        <div>
            <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <Typography>Create Instance</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <StatusDisplay
                            open={this.props.statusOpen}
                            severity={this.props.statusSeverity}
                            closeStatus={this.props.statusClose}
                            message={this.props.statusMessage}
                        />

                            <Autocomplete
                                id="select-model"
                                options={this.props.options}
                                includeInputInList
                                renderInput={params => (
                                <TextField
                                    {...params}
                                    label={inputs.model.label}
                                    name={inputs.model.name}
                                    onChange={this.props.updateAssetCreator}
                                    onBlur={this.props.updateAssetCreator}
                                    variant="outlined"
                                    fullWidth
                                    required
                                />
                                )}
                            />
                            <TextField
                                id="input-hostname"
                                variant="outlined"
                                label={inputs.hostname.label}
                                name={inputs.hostname.name}
                                onChange={this.props.updateAssetCreator}
                            />
                            <TextField
                                id="input-datacenter"
                                variant="outlined"
                                label={inputs.datacenter.label}
                                name={inputs.datacenter.name}
                                onChange={this.props.updateAssetCreator}
                                required
                            />
                            <TextField
                                id="input-rack"
                                variant="outlined"
                                label={inputs.rack.label}
                                name={inputs.rack.name}
                                onChange={this.props.updateAssetCreator}
                                required
                            />
                            <TextField
                                id="input-rackU"
                                variant="outlined"
                                label={inputs.rackU.label}
                                name={inputs.rackU.name}
                                onChange={this.props.updateAssetCreator}
                                required
                            />
                            <Autocomplete
                                id="select-owner"
                                options={this.props.options}
                                includeInputInList
                                freeSolo
                                renderInput={params => (
                                <TextField
                                    {...params}
                                    label={inputs.owner.label}
                                    name={inputs.owner.name}
                                    onChange={this.props.updateAssetCreator}
                                    onBlur={this.props.updateAssetCreator}
                                    variant="outlined"
                                    fullWidth
                                    required
                                />
                                )}
                            />
                            <TextField
                                id="input-mac-address"
                                variant="outlined"
                                label={inputs.macAddress.label}
                                name={inputs.macAddress.name}
                                onChange={this.props.updateAssetCreator}
                            />
                            <TextField
                                id="input-network-ports"
                                variant="outlined"
                                label={inputs.networkConnections.label}
                                name={inputs.networkConnections.name}
                                onChange={this.props.updateAssetCreator}
                            />
                            <TextField
                                id="input-power-ports"
                                variant="outlined"
                                label={inputs.powerConnections.label}
                                name={inputs.powerConnections.name}
                                onChange={this.props.updateAssetCreator}
                            />
                            <TextField
                                id="input-asset-number"
                                variant="outlined"
                                label={inputs.assetNum.label}
                                name={inputs.assetNum.name}
                                onChange={this.props.updateAssetCreator}
                                required
                            />
                            <TextField
                                id="input-comment"
                                variant="outlined"
                                label={inputs.comment.label}
                                name={inputs.comment.name}
                                onChange={this.props.updateAssetCreator}
                                multiline={true}
                            />

                            <Button
                                variant="contained"
                                color="primary"
                                onClick={this.props.createAsset}
                            >
                                Create
                            </Button>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
        </div>
        );
    }
}
