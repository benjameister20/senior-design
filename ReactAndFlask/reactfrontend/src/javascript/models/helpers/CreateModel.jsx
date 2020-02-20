import React from 'react';

import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Typography from '@material-ui/core/Typography';
import { CompactPicker } from 'react-color';
import Paper from '@material-ui/core/Paper';
import '../stylesheets/ModelStyles.css';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

function createInputs(name, label) {
    return {label, name};
}

const inputs = {
    "vendor": createInputs('vendor', "Vendor"),
    "modelNumber": createInputs('model_number', "Model Number"),
    "height": createInputs('height', "Height"),
    "displayColor": createInputs('display_color', "Display Color"),
    "powerPorts": createInputs('power_ports', "Power Ports"),
    "cpu": createInputs('cpu', "CPU"),
    "memory": createInputs('memory', "Memory"),
    "storage": createInputs('storage', "Storage"),
    "comments": createInputs('comments', "Comments"),
}

export default class CreateModel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            color: '#000',
            showModal: false,
        };
    }

    updateColor = (color) => {
        console.log(color);
        this.setState({ color: color });
        this.props.updateModelColor(color.hex);
        console.log("state: " + this.state.color);
    }

    showModal = () => {
        this.setState({ showModal: true });
    }

    closeModal = () => {
        this.setState({ showModal: false });
    }

    render() {
        return (
        <div>
            <Paper elevation={3}>
                <Grid
                    container
                    spacing={2}
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                    style={{"margin": "0px"}}
                >
                    <Grid item xs={12}>
                        <Typography variant="h6">Add new model</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {this.showModal()} }
                        >
                            Create
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    maxWidth: "80%",
                    margin: "0 auto"
                }}
                open={this.state.showModal}
                onClose={this.closeModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={this.state.showModal}>
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
                </Fade>
            </Modal>
        </div>
        );
    }
}
