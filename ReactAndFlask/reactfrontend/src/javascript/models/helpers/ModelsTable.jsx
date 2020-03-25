import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { Paper, Popover, Typography, Modal, Backdrop, Fade } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CommentIcon from '@material-ui/icons/Comment';
import ViewListIcon from '@material-ui/icons/ViewList';
import EditIcon from '@material-ui/icons/Edit';
import { withStyles } from '@material-ui/core/styles';
import { Button, TextField, Grid } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { CompactPicker } from 'react-color';
import { List, ListItem, ListItemText, ListSubheader } from '@material-ui/core';
import { Privilege } from '../../enums/privilegeTypes.ts'
import axios from 'axios';
import { CircularProgress } from '@material-ui/core';
import { ModelCommand } from '../enums/ModelCommands.ts'
import getURL from '../../helpers/functions/GetURL';
import * as ModelConstants from "../ModelConstants";

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

const modelsMainPath = 'models/';

function createInputs(name, label) {
        return {label, name};
}

const inputs = {
    "vendor": createInputs('vendor', "Vendor", ),
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

class ModelsTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
                popoverAnchor: null,
                commentPopover: null,

                networkPorts: [],
                numPorts: 0,

                showDetailedView: false,
                showDeleteModal: false,

                row: null,
                comment: "",
                color: '#000',

                detailViewLoading: false,

                detailedValues : {
                        'vendor':'',
                        'model_number':'',
                        'height':'',
                        'display_color':'',
                        'ethernet_ports':[],
                        'power_ports':'',
                        'cpu':'',
                        'memory':'',
                        'storage':'',
                        'comment':'',
                },

                originalVendor: '',
                originalModelNumber: '',
                originalHeight: '',
        };

        axios.defaults.headers.common['token'] = this.props.token;
        axios.defaults.headers.common['privilege'] = this.props.privilege;
    }

    updateColor = (color) => {
        var oldDetails = this.state.detailedValues;
        oldDetails.display_color = color.hex;
        this.setState({ color: color, detailedValues: oldDetails });
        this.props.updateModelColor(color.hex);
    }

    // Show the detail view of a model to edit
    showDetailedView = (row) => {
        this.setState({
            row: row,
            showDetailedView: true,
            detailViewLoading: true,
            color: row["Display Color"] === null ? "#000000" : row["Display Color"],
            networkPorts: row["Network Ports"] === null ? [] : row["Network Ports"],
            numPorts: row["Network Ports"] === null ? 0 : row["Network Ports"].length
        });

        this.detailViewModel(row["Vendor"], row["Model Number"]);
    }

    // Get the details of a model
    detailViewModel = (vendor, modelNum) => {
        axios.post(
            getURL(modelsMainPath, ModelCommand.detailView), {
                'vendor': vendor,
                'model_number': modelNum,
            }).then(response => {
                    const model = response.data['models'][0];
                    this.setState({
                        detailedValues: model,
                        detailViewLoading: false,
                        originalVendor: model["vendor"],
                        originalModelNumber: model["model_number"],
                        originalHeight: model["height"]
                    });
            }).catch(function(error) {
                this.setState({
                    showStatus: true,
                    statusMessage: ModelConstants.GENERAL_MODEL_ERROR,
                    statusSeverity: "error"
                });
            });
    }

    // Close the detail view of a model
    closeDetailedView = () => {
            this.setState({ showDetailedView: false, row: null, color: "#000000", originalVendor: "", originalModelNumber: "", originalHeight: "" });
    }

    // Show delete model confirmation
    showDeleteModal = (row) => {
            this.setState({ showDeleteModal: true, originalVendor: row["Vendor"], originalModelNumber: row["Model Number"] });
    }

    // Close delete model confirmation
    closeDeleteModal = () => {
                this.setState({ showDeleteModal: false, originalVendor: "", originalModelNumber: "", originalHeight: "" });
    }

    // Delete a model
    delete = () => {
        this.props.deleteModel(this.state.originalVendor, this.state.originalModelNumber);
        this.closeDeleteModal();
    }

    clickInfo = (event, ports) => {
            this.setState({ popoverAnchor: event.target, networkPorts: ports });
    }

    clickComment = (event, comment) => {
            this.setState({ commentPopover: event.target, comment: comment });
    }

    handlePopoverClose = () => {
            this.setState({ popoverAnchor: null });
    }

    handleCommentPopoverClose = () => {
            this.setState({ commentPopover: null });
    }

    updateNetworkPorts = (event) => {
        const numPorts = event.target.value === '' ? 0 : event.target.value;

        var ports = [];
        for (var i = 1; i <= numPorts; i++) {
                ports.push(i.toString());
        }

        this.setState({ networkPorts: ports, numPorts: numPorts });
        this.updateModelEdited(event);
    }

        updatePort = (port, event) => {
                const ports = this.state.networkPorts;
                ports[port] = event.target.value;

                this.setState({ networkPorts: ports });
        }

        save = () => {
                this.props.editModel(this.state.originalVendor, this.state.originalModelNumber, this.state.originalHeight, this.state.detailedValues, this.state.networkPorts);
                this.closeDetailedView();
        }

        updateModelEdited = (event) => {
                this.state.detailedValues[event.target.name] = event.target.value;
                this.forceUpdate()
        }



    render() {
        const { classes } = this.props;

        return (
            <div>
                <TableContainer component={Paper}>
                    <Table style={{ minWidth: 1000 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {this.props.columns.map(col => (
                                    <TableCell align="center">
                                        <span id={col} style={{ fontWeight: "bold" }}>
                                            {col}
                                        </span>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.vals.map((row, index) => (
                                <TableRow id={index} hover={true}>
                                    {this.props.privilege === Privilege.ADMIN ? (
                                        <TableCell scope="row" align="center">
                                            <Button
                                                startIcon={<EditIcon />}
                                                onClick={() => this.showDetailedView(row)}
                                            />
                                            <Button
                                                startIcon={<DeleteIcon />}
                                                onClick={() => this.showDeleteModal(row)}
                                            />
                                        </TableCell>
                                    ) : null}
                                    {this.props.keys.map(key => {
                                        if (key === "Display Color") {
                                            return (
                                                <TableCell
                                                    scope="row"
                                                    align="center"
                                                    style={{
                                                        backgroundColor: row[key]
                                                    }}
                                                ></TableCell>
                                            );
                                        }

                                        if (key === "Network Ports") {
                                            return (
                                                <TableCell scope="row" align="center">
                                                    {row[key] === null ? "" : row[key].length}
                                                    {row[key] == null ? null : (
                                                        <Button style={{ margin: "5px" }}>
                                                            <ViewListIcon
                                                                onClick={e => {
                                                                    this.clickInfo(e, row[key]);
                                                                }}
                                                            />
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            );
                                        }

                                        if (key == "Comment") {
                                            return row["Comment"] !== null && row["Comment"].length > 0 ? (
                                                <TableCell scope="row" align="center">
                                                    <Button
                                                        startIcon={<CommentIcon />}
                                                        onClick={e => this.clickComment(e, row["Comment"])}
                                                    />
                                                </TableCell>
                                            ) : (
                                                <TableCell scope="row" align="center"></TableCell>
                                            );
                                        }

                                        return (
                                            <TableCell scope="row" align="center">
                                                {row[key]}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Popover
                    id={Boolean(this.state.popoverAnchor) ? "simple-popover" : undefined}
                    open={Boolean(this.state.popoverAnchor)}
                    anchorEl={this.state.popoverAnchor}
                    onClose={this.handlePopoverClose}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center"
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "center"
                    }}
                >
                    <List
                        className={classes.root}
                        subheader={
                            <ListSubheader component="div" id="nested-list-subheader">
                                Network Ports
                            </ListSubheader>
                        }
                    >
                        {this.state.networkPorts.map(value => {
                            const labelId = `checkbox-list-label-${value}`;

                            return (
                                <ListItem key={value} role={undefined} dense button>
                                    <ListItemText id={labelId} primary={value} />
                                </ListItem>
                            );
                        })}
                    </List>
                </Popover>
                <Popover
                    id={Boolean(this.state.commentPopover) ? "simple-popover" : undefined}
                    open={Boolean(this.state.commentPopover)}
                    anchorEl={this.state.commentPopover}
                    onClose={this.handleCommentPopoverClose}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center"
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "center"
                    }}
                >
                    <Typography
                        variant="body1"
                        style={{
                            padding: "30px"
                        }}
                    >
                        {this.state.comment}
                    </Typography>
                </Popover>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={this.state.showDetailedView}
                    onClose={this.closeDetailedView}
                    closeAfterTransition
                >
                    <Fade in={this.state.showDetailedView}>
                        <Backdrop open={this.state.showDetailedView}>
                            <div className={classes.grid}>
                                {this.state.detailViewLoading ? (
                                    <CircularProgress />
                                ) : (
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
                                                defaultValue={
                                                    this.state.detailedValues == null
                                                        ? ""
                                                        : this.state.detailedValues.vendor
                                                }
                                                includeInputInList
                                                freeSolo
                                                renderInput={params => (
                                                    <TextField
                                                        {...params}
                                                        label={inputs.vendor.label}
                                                        name={inputs.vendor.name}
                                                        onChange={this.updateModelEdited}
                                                        onBlur={this.updateModelEdited}
                                                        variant="outlined"
                                                        fullWidth
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4} lg={3}>
                                            <TextField
                                                id="standard-basic"
                                                variant="outlined"
                                                label={inputs.modelNumber.label}
                                                name={inputs.modelNumber.name}
                                                defaultValue={
                                                    this.state.detailedValues == null
                                                        ? ""
                                                        : this.state.detailedValues.model_number
                                                }
                                                onChange={this.updateModelEdited}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                type="number"
                                                id="standard-basic"
                                                variant="outlined"
                                                label={inputs.height.label}
                                                name={inputs.height.name}
                                                defaultValue={
                                                    this.state.detailedValues == null
                                                        ? ""
                                                        : this.state.detailedValues.height
                                                }
                                                onChange={this.updateModelEdited}
                                                InputProps={{ inputProps: { min: 1, max: 42 } }}
                                                style={{ width: "100%" }}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                type="number"
                                                id="standard-basic"
                                                variant="outlined"
                                                label={inputs.ethernetPorts.label}
                                                name={inputs.ethernetPorts.name}
                                                defaultValue={
                                                    this.state.detailedValues == null
                                                        ? ""
                                                        : this.state.detailedValues.ethernet_ports == null
                                                        ? ""
                                                        : this.state.detailedValues.ethernet_ports.length
                                                }
                                                onChange={this.updateNetworkPorts}
                                                InputProps={{ inputProps: { min: 0 } }}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                type="number"
                                                id="standard-basic"
                                                variant="outlined"
                                                label={inputs.powerPorts.label}
                                                name={inputs.powerPorts.name}
                                                defaultValue={
                                                    this.state.detailedValues == null
                                                        ? ""
                                                        : this.state.detailedValues.power_ports
                                                }
                                                onChange={this.updateModelEdited}
                                                InputProps={{ inputProps: { min: 0 } }}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                id="standard-basic"
                                                variant="outlined"
                                                label={inputs.cpu.label}
                                                name={inputs.cpu.name}
                                                defaultValue={
                                                    this.state.detailedValues == null
                                                        ? ""
                                                        : this.state.detailedValues.cpu
                                                }
                                                onChange={this.updateModelEdited}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                type="number"
                                                id="standard-basic"
                                                variant="outlined"
                                                label={inputs.memory.label}
                                                name={inputs.memory.name}
                                                defaultValue={
                                                    this.state.detailedValues == null
                                                        ? ""
                                                        : this.state.detailedValues.memory
                                                }
                                                onChange={this.updateModelEdited}
                                                InputProps={{ inputProps: { min: 0 } }}
                                                style={{ width: "100%" }}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                id="standard-basic"
                                                variant="outlined"
                                                label={inputs.storage.label}
                                                name={inputs.storage.name}
                                                defaultValue={
                                                    this.state.detailedValues == null
                                                        ? ""
                                                        : this.state.detailedValues.storage
                                                }
                                                onChange={this.updateModelEdited}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                id="standard-basic"
                                                variant="outlined"
                                                label={inputs.comment.label}
                                                name={inputs.comment.name}
                                                defaultValue={
                                                    this.state.detailedValues == null
                                                        ? ""
                                                        : this.state.detailedValues.comment
                                                }
                                                onChange={this.updateModelEdited}
                                            />
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
                                                {Array.from({ length: this.state.numPorts }, (x, i) => i).map(
                                                    (_, index) => {
                                                        const labelId = `list-label-${this.state.networkPorts[index]}`;

                                                        return (
                                                            <ListItem key={index} role={undefined} dense button>
                                                                <ListItemText
                                                                    id={labelId}
                                                                    primary={"Port " + (index + 1).toString()}
                                                                />
                                                                <TextField
                                                                    defaultValue={this.state.networkPorts[index]}
                                                                    onChange={e => this.updatePort(index, e)}
                                                                />
                                                            </ListItem>
                                                        );
                                                    }
                                                )}
                                                {this.state.numPorts === 0 ? (
                                                    <ListItem key="add-items" role={undefined} dense>
                                                        <ListItemText
                                                            id="add-items-label"
                                                            primary="Enter the number of network ports above"
                                                        />
                                                    </ListItem>
                                                ) : null}
                                            </List>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={this.save}
                                                style={{ width: "100%" }}
                                            >
                                                Save
                                            </Button>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={this.closeDetailedView}
                                                style={{ width: "100%" }}
                                            >
                                                Cancel
                                            </Button>
                                        </Grid>
                                    </Grid>
                                )}
                            </div>
                        </Backdrop>
                    </Fade>
                </Modal>

                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={this.state.showDeleteModal}
                    onClose={this.closeDeleteModal}
                    closeAfterTransition
                >
                    <Fade in={this.state.showDeleteModal}>
                        <Backdrop open={this.state.showDeleteModal}>
                            <div className={classes.grid}>
                                <Grid
                                    container
                                    spacing={1}
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="center"
                                >
                                    <Grid item xs={12}>
                                        <Typography variant="h5">Are you sure?</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} lg={6}>
                                        <Typography variant="body1">
                                            Doing this will remove the model permanently.
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={3}>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={this.delete}
                                            style={{ width: "100%" }}
                                        >
                                            Yes
                                        </Button>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={this.closeDeleteModal}
                                            style={{ width: "100%" }}
                                        >
                                            No
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

export default withStyles(useStyles)(ModelsTable);
