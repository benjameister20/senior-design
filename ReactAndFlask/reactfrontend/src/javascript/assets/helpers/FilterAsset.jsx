import React from 'react';

import axios from 'axios';

import Autocomplete from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { MenuItem, TextField } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

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
                this.props.updateItems(response.data.instances);
            });
    }

    render() {
        const { classes } = this.props;

        return (
            <React.Fragment>
                <Grid container spacing={3} className={classes.root}>
                    <Grid item xs={3}>
                        <FormControl>
                            {this.state.loadingDatacenters ? <CircularProgress /> :
                            <Autocomplete
                                id="select-datacenter"
                                options={this.state.datacenterList}
                                includeInputInList
                                renderInput={params => (
                                <TextField
                                    {...params}
                                    className={classes.searchbar}
                                    name={"select-datacenter"}
                                    placeholder="datacenter"
                                    fullWidth
                                />
                                )}
                            />}
                            <FormHelperText>Filter by Datacenter</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl>
                            {this.state.loadingModels ? <CircularProgress /> :
                            <Autocomplete
                                id="select-model"
                                options={this.state.modelList}
                                includeInputInList
                                renderInput={params => (
                                <TextField
                                    className={classes.searchbar}
                                    {...params}
                                    name={"select-model"}
                                    placeholder="model"
                                    fullWidth
                                />
                                )}
                            />}
                            <FormHelperText>Filter by model</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl>
                            {this.state.loadingHostnames ? <CircularProgress /> :
                            <Autocomplete
                                id="select-hostname"
                                options={this.state.hostnameList}
                                includeInputInList
                                renderInput={params => (
                                <TextField
                                    {...params}
                                    className={classes.searchbar}
                                    name={"select-hostname"}
                                    placeholder="hostname"
                                    fullWidth
                                />
                                )}
                            />}
                            <FormHelperText>Filter by hostname</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={1}>
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
                    <Grid item xs={1}>
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
                    <Grid item xs={1}>
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
                    <Grid item xs={1}>
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
                </Grid>
            </React.Fragment>
        );
    }
}

export default withStyles(useStyles)(FilterAsset);
