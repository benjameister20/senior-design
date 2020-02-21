import React from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

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
                    <Grid item xs={3}>
                        <TextField id="vendor-filter" variant="outlined" label="Vendor" name="vendor" onChange={this.updateSearchText.bind(this)}/>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField id="model_number-filter" variant="outlined" label="Model Number" name="model_number-filter" onChange={this.updateSearchText.bind(this)}/>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField id="height-filter" variant="outlined" label="Height" name="height" onChange={this.updateSearchText.bind(this)}/>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField id="ethernet_ports-filter" variant="outlined" label="Network Ports" name="ethernet_ports" onChange={this.updateSearchText.bind(this)}/>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField id="power_ports-filter" variant="outlined" label="Power Ports" name="power_ports" onChange={this.updateSearchText.bind(this)}/>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField id="cpu-filter" variant="outlined" label="CPU" name="cpu" onChange={this.updateSearchText.bind(this)}/>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField id="memory-filter" variant="outlined" label="Memory" name="memory" onChange={this.updateSearchText.bind(this)}/>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField id="storage-filter" variant="outlined" label="Storage" name="storage" onChange={this.updateSearchText.bind(this)}/>
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
