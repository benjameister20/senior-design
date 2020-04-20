import axios from 'axios';

import {
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    MenuItem,
    Paper,
    Select,
    Switch,
    TextField,
    Typography,
    InputLabel,
} from '@material-ui/core/';
import React from 'react';
import * as Constants from '../../Constants';
import getURL from '../../helpers/functions/GetURL';


class FilterAsset extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            datacenter: "",
            model: "",
            hostname: "",
            startingLetter: "A",
            endingLetter: "Z",
            startingNum: 1,
            endingNum: 1000,
            startDate: "",
            endDate: "",
            user: "",
            datacenterList:[],
        };
    }

    componentDidMount() {
        this.search();
        this.getDatacenterList();
    }

    getDatacenterList = () => {
        axios.get(
            getURL(Constants.DATACENTERS_MAIN_PATH, "all/")).then(
            response => { this.setState({ datacenterList: response.data.datacenters }) });
    }

    updateDatacenter = (event) => {
        this.setState({ datacenter: event.target.value }, () => { this.search() });
    }

    updateModel = (event) => {
        this.setState({ model: event.target.value }, () => { this.search() });
    }

    updateHostname = (event) => {
        this.setState({ hostname: event.target.value }, () => { this.search() });
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

    updateStartDate = (event) => {
        console.log(event.target);
        this.setState({ startDate: event.target.value }, () => this.search());
    }

    updateEndDate = (event) => {
        this.setState({ endDate: event.target.value }, () => this.search());
    }

    updateUser = (event) => {
        this.setState({ user: event.target.value }, () => this.search());
    }

    clearFilters = () => {
        this.setState({
            datacenter: "",
            model: "",
            hostname: "",
            startingLetter: "A",
            endingLetter: "Z",
            startingNum: 1,
            endingNum: 1000,
            startDate: "",
            endDate: "",
            user: "",
        })
    }

    search = () => {
        var items = [];
        try {
            console.log(this.state.endingNum);
            if (this.props.assetType === "decommissioned") {
                this.props.decAssets.map(asset => {
                    var startDate = new Date(this.state.startDate === "" || parseInt(this.state.startDate) < 2000 ? "01/01/2001" : this.state.startDate + " 00:00:00");
                    var endDate = new Date(this.state.endDate === "" || parseInt(this.state.endDate) < 2000 ? "12/31/2025" : this.state.endDate + " 23:59:59");
                    var decDate = new Date(asset.timestamp);
                    if (
                        (asset.datacenter_name.toLowerCase().includes(this.state.datacenter.toLowerCase()) || asset.abbreviation.toLowerCase().includes(this.state.datacenter.toLowerCase()))
                        && (asset.vendor + asset.model_number).toLowerCase().includes(this.state.model.toLowerCase())
                        && asset.hostname.toLowerCase().includes(this.state.hostname.toLowerCase())
                        && asset.rack >= this.state.startingLetter + "" + this.state.startingNum
                        && asset.rack <= this.state.endingLetter + "" + this.state.endingNum
                        && asset.decommission_user.toLowerCase().includes(this.state.user.toLowerCase())
                        && decDate >= startDate
                        && decDate <= endDate
                    ) {

                        items.push(asset);
                    }
                });
            } else if (this.props.assetType == "active") {
                this.props.allAssets.map(asset => {
                    if (
                        (asset.datacenter_name.toLowerCase().includes(this.state.datacenter.toLowerCase()) || asset.abbreviation.toLowerCase().includes(this.state.datacenter.toLowerCase()))
                        && asset.model.toLowerCase().includes(this.state.model.toLowerCase())
                        && asset.hostname.toLowerCase().includes(this.state.hostname.toLowerCase())
                        && asset.rack >= this.state.startingLetter + "" + this.state.startingNum
                        && asset.rack <= this.state.endingLetter + "" + this.state.endingNum
                    ) {
                        var offline = false;
                        this.state.datacenterList.map(dc => {
                            if (dc.is_offline_storage && asset.datacenter_name === dc.datacenter_name) {
                                offline = true;
                            }
                        });
                        if (!offline) {
                            items.push(asset);
                        }

                    }
                });
            } else if (this.props.assetType === "offline") {
                this.props.allAssets.map(asset => {
                    if (
                        (asset.datacenter_name.toLowerCase().includes(this.state.datacenter.toLowerCase()) || asset.abbreviation.toLowerCase().includes(this.state.datacenter.toLowerCase()))
                        && asset.model.toLowerCase().includes(this.state.model.toLowerCase())
                        && asset.hostname.toLowerCase().includes(this.state.hostname.toLowerCase())
                    ) {
                        var offline = false;
                        this.state.datacenterList.map(dc => {
                            if (dc.is_offline_storage && asset.datacenter_name === dc.datacenter_name) {
                                offline = true;
                            }
                        });
                        if (offline) {
                            items.push(asset);
                        }

                    }
                });
            }

            this.props.updateItems(items);
        } catch {
            this.props.updateItems([]);
        }

    }

    switchAssetType = (event) => {
        console.log(event.target.value);
        this.props.switchAssetType(event.target.value);
    }

    render() {
        return (
            <React.Fragment>
                <Paper elevation={3} style={{ minHeight: this.props.height }}>
                    <Grid
                        container
                        spacing={2}
                        direction="row"
                        justify="flex-start"
                        alignItems="center"
                        style={{ "padding": "10px" }}
                    >
                        <Grid item xs={12}>
                            <Typography variant="h5">Filter</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                            <TextField
                                id="site"
                                label="Site"
                                name="site"
                                value={this.state.datacenter}
                                onChange={(event) => { this.updateDatacenter(event) }}
                                style={{ width: "100%" }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                            <TextField
                                id="model"
                                label="Model"
                                name="model"
                                value={this.state.model}
                                onChange={(event) => { this.updateModel(event) }}
                                style={{ width: "100%" }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                            <TextField
                                id="hostname"
                                label="Hostname"
                                name="hostname"
                                value={this.state.hostname}
                                onChange={(event) => this.updateHostname(event)}
                                style={{ width: "100%" }}
                            />
                        </Grid>
                        <Grid item item xs={12} sm={6} md={4} lg={3}></Grid>
                        {this.props.assetType === "offline" ? null :
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                            <FormControl>
                                <Select
                                    id="starting-letter-selector"
                                    value={this.state.startingLetter}
                                    onChange={this.updateStartingLetter}
                                >
                                    {Constants.RackX.map(val => (<MenuItem value={val}>{val}</MenuItem>))}
                                </Select>
                                <FormHelperText>Starting Letter</FormHelperText>
                            </FormControl>
                        </Grid>}
                        {this.props.assetType === "offline" ? null :
                        <Grid item xs={12} sm={6} md={4} lg={2}>
                            <FormControl>
                                <Select
                                    id="ending-letter-selector"
                                    value={this.state.endingLetter}
                                    onChange={this.updateEndingLetter}
                                >
                                    {Constants.RackX.map(val => (<MenuItem value={val}>{val}</MenuItem>))}
                                </Select>
                                <FormHelperText>Ending Letter</FormHelperText>
                            </FormControl>
                        </Grid>}
                        {this.props.assetType === "offline" ? null :
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                            <FormControl>
                                <TextField
                                    id="starting-num-selector"
                                    type="number"
                                    value={this.state.startingNum}
                                    onChange={this.updateStartingNum}
                                    InputProps={{ inputProps: { min: 1 } }}
                                />
                                <FormHelperText>Starting Number</FormHelperText>
                            </FormControl>
                        </Grid>}
                        {this.props.assetType === "offline" ? null :
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                            <FormControl>
                                <TextField
                                    id="ending-num-selector"
                                    type="number"
                                    value={this.state.endingNum}
                                    onChange={this.updateEndingNum}
                                    InputProps={{ inputProps: { min: 1 } }}
                                />
                                <FormHelperText>Ending Number</FormHelperText>
                            </FormControl>
                        </Grid>}
                        <Grid item xs={2} sm={6} md={4} lg={3}>
                            <InputLabel id="datacenter-select-label">Asset Type</InputLabel>
                            <Select
                                name='asset-type'
                                id="asset-type"
                                value={this.props.assetType}
                                onChange={event => this.switchAssetType(event)}
                                style={{ width: "100%" }}
                            >
                                <MenuItem value={"active"}>Active</MenuItem>
                                <MenuItem value={"decommissioned"}>Decommissioned</MenuItem>
                                <MenuItem value={"offline"}>Offline Storage</MenuItem>
                            </Select>
                        </Grid>
                        {this.props.assetType === "decommissioned" ? <Grid item xs={12} sm={6} md={4} lg={3}>
                            <TextField
                                id="user"
                                label="User"
                                name="user"
                                onChange={(event) => { this.updateUser(event) }}
                                style={{ width: "100%" }}
                            />
                        </Grid> : null}
                        {this.props.assetType === "decommissioned" ? <Grid item xs={12} sm={6} md={4} lg={3}>
                            <TextField
                                id="start-date"
                                label="Start Date"
                                type="date"
                                onChange={event => this.updateStartDate(event)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid> : null}
                        {this.props.assetType === "decommissioned" ? <Grid item xs={12} sm={6} md={4} lg={3}>
                            <TextField
                                id="end-date"
                                label="End Date"
                                type="date"
                                onChange={event => this.updateEndDate(event)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid> : null}
                    </Grid>
                </Paper>
            </React.Fragment>
        );
    }
}

export default FilterAsset;
