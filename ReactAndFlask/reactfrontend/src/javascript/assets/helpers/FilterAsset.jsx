import React from 'react';

import axios from 'axios';

import {
    Autocomplete
} from '@material-ui/lab/';
import {
    Grid,
    withStyles,
    FormHelperText,
    FormControl,
    Select,
    MenuItem,
    TextField,
    CircularProgress,
    Paper,
    Typography,
    Button,
} from '@material-ui/core/';

import { AssetCommand } from '../enums/AssetCommands.ts'
import getURL from '../../helpers/functions/GetURL';
import * as AssetConstants from "../AssetConstants";
import * as Constants from '../../Constants';

const emptySearch = {
    "filter": {
            "vendor":null,
            "model_number":null,
            "height":null,
            "model":null,
            "hostname":null,
            "rack":null,
            "rack_position":null,
            "username":null,
            "display_name":null,
            "email":null,
            "privilege":null,
            "model":null,
            "hostname":null,
            "starting_rack_letter":null,
            "ending_rack_letter":null,
            "starting_rack_number":null,
            "ending_rack_number":null,
            "rack":null,
            "rack_position":null
        },
    "datacenter_name":"",
}

const searchPath = "search/";

const useStyles = theme => ({
    root: {
      flexGrow: 1,
    },
    searchbar: {
        minWidth: "200px",
        flexGrow: 1,
    }
}
);

class FilterAsset extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            model:"",
            hostname:"",
            datacenter_id:"",
            startingLetter:"",
            endingLetter:"",
            startingNum:null,
            endingNum:null,

            loadingModels:true,
            loadingHostnames:true,
            loadingDatacenters:true,

            modelList:[],
            datacenterList:[],
            hostnamesList:[],
        };
    }

    componentDidMount() {
        this.search();
        this.getModelList();
        this.getDatacenterList();
        this.getAssetList();
    }

    getModelList = () => {
        axios.post(
            getURL(Constants.MODELS_MAIN_PATH, searchPath), emptySearch).then(
            response => {
                var models = response.data.models;
                var modelNames = [];
                models.map(model => {
                    var modelKey = model.vendor + " " + model.model_number;
                    modelNames.push(modelKey);
                });
                this.setState({ loadingModels: false, modelList: modelNames });
            });
    }

    getDatacenterList = () => {
        axios.get(
            getURL(Constants.DATACENTERS_MAIN_PATH, "all/")).then(
            response => {
                var datacenters = [];
                response.data.datacenters.map(datacenter => datacenters.push(datacenter.name));
                this.setState({ loadingDatacenters: false, datacenterList: datacenters })
            });
    }

    getAssetList = () => {
        axios.post(
            getURL(Constants.ASSETS_MAIN_PATH, searchPath),emptySearch).then(
            response => {
                var instances = response.data.instances;
                var hostnames = [];
                instances.map(instance => {
                    hostnames.push(instance.asset_number);
                })
                this.setState({ loadingHostnames: false, hostnamesList: hostnames });
            });
    }

    updateModel = (event) => {
        this.setState({ model: event.target.value }, () => { this.search() });
    }

    updateHostname = (event) => {
        this.setState({ hostname: event.target.value }, () => { this.search() });
    }

    updateDatacenter = (event) => {
        this.setState({ datacenter_id: event.target.value }, () => { this.search() });
    }

    updateStartingLetter = (event) => {
        this.setState({ startingLetter: event.target.value }, () => { this.search() });
    }

    updateEndingLetter = (event) => {
        this.setState({ endingLetter: event.target.value }, () => { this.search() });
    }

    updateStartingNum = (event) => {
        this.setState({ startingNum: event.target.value }, () => { this.search() });
    }

    updateEndingNum = (event) => {
        this.setState({ endingNum: event.target.value }, () => { this.search() });
    }

    getSearchJSON = () => {
        return {
            "datacenter_name":this.state.datacenter_id,
            "filters": {
                "model":this.state.model,
                "hostname":this.state.hostname,
                "starting_rack_letter":this.state.startingLetter,
                "ending_rack_letter":this.state.endingLetter,
                "starting_rack_number":this.state.startingNum,
                "ending_rack_number":this.state.endingNum
            }
        }
    }

    search = () => {
        axios.post(
            getURL(AssetConstants.ASSETS_MAIN_PATH, AssetCommand.search), emptySearch
            ).then(response => {
                //this.props.updateItems(response.data.instances);
            });
    }

    render() {
        const { classes } = this.props;

        return (
            <React.Fragment>
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
                        <Typography variant="h5">Search</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <TextField
                            id="datacenter"
                            variant="outlined"
                            label="Datacenter"
                            name="datacenter"
                            onChange={() => { this.updateDatacenter() } }
                            style={{width: "100%"}}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <TextField
                            id="model"
                            variant="outlined"
                            label="Model"
                            name="model"
                            onChange={() => { this.updateModel()} }
                            style={{width: "100%"}}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <TextField
                            id="hostname"
                            variant="outlined"
                            label="Hostname"
                            name="hostname"
                            onChange={() => this.updateHostname()}
                            style={{width: "100%"}}
                        />
                    </Grid>
                    <Grid item item xs={12} sm={6} md={4} lg={3}></Grid>
                    <Grid item xs={12} sm={6} md={4} lg={2}>
                        <FormControl>
                            <Select
                                id="starting-letter-selector"
                                value={this.state.startingRackLetter}
                                onChange={this.changeStartingLetter}
                            >
                                {Constants.RackX.map(val => (<MenuItem value={val}>{val}</MenuItem>))}
                            </Select>
                            <FormHelperText>Starting Letter</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={2}>
                        <FormControl>
                            <Select
                                id="ending-letter-selector"
                                value={this.state.endingRackLetter}
                                onChange={this.changeEndingLetter}
                            >
                                {Constants.RackX.map(val => (<MenuItem value={val}>{val}</MenuItem>))}
                            </Select>
                            <FormHelperText>Ending Letter</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <FormControl>
                            <TextField
                                id="starting-num-selector"
                                type="number"
                                value={this.state.startingRackNumber}
                                onChange={this.changeStartingNum}
                                InputProps={{ inputProps: { min: 1} }}
                            />
                            <FormHelperText>Starting Number</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <FormControl>
                            <TextField
                                id="ending-num-selector"
                                type="number"
                                value={this.state.endingRackNumber}
                                onChange={this.changeEndingNum}
                                InputProps={{ inputProps: { min: 1} }}
                            />
                            <FormHelperText>Ending Number</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            onClick={() => this.search()}
                            variant="contained"
                            color="primary"
                            style={{
                                width: "100%"
                            }}
                        >
                            Search
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
            </React.Fragment>
        );
    }
}

export default withStyles(useStyles)(FilterAsset);
