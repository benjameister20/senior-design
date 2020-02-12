import React from 'react';

import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { CompactPicker } from 'react-color';

import '../stylesheets/ModelStyles.css';
import StatusDisplay from '../../helpers/StatusDisplay';

function createInputs(name, label) {
    return {label, name};
}

const inputs = {
    "vendor":createInputs('vendor', "Vendor", ),
    "modelNumber":createInputs('model_number', "Model Number"),
    "height":createInputs('height', "Height"),
    "displayColor":createInputs('display_color', "Display Color"),
    "powerPorts":createInputs('power_ports', "Power Ports"),
    "cpu":createInputs('cpu', "CPU"),
    "memory":createInputs('memory', "Memory"),
    "storage":createInputs('storage', "Storage"),
    "comments":createInputs('comments', "Comments"),
}

export default class CreateModel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            color:'#000',
        };
    }

    updateColor = (color) => {
        console.log(color);
        this.setState({ color: color });
        this.props.updateModelColor(color.hex);
        console.log("state: " + this.state.color);
    }

    render() {
        return (
        <div>
            <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <Typography>Create Model</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <StatusDisplay
                            open={this.props.statusOpen}
                            severity={this.props.statusSeverity}
                            closeStatus={this.props.statusClose}
                            message={this.props.statusMessage}
                        />
                    <div>
                        <Autocomplete
                            id="select-vendor"
                            options={this.props.options}
                            includeInputInList
                            freeSolo
                            renderInput={params => (
                            <TextField {...params} label={inputs.vendor.label} name={inputs.vendor.name} onChange={this.props.updateModelCreator} onBlur={this.props.updateModelCreator} variant="outlined" fullWidth />
                            )}
                        />
                        <TextField id="standard-basic" variant="outlined" label={inputs.modelNumber.label} name={inputs.modelNumber.name} onChange={this.props.updateModelCreator}/>
                        <TextField id="standard-basic" variant="outlined" label={inputs.height.label} name={inputs.height.name} onChange={this.props.updateModelCreator}/>
                        <CompactPicker
                            color={this.state.color}
                            onChange={this.updateColor}

                        />
                        <TextField id="standard-basic" variant="outlined" label={inputs.powerPorts.label} name={inputs.powerPorts.name} onChange={this.props.updateModelCreator}/>
                        <TextField id="standard-basic" variant="outlined" label={inputs.cpu.label} name={inputs.cpu.name} onChange={this.props.updateModelCreator}/>
                        <TextField id="standard-basic" variant="outlined" label={inputs.memory.label} name={inputs.memory.name} onChange={this.props.updateModelCreator}/>
                        <TextField id="standard-basic" variant="outlined" label={inputs.storage.label} name={inputs.storage.name} onChange={this.props.updateModelCreator}/>
                        <TextField id="standard-basic" variant="outlined" label={inputs.comments.label} name={inputs.comments.name} onChange={this.props.updateModelCreator}/>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.props.createModel}
                    >
                        Create
                    </Button>
                </div>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
        </div>
        );
    }
}
