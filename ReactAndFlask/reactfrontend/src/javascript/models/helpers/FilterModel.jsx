import React from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

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
    "comments": createInputs('comments', "Comments"),
}

export default class FilterModel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            filters: {},
        };
    }

    updateSearchText(event) {
        if (this.state.filters.hasOwnProperty(event.target.id)) {
            const newFilters = this.state.filters;
            newFilters[event.target.id] = event.target.value;
            this.setState({ filters: newFilters });
            this.forceUpdate();
        } else {
            const newFilters = this.state.filters;
            newFilters[event.target.id] = event.target.value;
            this.setState({ filters: newFilters });
            this.forceUpdate();
        }
    }

    search() {
        this.props.search(this.state.filters);
    }

    render() {
        return (
            <div>
                <Paper elevation={3} style={{ minHeight: this.props.height }}>
                <Grid
                    container
                    spacing={2}
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                    style={{ padding: "10px" }}
                >
                    <Grid item xs={12}>
                        <Typography variant="h5">Search</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Autocomplete
                            id="vendor"
                            options={this.props.options}
                            includeInputInList
                            freeSolo
                            renderInput={params => (
                            <TextField {...params} label={inputs.vendor.label} name={inputs.vendor.name} onChange={this.updateSearchText.bind(this)} onBlur={this.updateSearchText.bind(this)} variant="outlined" fullWidth />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <TextField id="model_number" variant="outlined" label="Model Number" name="model_number" onChange={this.updateSearchText.bind(this)} style={{width: "100%"}} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <TextField id="min_height" type="number" variant="outlined" label="Min Height" name="min_height" onChange={this.updateSearchText.bind(this)} style={{width: "100%"}} InputProps={{ inputProps: { min: 1, max: 42} }}/>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <TextField id="max_height" type="number" variant="outlined" label="Max Height" name="max_height" onChange={this.updateSearchText.bind(this)} style={{width: "100%"}} InputProps={{ inputProps: { min: 1, max: 42} }}/>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <TextField id="min_ethernet_ports" type="number" variant="outlined" label="Min Network Ports" name="min_ethernet_ports" onChange={this.updateSearchText.bind(this)} style={{width: "100%"}} InputProps={{ inputProps: { min: 0} }}/>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <TextField id="max_ethernet_ports" type="number" variant="outlined" label="Max Network Ports" name="max_ethernet_ports" onChange={this.updateSearchText.bind(this)} style={{width: "100%"}} InputProps={{ inputProps: { min: 0} }}/>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <TextField id="min_power_ports" type="number" variant="outlined" label="Min Power Ports" name="min_power_ports" onChange={this.updateSearchText.bind(this)} style={{width: "100%"}} InputProps={{ inputProps: { min: 0} }}/>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <TextField id="max_power_ports" type="number" variant="outlined" label="Max Power Ports" name="max_power_ports" onChange={this.updateSearchText.bind(this)} style={{width: "100%"}} InputProps={{ inputProps: { min: 0} }}/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <TextField id="cpu" variant="outlined" label="CPU" name="cpu" onChange={this.updateSearchText.bind(this)} style={{width: "100%"}}/>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <TextField id="min_memory" type="number" variant="outlined" label="Min Memory" name="min_memory" onChange={this.updateSearchText.bind(this)} style={{width: "100%"}} InputProps={{ inputProps: { min: 0} }}/>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <TextField id="max_memory" type="number" variant="outlined" label="Max Memory" name="max_memory" onChange={this.updateSearchText.bind(this)} style={{width: "100%"}} InputProps={{ inputProps: { min: 0} }}/>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <TextField id="storage" variant="outlined" label="Storage" name="storage" onChange={this.updateSearchText.bind(this)} style={{width: "100%"}}/>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <TextField id="comment" variant="outlined" label="Comment" name="comment" onChange={this.updateSearchText.bind(this)} style={{width: "100%"}}/>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            onClick={this.search.bind(this)}
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
            </div>
        );
    }
}
