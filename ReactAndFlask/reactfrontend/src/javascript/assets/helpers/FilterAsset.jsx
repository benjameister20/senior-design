import React from 'react';

import axios from 'axios';

import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import createAssetJSON from "./functions/createAssetJSON";
import { AssetInput } from '../enums/AssetInputs.ts';
import { AssetCommand } from '../enums/AssetCommands.ts'
import getURL from '../../helpers/functions/GetURL';
import Asset from "../Asset.ts";
import * as AssetConstants from "../AssetConstants";

export default class FilterAsset extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            model:"",
            hostname:"",
            rack:"",
            rackU:-1,
            owner:"",
            comment:"",
            datacenter_id:"",
            tags:[],
            network_connections:"",
            power_connections:"",
            asset_number:-1,
        };
    }

    updateModel = (event, newValue) => {
        this.setState({ model: newValue });
    }

    updateHostname = (event, newValue) => {
        this.setState({ hostname: newValue})
    }

    updateRack = (event, newValue) => {
        this.setState({ rack: newValue });
    }

    updateRackU = (event, newValue) => {
        this.setState({ rackU: newValue });
    }

    updateOwner = (event, newValue) => {
        this.setState({ owner: newValue });
    }

    updateComment = (event, newValue) => {
        this.setState({ comment: newValue });
    }

    updateDatacenter = (event, newValue) => {
        this.setState({ datacenter_id: newValue });
    }

    updateTags = (event, newValue) => {
        this.setState({ tags: newValue });
    }

    updateNetworkConnections = (event, newValue) => {
        this.setState({ network_connections: newValue });
    }

    updatePowerConnections = (event, newValue) => {
        this.setState({ power_connections: newValue });
    }

    updateAssetNumber = (event, newValue) => {
        this.setState({ asset_number: newValue });
    }

    search = () => {
        axios.post(
            getURL(AssetConstants.ASSETS_MAIN_PATH, AssetCommand.search),{ 'filter':createAssetJSON() }
            ).then(response => {
                this.props.updateSearchItems(response.data.assets);
            });
    }

    render() {
        return (
            <Grid container spacing={3}>
                <Grid item xs={2}>
                    <SearchIcon />
                    <InputBase
                        placeholder={"Filter model"}
                        inputProps={{ 'aria-label': 'search' }}
                        onChange={this.updateModel}
                    />
                </Grid>
                <Grid item xs={2}>
                    <SearchIcon />
                    <InputBase
                        placeholder={"Filter model"}
                        inputProps={{ 'aria-label': 'search' }}
                        onChange={this.updateModel}
                    />
                </Grid>
                <Grid item xs={2}>
                    <SearchIcon />
                    <InputBase
                        placeholder={"Filter model"}
                        inputProps={{ 'aria-label': 'search' }}
                        onChange={this.updateModel}
                    />
                </Grid>
                <Grid item xs={2}>
                    <SearchIcon />
                    <InputBase
                        placeholder={"Filter model"}
                        inputProps={{ 'aria-label': 'search' }}
                        onChange={this.updateModel}
                    />
                </Grid>
                <Grid item xs={2}>
                    <SearchIcon />
                    <InputBase
                        placeholder={"Filter model"}
                        inputProps={{ 'aria-label': 'search' }}
                        onChange={this.updateModel}
                    />
                </Grid>
                <Grid item xs={2}>
                    <SearchIcon />
                    <InputBase
                        placeholder={"Filter model"}
                        inputProps={{ 'aria-label': 'search' }}
                        onChange={this.updateModel}
                    />
                </Grid>
                <Grid item xs={2}>
                    <SearchIcon />
                    <InputBase
                        placeholder={"Filter model"}
                        inputProps={{ 'aria-label': 'search' }}
                        onChange={this.updateModel}
                    />
                </Grid>
                <Grid item xs={2}>
                    <SearchIcon />
                    <InputBase
                        placeholder={"Filter model"}
                        inputProps={{ 'aria-label': 'search' }}
                        onChange={this.updateModel}
                    />
                </Grid>
                <Grid item xs={2}>
                    <SearchIcon />
                    <InputBase
                        placeholder={"Filter model"}
                        inputProps={{ 'aria-label': 'search' }}
                        onChange={this.updateModel}
                    />
                </Grid>
                <Grid item xs={2}>
                    <SearchIcon />
                    <InputBase
                        placeholder={"Filter model"}
                        inputProps={{ 'aria-label': 'search' }}
                        onChange={this.updateModel}
                    />
                </Grid>
                <Grid item xs={2}>
                    <SearchIcon />
                    <InputBase
                        placeholder={"Filter model"}
                        inputProps={{ 'aria-label': 'search' }}
                        onChange={this.updateModel}
                    />
                </Grid>
                <Grid item xs={2}>
                    <SearchIcon />
                    <InputBase
                        placeholder={"Filter model"}
                        inputProps={{ 'aria-label': 'search' }}
                        onChange={this.updateModel}
                    />
                </Grid>
                <Grid item xs={2}>
                    <SearchIcon />
                    <InputBase
                        placeholder={"Filter model"}
                        inputProps={{ 'aria-label': 'search' }}
                        onChange={this.updateModel}
                    />
                </Grid>
                <Grid item xs={12}>
                    Click the search button to populate table. Searching with empty filters searches over all values. Click on row values to see detailed view.
                </Grid>
            </Grid>
        );
    }
}
