import React from 'react';

import axios from 'axios';

import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Grid from '@material-ui/core/Grid';
import { fade, withStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { MenuItem, Button, TextField } from '@material-ui/core';

import createAssetJSON from "./functions/createAssetJSON";
import { AssetCommand } from '../enums/AssetCommands.ts'
import getURL from '../../helpers/functions/GetURL';
import * as AssetConstants from "../AssetConstants";
import * as Constants from '../../Constants';

const useStyles = theme => ({
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
    },
    searchIcon: {
      width: theme.spacing(7),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'left',
      justifyContent: 'left',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 7),
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: 200,
      },
    },
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
    },
    sectionMobile: {
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
  });

class FilterAsset extends React.Component {
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

            startingRackNumber:1,
            endingRackNumber:1,
        };
    }

    componentDidMount() {
        this.search();
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
        const { classes } = this.props;

        return (
            <React.Fragment>
                <Grid container spacing={3}>
                    <Grid item xs={3}>
                        <FormControl>
                            <div>
                                <TextField
                                    placeholder="Search…"
                                    classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput,
                                    }}
                                    inputProps={{ 'aria-label': 'search' }}
                                />
                            </div>
                            <FormHelperText>Filter by Datacenter</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl>
                            <div>
                                <TextField
                                    placeholder="Search…"
                                    classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput,
                                    }}
                                    inputProps={{ 'aria-label': 'search' }}
                                />
                            </div>
                            <FormHelperText>Filter by model</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl>
                            <div>
                                <TextField
                                    placeholder="Search…"
                                    classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput,
                                    }}
                                    inputProps={{ 'aria-label': 'search' }}
                                />
                            </div>
                            <FormHelperText>Filter by hostname</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={1}>
                        <FormControl>
                                <Select
                                    id="starting-letter-selector"
                                    value={this.state.startingRackLetter}
                                    onChange={this.changeStartingLetter}
                                    defaultValue={Constants.RackX[0]}
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
                                    defaultValue={Constants.RackX[0]}
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
