import React from 'react';

import axios from 'axios';

import {
    Grid,
    FormHelperText,
    FormControl,
    Select,
    MenuItem,
    TextField,
    Paper,
    Typography,
    Button,
} from '@material-ui/core/';


import * as Constants from '../../Constants';

class FilterAsset extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            allAssets:[],
            datacenter:"",
            model:"",
            hostname:"",
            startingLetter:"A",
            endingLetter:"Z",
            startingNum:1,
            endingNum:1000,
        };
    }

    componentDidMount() {
        this.search();
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

    componentDidUpdate() {

    }

    search = () => {
         var items = [];
         try {
            this.props.allAssets.map(asset => {
                if (
                    (asset.datacenter_name.includes(this.state.datacenter) || asset.abbreviation.includes(this.state.datacenter))
                    && asset.model.includes(this.state.model)
                    && asset.hostname.includes(this.state.hostname)
                    && asset.rack >= this.state.startingLetter + "" + this.state.startingNum
                    && asset.rack <= this.state.endingLetter + "" + this.state.endingNum
                ) {
                    items.push(asset);
                }
            });
            this.props.updateItems(items);
        } catch {
            this.props.updateItems([]);
        }

    }

    render() {
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
                        <Typography variant="h5">Filter</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <TextField
                            id="datacenter"
                            label="Datacenter"
                            name="datacenter"
                            onChange={(event) => { this.updateDatacenter(event) } }
                            style={{width: "100%"}}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <TextField
                            id="model"
                            label="Model"
                            name="model"
                            onChange={(event) => { this.updateModel(event)} }
                            style={{width: "100%"}}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <TextField
                            id="hostname"
                            label="Hostname"
                            name="hostname"
                            onChange={(event) => this.updateHostname(event)}
                            style={{width: "100%"}}
                        />
                    </Grid>
                    <Grid item item xs={12} sm={6} md={4} lg={3}></Grid>
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
                    </Grid>
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
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <FormControl>
                            <TextField
                                id="starting-num-selector"
                                type="number"
                                value={this.state.startingNum}
                                onChange={this.updateStartingNum}
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
                                value={this.state.endingNum}
                                onChange={this.updateEndingNum}
                                InputProps={{ inputProps: { min: 1} }}
                            />
                            <FormHelperText>Ending Number</FormHelperText>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>
            </React.Fragment>
        );
    }
}

export default FilterAsset;
