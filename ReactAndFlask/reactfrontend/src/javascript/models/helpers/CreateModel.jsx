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
import Dropzone from 'react-dropzone'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

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
    "comment": createInputs('comment', "Comment"),
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
            showImportModal: false,
            importedFile: null,
            networkPorts: [],
            numPorts: 0,
        };
    }

    updateColor = (color) => {
        this.setState({ color: color });
        this.props.updateModelColor(color.hex);
    }

    showModal = () => {
        this.setState({ showModal: true });
    }

    showImportModal = () => {
        this.setState({ showImportModal: true });
    }

    closeModal = () => {
        this.setState({ showModal: false, networkPorts: [], numPorts: 0 });
    }

    closeImportModal = () => {
        this.setState({ showImportModal: false });
    }

    create = (event) => {
        event.preventDefault();
        this.props.createModel(this.state.networkPorts);
        this.closeModal();
    }

    uploadFile = () => {
        const data = new FormData();
        data.append('file', this.state.importedFile);
        this.sendUploadedFile(data);
    }

    chooseFile = (event) => {
        this.setState({ importedFile: event.target.files[0] })
    }

    updateNetworkPorts = (event) => {
        const numPorts = event.target.value === '' ? 0 : event.target.value;

        var ports = [];
        for (var i = 1; i <= numPorts; i++) {
            ports.push(i.toString());
        }

        this.setState({ networkPorts: ports, numPorts: numPorts });
        this.props.updateModelCreator(event);
    }

    updatePort = (port, event) => {
        const ports = this.state.networkPorts;
        ports[port] = event.target.value;

        this.setState({ networkPorts: ports });
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
                            onClick={this.showModal}
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
                            onClick={() => {this.showImportModal()} }
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
                            <form
                                onSubmit={(event) => this.create(event)}
                            >
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
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <Autocomplete
                                    id="select-vendor"
                                    options={this.props.options}
                                    includeInputInList
                                    freeSolo
                                    renderInput={params => (
                                        <TextField {...params} required={true} label={inputs.vendor.label} name={inputs.vendor.name} onChange={this.props.updateModelCreator} onBlur={this.props.updateModelCreator} variant="outlined" fullWidth />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <TextField id="standard-basic" required={true} variant="outlined" label={inputs.modelNumber.label} name={inputs.modelNumber.name} onChange={this.props.updateModelCreator}/>
                            </Grid>
                            <Grid item xs={3}>
                                <TextField type="number" id="standard-basic" required={true} variant="outlined" label={inputs.height.label} name={inputs.height.name} onChange={this.props.updateModelCreator} InputProps={{ inputProps: { min: 1, max: 42} }} style={{ width: "100%" }} />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField type="number" id="standard-basic" variant="outlined" label={inputs.ethernetPorts.label} name={inputs.ethernetPorts.name} onChange={this.updateNetworkPorts} InputProps={{ inputProps: { min: 0} }} />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField type="number" id="standard-basic" variant="outlined" label={inputs.powerPorts.label} name={inputs.powerPorts.name} onChange={this.props.updateModelCreator} InputProps={{ inputProps: { min: 0} }}/>
                            </Grid>
                            <Grid item xs={3}>
                                <TextField id="standard-basic" variant="outlined" label={inputs.cpu.label} name={inputs.cpu.name} onChange={this.props.updateModelCreator}/>
                            </Grid>
                            <Grid item xs={3}>
                                <TextField type="number" id="standard-basic" variant="outlined" label={inputs.memory.label} name={inputs.memory.name} onChange={this.props.updateModelCreator} InputProps={{ inputProps: { min: 0} }} style={{ width: "100%" }}/>
                            </Grid>
                            <Grid item xs={3}>
                                <TextField id="standard-basic" variant="outlined" label={inputs.storage.label} name={inputs.storage.name} onChange={this.props.updateModelCreator}/>
                            </Grid>
                            <Grid item xs={3}>
                                <TextField id="standard-basic" variant="outlined" label={inputs.comment.label} name={inputs.comment.name} onChange={this.props.updateModelCreator}/>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>Display Color</Typography>
                                <CompactPicker
                                    color={this.state.color}
                                    onChange={this.updateColor}

                                />
                            </Grid>
                            <Grid item xs={12}>
                            <List
                                className={classes.root}
                                subheader={
                                    <ListSubheader component="div" id="nested-list-subheader">
                                      Network Ports
                                    </ListSubheader>
                                  }
                                style={{
                                    maxHeight: "30vh",
                                    overflow: "auto"
                                }}
                            >
                                {Array.from({length: this.state.numPorts}, (x,i) => i).map((_, index) => {
                                    const labelId = `list-label-${this.state.networkPorts[index]}`;

                                    return (
                                    <ListItem key={index} role={undefined} dense button>
                                        <ListItemText id={labelId} primary={"Port " + (index+1).toString()} />
                                        <TextField defaultValue={this.state.networkPorts[index]} onChange={(e) => this.updatePort(index, e)} />
                                    </ListItem>
                                    );
                                })}
                                {this.state.numPorts === 0 ? <ListItem key="add-items" role={undefined} dense>
                                <ListItemText id="add-items-label" primary="Enter the number of network ports above" />
                                </ListItem> : null}
                                </List>
                            </Grid>
                            <Grid item xs={3}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    style={{width: "100%"}}
                                >
                                    Create
                                </Button>
                            </Grid>
                            <Grid item xs={3}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={this.closeModal}
                                    style={{width: "100%"}}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                        </form>
                </div>
                </Backdrop>

                </Fade>
            </Modal>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={this.state.showImportModal}
                onClose={this.closeImportModal}
                closeAfterTransition
            >
                <Fade in={this.state.showImportModal}>
                    <Backdrop
                        open={this.state.showImportModal}
                    >
                        <div className={classes.grid}>
                            {this.state.importedFile === null ?
                        <Grid
                            container
                            spacing={1}
                            direction="row"
                            justify="flex-start"
                            alignItems="center"
                        >
                            <Grid item xs={9}>
                                <Typography variant="h5">Import Models</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Button
                                    onClick={this.closeImportModal}
                                    style={{ width: "100%" }}
                                >
                                    Close
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Dropzone onDrop={acceptedFiles => {
                                        this.setState({ importedFile: acceptedFiles[0] });
                                    }}
                                    accept=".csv"
                                >
                                    {({getRootProps, getInputProps}) => (
                                        <section>
                                        <div {...getRootProps()}>
                                        <input {...getInputProps()} />

                                            <Paper
                                                elevation={3}
                                                style={{
                                                    height: "100px"
                                                }}
                                            >
                                                <Grid
                                                    container
                                                    spacing={2}
                                                    direction="row"
                                                    justify="center"
                                                    alignItems="center"
                                                    style={{"padding": "30px"}}
                                                >
                                                    <Grid item xs={12}>
                                                        <Typography align="center" variant="h6">Drag and drop file here!</Typography>
                                                    </Grid>
                                                </Grid>

                                            </Paper>
                                        </div>
                                        </section>
                                    )}
                                </Dropzone>
                            </Grid>
                            <Grid container item direciton="row" justify="center" alignItems="center" xs={12}>
                                <hr style={{width: "20vw"}} />
                                <Typography color="textSecondary">
                                    Or
                                </Typography>
                                <hr style={{width: "20vw"}} />
                            </Grid>
                            <Grid container item direction="row" justify="center" alignItems="center" xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    style={{width: "40%"}}
                                >
                                    Choose File
                                </Button>
                            </Grid>
                        </Grid> : null }
                </div>
                </Backdrop>
                </Fade>
            </Modal>
        </div>
        );
    }
}

export default withStyles(useStyles)(CreateModel);
