import React from 'react';

import axios from "axios";

import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Card from '@material-ui/core/Card';

import '../../../stylesheets/Models.css';
import PrivilegePicker from "./functions/PrivilegePicker";

import getURL from "../../helpers/functions/GetURL";

export default class Filters extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            display_name: "",
            password: "",
            email: "",
            privilege:{
                "model":false,
                "asset":false,
                "datacenters":[],
                "power":false,
                "audit":false,
                "admin":false,
            },
        };
    }

    resetCreate = (success) => {
        if (success) {
            this.setState({username: "", display_name: "", password: "", email: "", privilege:{
                "model":false,
                "asset":false,
                "datacenters":[],
                "power":false,
                "audit":false,
                "admin":false,
            },});
        }
    }

    searchUsers = () => {
        this.props.search( { "filter":this.state } );
    }

    updateprivilege = (event, values) => {
        var privs = {
            "model":false,
            "asset":false,
            "datacenters":this.state.privilege["datacenters"],
            "power":false,
            "audit":false,
            "admin":false,
        };
        values.map(priv => { privs[priv.value] = true; });
        this.setState({ privilege: privs });
    }

    updateDCPrivilege = (event, values) => {
        var privs = this.state.privilege;
        privs["datacenters"] = values;
        this.setState({ privilege: privs });
    }

    render() {
        return (
        <Card elevation={3} padding>
            <Typography variant="h6">Search</Typography>
            <Grid
                container
                spacing={1}
                direction="row"
                justify="flex-start"
                alignItems="center"
            >
                <Grid item xs={6}>
                    <TextField id="standard-basic" variant="outlined" label="Username" name="username" value={this.state.username} onChange={(e) => this.setState({ username: e.target.value })}/>
                </Grid>
                <Grid item xs={6}>
                    <TextField id="standard-basic" variant="outlined" label="Display Name" name="display_name" value={this.state.display_name} onChange={(e) => this.setState({ display_name: e.target.value })}/>
                </Grid>
                <Grid item xs={6}>
                    <TextField id="standard-basic" variant="outlined" label="Password" name="password" type="password" value={this.state.password} onChange={(e) => this.setState({ password: e.target.value })}/>
                </Grid>
                <Grid item xs={6}>
                    <TextField id="standard-basic" variant="outlined" label="Email" name="email" type="email" value={this.state.email} onChange={(e) => this.setState({ email: e.target.value })}/>
                </Grid>
                <Grid item xs={12}>
                    <PrivilegePicker
                        dcPrivileges={this.props.privileges}
                        loading={this.props.loading}
                        updatePrivilege={this.updateprivilege}
                        updateDCPrivilege={this.updateDCPrivilege}
                    />
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
                        onClick={this.searchUsers}
                        style={{
                            "width": "100%",
                            "marginTop": "20px",
                            "backgroundColor": "blue",
                            "color": "white"
                        }}
                    >
                        Search
                    </Button>
                </Grid>
            </Grid>
        </Card>
        );
    }
}
