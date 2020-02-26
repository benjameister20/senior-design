import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import TextField from "@material-ui/core/TextField";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';

export default class Filters extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            filters:{},
            privilege: "",
        };
    }

    updateSearchText(event) {
        console.log(event.target.id);
        if (this.state.filters.hasOwnProperty(event.target.id)) {
            this.state.filters[event.target.id] = event.target.value;
            this.forceUpdate();
        } else {
            this.state.filters[event.target.id] = event.target.value;
            this.forceUpdate();
        }
    }

    search() {
        console.log(this.state.filters);
        this.props.search(this.state.filters);
    }

    updateSelect = (event) => {
        this.state.filters["privilege"] = event.target.value;
        this.forceUpdate();
        this.setState({ privilege: event.target.value });
    }

    render() {
        return (
            <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <Typography>Search</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Grid
                            container
                            spacing={1}
                            direction="row"
                            justify="flex-start"
                            alignItems="center"
                        >
                            <Grid item xs={6}>
                                <TextField
                                    id={"username"}
                                    inputProps={{ 'aria-label': 'search' }}
                                    variant="outlined"
                                    label="Username"
                                    placeholder={"Username"}
                                    name="username"
                                    onChange={this.updateSearchText.bind(this)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField id="display_name" variant="outlined" label="Display Name" name="display_name" onChange={this.updateSearchText.bind(this)}/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="email"
                                    variant="outlined"
                                    label="Email"
                                    name="email"
                                    onChange={this.updateSearchText.bind(this)}
                                    style={{"width": "100%"}}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl
                                    style={{"minWidth": "200px"}}
                                >
                                    <InputLabel id="privilege-select">Privilege</InputLabel>
                                    <Select
                                        id="privilege"
                                        onChange={this.updateSelect}>
                                        <MenuItem value="">Any</MenuItem>
                                        <MenuItem value="admin">Administrator</MenuItem>
                                        <MenuItem value="user">User</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid
                                container
                                item
                                direction="column"
                                justify="center"
                                alignItems="center"
                                xs={12}
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={this.search.bind(this)}
                                    style={{"width": "100%", "marginTop": "20px"}}
                                >
                                    Search
                                </Button>
                            </Grid>
                        </Grid>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
        );
    }
}
