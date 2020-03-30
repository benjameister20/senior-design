import { FormControl, FormControlLabel, FormHelperText, Grid, MenuItem, Paper, Select, Switch, TextField, Typography } from '@material-ui/core/';
import React from 'react';
import * as Constants from '../../Constants';


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

    search = () => {
        var items = [];
        try {
            console.log(this.props.showDecommissioned);
            if (this.props.showDecommissioned) {
                this.props.decAssets.map(asset => {
                    var startDate = new Date(this.state.startDate === "" || parseInt(this.state.startDate) < 2000 ? "01/01/2001" : this.state.startDate + " 23:59:59");
                    var endDate = new Date(this.state.endDate === "" || parseInt(this.state.endDate) < 2000 ? "12/31/2025" : this.state.endDate + " 23:59:59");
                    var decDate = new Date(asset.timestamp);
                    if (
                        (asset.datacenter_name.includes(this.state.datacenter) || asset.abbreviation.includes(this.state.datacenter))
                        && (asset.vendor + asset.model_number).includes(this.state.model)
                        && asset.hostname.includes(this.state.hostname)
                        && asset.rack >= this.state.startingLetter + "" + this.state.startingNum
                        && asset.rack <= this.state.endingLetter + "" + this.state.endingNum
                        && asset.decommission_user.includes(this.state.user)
                        && decDate >= startDate
                        && decDate <= endDate
                    ) {
                        items.push(asset);
                    }
                });
            } else {
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
            }
            this.props.updateItems(items);
        } catch {
            this.props.updateItems([]);
        }

    }

    switchToDecommissioned = (event) => {
        console.log(event.target.checked);
        //this.setState({ showDecommissioned: event.target.checked }, () => this.search());
        this.props.switchToDec(event.target.checked);
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
                        style={{ "padding": "10px" }}
                    >
                        <Grid item xs={12}>
                            <Typography variant="h5">Filter</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                            <TextField
                                id="datacenter"
                                label="Datacenter"
                                name="datacenter"
                                onChange={(event) => { this.updateDatacenter(event) }}
                                style={{ width: "100%" }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                            <TextField
                                id="model"
                                label="Model"
                                name="model"
                                onChange={(event) => { this.updateModel(event) }}
                                style={{ width: "100%" }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                            <TextField
                                id="hostname"
                                label="Hostname"
                                name="hostname"
                                onChange={(event) => this.updateHostname(event)}
                                style={{ width: "100%" }}
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
                                    InputProps={{ inputProps: { min: 1 } }}
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
                                    InputProps={{ inputProps: { min: 1 } }}
                                />
                                <FormHelperText>Ending Number</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={2} sm={6} md={4} lg={3}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={this.props.showDecommissioned}
                                        onChange={event => { this.switchToDecommissioned(event) }}
                                        value="checkedB"
                                        color="primary"
                                    />
                                }
                                labelPlacement="top"
                                label={this.props.showDecommissioned ? "Decommissioned Assets" : "Active Assets"}
                            />
                        </Grid>
                        {this.props.showDecommissioned ? <Grid item xs={12} sm={6} md={4} lg={3}>
                            <TextField
                                id="user"
                                label="User"
                                name="user"
                                onChange={(event) => { this.updateUser(event) }}
                                style={{ width: "100%" }}
                            />
                        </Grid> : null}
                        {this.props.showDecommissioned ? <Grid item xs={12} sm={6} md={4} lg={3}>
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
                        {this.props.showDecommissioned ? <Grid item xs={12} sm={6} md={4} lg={3}>
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
