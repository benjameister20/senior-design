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
import { CompactPicker } from 'react-color';
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

export default class DetailModel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showConfirmationBox:false,
            color:null,
        };

        this.closeModal = this.closeModal.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
    }

    confirmDelete() {
        this.setState({ showConfirmationBox: true });
    }

    closeModal() {
        this.setState({showConfirmationBox:false,});
    }

    deleteItem() {
        this.setState({ showConfirmationBox: false });
        this.props.delete();
    }

    updateColor = (color) => {
        this.setState({ color: color });
        this.props.updateModelColorDetails(color.hex);
    }

    render() {
        return (
        <div>
            {!this.props.showDetailedView ? null:
            <ExpansionPanel >
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <Typography>Model Details</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <StatusDisplay
                            open={this.props.statusOpen}
                            severity={this.props.statusSeverity}
                            closeStatus={this.props.statusClose}
                            message={this.props.statusMessage}
                            autoHideDuration={6000}
                        />
                    {
                this.props.loading ? <CircularProgress /> :
                <div>
                    <Autocomplete
                            id="select-vendor"
                            options={this.props.options}
                            includeInputInList
                            freeSolo
                            defaultValue={this.props.defaultValues[inputs.vendor.name]}
                            renderInput={params => (
                            <TextField {...params}
                                label={inputs.vendor.label}
                                name={inputs.vendor.name}
                                onChange={this.props.updateModelCreator}
                                onBlur={this.props.updateModelCreator}
                                variant="outlined" fullWidth
                                disabled={this.props.disabled}
                            />
                            )}
                        />
                        <TextField id="standard-basic" variant="outlined"
                            label={inputs.modelNumber.label} name={inputs.modelNumber.name}
                            onChange={this.props.updateModelCreator}
                            disabled={this.props.disabled}
                            defaultValue={this.props.defaultValues[inputs.modelNumber.name]}
                        />
                        <TextField id="standard-basic" variant="outlined"
                            label={inputs.height.label} name={inputs.height.name}
                            onChange={this.props.updateModelCreator}
                            disabled={this.props.disabled}
                            defaultValue={this.props.defaultValues[inputs.height.name]}
                        />
                        <CompactPicker
                            color={this.state.color !== null ? this.state.color : "#000000"}
                            onChange={this.updateColor}

                        />
                        <TextField id="standard-basic" variant="outlined"
                            label={inputs.powerPorts.label} name={inputs.powerPorts.name}
                            onChange={this.props.updateModelCreator}
                            disabled={this.props.disabled}
                            defaultValue={this.props.defaultValues[inputs.powerPorts.name]}
                        />
                        <TextField id="standard-basic" variant="outlined"
                            label={inputs.cpu.label} name={inputs.cpu.name}
                            onChange={this.props.updateModelCreator}
                            disabled={this.props.disabled}
                            defaultValue={this.props.defaultValues[inputs.cpu.name]}
                        />
                        <TextField id="standard-basic" variant="outlined"
                            label={inputs.memory.label} name={inputs.memory.name}
                            onChange={this.props.updateModelCreator}
                            disabled={this.props.disabled}
                            defaultValue={this.props.defaultValues[inputs.memory.name]}
                        />
                        <TextField id="standard-basic" variant="outlined"
                            label={inputs.storage.label} name={inputs.storage.name}
                            onChange={this.props.updateModelCreator}
                            disabled={this.props.disabled}
                            defaultValue={this.props.defaultValues[inputs.storage.name]}
                        />
                        <TextField id="standard-basic" variant="outlined"
                            label={inputs.comments.label} name={inputs.comments.name}
                            onChange={this.props.updateModelCreator}
                            disabled={this.props.disabled}
                            defaultValue={this.props.defaultValues[inputs.comments.name]}
                        />

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
