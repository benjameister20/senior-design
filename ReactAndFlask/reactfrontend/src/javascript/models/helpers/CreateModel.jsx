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
import { withStyles } from '@material-ui/core/styles';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';


function createInputs(name, label) {
    return {label, name};
}

const inputs = {
    "vendor": createInputs('vendor', "Vendor"),
    "modelNumber": createInputs('model_number', "Model Number"),
    "height": createInputs('height', "Height"),
    "displayColor": createInputs('display_color', "Display Color"),
    "ethernetPorts": createInputs('ethernet_ports', "Network Ports"),
    "powerPorts": createInputs('power_ports', "Power Ports"),
    "cpu": createInputs('cpu', "CPU"),
    "memory": createInputs('memory', "Memory"),
    "storage": createInputs('storage', "Storage"),
    "comments": createInputs('comments', "Comments"),
}

const useStyles = theme => ({
    root: {
      flexGrow: 1,
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%",
        margin:"0 auto",
        overflow: "scroll"
      },
      grid: {
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[5],
          padding: theme.spacing(2, 4, 3),
          width: "50%"
      },
      progress: {
        display: 'flex',
        '& > * + *': {
          marginLeft: theme.spacing(2),
        },
      },
});

class CreateModel extends React.Component {
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

    create = () => {
        this.props.createModel();
        this.closeModal();
    }

    render() {
        const { classes } = this.props;

        return (
        <div>
            <Paper elevation={3}>
                <Grid
                    container
                    spacing={2}
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                    style={{"padding": "10px"}}
                >
                    <Grid item xs={12}>
                        <Typography
                            variant="h5"
                            style={{
                                //fontWeight: "bold"
                            }}
                        >
                            Add
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            style={{
                                width: "100%",
                                background: "green",
                                color: "white"
                            }}
                            onClick={() => {this.showModal()} }
                        >
                            Create
                        </Button>
                    </Grid>
                    <Grid container item direciton="row" justify="center" alignItems="center" xs={12}>
                        <hr style={{width: "5vw"}} />
                        <Typography color="textSecondary">
                            Or
                        </Typography>
                        <hr style={{width: "5vw"}} />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            style={{width: "100%"}}
                            startIcon={<CloudUploadIcon />}
                            onClick={() => {this.showModal()} }
                        >
                            Import
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={this.state.showModal}
                onClose={this.closeModal}
                closeAfterTransition
            >
                <Fade in={this.state.showModal}>
                    <Backdrop
                        open={this.state.showModal}
                    >
                        <div className={classes.grid}>
                        <Grid
                            container
                            spacing={1}
                            direction="row"
                            justify="flex-start"
                            alignItems="center"
                        >
                            <Grid item xs={12}>
                                <Typography variant="h5">New Model</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Autocomplete
                                    id="select-vendor"
                                    options={this.props.options}
                                    includeInputInList
                                    freeSolo
                                    renderInput={params => (
                                    <TextField {...params} label={inputs.vendor.label} name={inputs.vendor.name} onChange={this.props.updateModelCreator} onBlur={this.props.updateModelCreator} variant="outlined" fullWidth />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField id="standard-basic" variant="outlined" label={inputs.modelNumber.label} name={inputs.modelNumber.name} onChange={this.props.updateModelCreator}/>
                            </Grid>
                            <Grid item xs={3}>
                                <TextField id="standard-basic" variant="outlined" label={inputs.height.label} name={inputs.height.name} onChange={this.props.updateModelCreator}/>
                            </Grid>
                            <Grid item xs={3}>
                                <TextField id="standard-basic" variant="outlined" label={inputs.ethernetPorts.label} name={inputs.ethernetPorts.name} onChange={this.props.updateModelCreator}/>
                            </Grid>
                            <Grid item xs={3}>
                                <TextField id="standard-basic" variant="outlined" label={inputs.powerPorts.label} name={inputs.powerPorts.name} onChange={this.props.updateModelCreator}/>
                            </Grid>
                            <Grid item xs={3}>
                            <TextField id="standard-basic" variant="outlined" label={inputs.cpu.label} name={inputs.cpu.name} onChange={this.props.updateModelCreator}/>
                            </Grid>
                            <Grid item xs={3}>
                            <TextField id="standard-basic" variant="outlined" label={inputs.memory.label} name={inputs.memory.name} onChange={this.props.updateModelCreator}/>
                            </Grid>
                            <Grid item xs={3}>
                            <TextField id="standard-basic" variant="outlined" label={inputs.storage.label} name={inputs.storage.name} onChange={this.props.updateModelCreator}/>
                            </Grid>
                            <Grid item xs={3}>
                            <TextField id="standard-basic" variant="outlined" label={inputs.comments.label} name={inputs.comments.name} onChange={this.props.updateModelCreator}/>
                            </Grid>

                            <Grid item xs={6}>
                                <Typography>Display Color</Typography>
                                <CompactPicker
                                    color={this.state.color}
                                    onChange={this.updateColor}

                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={this.create}
                                >
                                    Create
                                </Button>
                            </Grid>
                            <Grid item xs={3}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={this.closeModal}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                </div>
                </Backdrop>

                </Fade>
            </Modal>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={this.state.showModal}
                onClose={this.closeModal}
                closeAfterTransition
            >
                <Fade in={this.state.showModal}>
                    <Backdrop
                        open={this.state.showModal}
                    >
                        <div className={classes.grid}>
                        <Grid
                            container
                            spacing={1}
                            direction="row"
                            justify="flex-start"
                            alignItems="center"
                        >
                            <Grid item xs={12}>
                                <Typography variant="h5">Import Models</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Autocomplete
                                    id="select-vendor"
                                    options={this.props.options}
                                    includeInputInList
                                    freeSolo
                                    renderInput={params => (
                                    <TextField {...params} label={inputs.vendor.label} name={inputs.vendor.name} onChange={this.props.updateModelCreator} onBlur={this.props.updateModelCreator} variant="outlined" fullWidth />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField id="standard-basic" variant="outlined" label={inputs.modelNumber.label} name={inputs.modelNumber.name} onChange={this.props.updateModelCreator}/>
                            </Grid>
                            <Grid item xs={3}>
                                <TextField id="standard-basic" variant="outlined" label={inputs.height.label} name={inputs.height.name} onChange={this.props.updateModelCreator}/>
                            </Grid>
                            <Grid item xs={3}>
                                <TextField id="standard-basic" variant="outlined" label={inputs.powerPorts.label} name={inputs.powerPorts.name} onChange={this.props.updateModelCreator}/>
                            </Grid>
                            <Grid item xs={3}>
                            <TextField id="standard-basic" variant="outlined" label={inputs.cpu.label} name={inputs.cpu.name} onChange={this.props.updateModelCreator}/>
                            </Grid>
                            <Grid item xs={3}>
                            <TextField id="standard-basic" variant="outlined" label={inputs.memory.label} name={inputs.memory.name} onChange={this.props.updateModelCreator}/>
                            </Grid>
                            <Grid item xs={3}>
                            <TextField id="standard-basic" variant="outlined" label={inputs.storage.label} name={inputs.storage.name} onChange={this.props.updateModelCreator}/>
                            </Grid>
                            <Grid item xs={3}>
                            <TextField id="standard-basic" variant="outlined" label={inputs.comments.label} name={inputs.comments.name} onChange={this.props.updateModelCreator}/>
                            </Grid>

                            <Grid item xs={6}>
                                <Typography>Display Color</Typography>
                                <CompactPicker
                                    color={this.state.color}
                                    onChange={this.updateColor}

                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={this.create}
                                >
                                    Create
                                </Button>
                            </Grid>
                            <Grid item xs={3}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={this.closeModal}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                </div>
                </Backdrop>

                </Fade>
            </Modal>
        </div>
        );
    }
}

export default withStyles(useStyles)(CreateModel);
