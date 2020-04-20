import React from 'react';
import { CompactPicker } from 'react-color';

import { TextField, Button, CircularProgress, Typography, Grid, Modal, Backdrop, Fade } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';

import Autocomplete from '@material-ui/lab/Autocomplete';

function createInputs(name, label) {
    return { label, name };
}

const inputs = {
    "vendor": createInputs('vendor', "Vendor"),
    "modelNumber": createInputs('model_number', "Model Number"),
    "mount_type": createInputs('mount_type', "Mount Type"),
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
        margin: "0 auto",
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

class DetailModel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showConfirmationBox: false,
            color: null,

            mountType: "rackmount",
        };

        this.closeModal = this.closeModal.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
    }

    confirmDelete() {
        this.setState({ showConfirmationBox: true });
    }

    closeModal() {
        this.setState({ showConfirmationBox: false, });
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
        const { classes } = this.props;

        return (
            <div>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={this.props.showDetailedView}
                    onClose={this.props.closeDetailedView}
                    closeAfterTransition
                >
                    <Fade in={this.state.showModal}>
                        <Backdrop
                            open={this.state.showModal}
                        >
                            <div className={classes.grid}>
                                {this.props.loading ? <CircularProgress /> :
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
                                        <InputLabel id="select-mount-type-label">Mount Type</InputLabel>
                                        <Select
                                            labelId="select-mount-type-label"
                                            id="select-mount-type"
                                            value={this.state.mountType}
                                            required={true}
                                            onChange={this.updateMountType}
                                            style={{ width: "100%" }}
                                        >
                                            <MenuItem value="rackmount">Rack Mounted</MenuItem>
                                            <MenuItem value="chassis">Blade Chassis</MenuItem>
                                            <MenuItem value="blade">Blade</MenuItem>
                                        </Select>
                                        {this.state.mountType !== "blade" ?
                                            <TextField id="standard-basic" variant="outlined"
                                                label={inputs.height.label} name={inputs.height.name}
                                                onChange={this.props.updateModelCreator}
                                                disabled={this.props.disabled}
                                                defaultValue={this.props.defaultValues[inputs.height.name]}
                                            />
                                            : null}
                                        <CompactPicker
                                            color={this.state.color !== null ? this.state.color : "#000000"}
                                            onChange={this.updateColor}

                                        />
                                        {this.state.mountType !== "blade" ?
                                            <TextField id="standard-basic" variant="outlined"
                                                label={inputs.powerPorts.label} name={inputs.powerPorts.name}
                                                onChange={this.props.updateModelCreator}
                                                disabled={this.props.disabled}
                                                defaultValue={this.props.defaultValues[inputs.powerPorts.name]}
                                            />
                                            : null}
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
                                            rowsMax={3}
                                            multiline={true}
                                            style={{ width: "100%" }}
                                        />

                                        {this.props.disabled ? null :
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
                                        </div> : null}
                                    </div>}

                                <Grid
                                    container
                                    spacing={1}
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="center"
                                >
                                    <Grid item xs={12}>
                                        <Typography variant="h5">Model Details</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} lg={6}>
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
                                    <Grid item xs={12} sm={6} md={4} lg={3}>
                                        <TextField id="standard-basic" variant="outlined" label={inputs.modelNumber.label} name={inputs.modelNumber.name} onChange={this.props.updateModelCreator} />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <InputLabel id="select-mount-type-label">Mount Type</InputLabel>
                                        <Select
                                            labelId="select-mount-type-label"
                                            id="select-mount-type"
                                            value={this.state.mountType}
                                            required={true}
                                            onChange={this.updateMountType}
                                            style={{ width: "100%" }}
                                        >
                                            <MenuItem value="rackmount">Rack Mounted</MenuItem>
                                            <MenuItem value="chassis">Blade Chassis</MenuItem>
                                            <MenuItem value="blade">Blade</MenuItem>
                                        </Select>
                                    </Grid>
                                    {this.state.mountType !== "blade" ?
                                        <Grid item xs={3}>
                                            <TextField id="standard-basic" variant="outlined" label={inputs.height.label} name={inputs.height.name} onChange={this.props.updateModelCreator} />
                                        </Grid>
                                        : null}
                                    {this.state.mountType !== "blade" ?
                                        <Grid item xs={3}>
                                            <TextField id="standard-basic" variant="outlined" label={inputs.ethernetPorts.label} name={inputs.ethernetPorts.name} onChange={this.props.updateModelCreator} />
                                        </Grid>
                                        : null}
                                    {this.state.mountType !== "blade" ?
                                        <Grid item xs={3}>
                                            <TextField id="standard-basic" variant="outlined" label={inputs.powerPorts.label} name={inputs.powerPorts.name} onChange={this.props.updateModelCreator} />
                                        </Grid>
                                        : null}
                                    <Grid item xs={3}>
                                        <TextField id="standard-basic" variant="outlined" label={inputs.cpu.label} name={inputs.cpu.name} onChange={this.props.updateModelCreator} />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField id="standard-basic" variant="outlined" label={inputs.memory.label} name={inputs.memory.name} onChange={this.props.updateModelCreator} />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField id="standard-basic" variant="outlined" label={inputs.storage.label} name={inputs.storage.name} onChange={this.props.updateModelCreator} />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField rowsMax={3} multiline={true} style={{ width: "100%" }} id="standard-basic" variant="outlined" label={inputs.comments.label} name={inputs.comments.name} onChange={this.props.updateModelCreator} />
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
                                            style={{ width: "100%" }}
                                        >
                                            Create
                                        </Button>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={this.closeModal}
                                            style={{ width: "100%" }}
                                        >
                                            Cancel
                            </Button>
                                    </Grid>
                                </Grid>
                            </div>
                        </Backdrop>

                    </Fade>
                </Modal>
            </div>);
    }
}

export default withStyles(useStyles)(DetailModel);
