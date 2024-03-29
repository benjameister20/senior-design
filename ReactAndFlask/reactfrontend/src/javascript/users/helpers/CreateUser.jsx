import React from 'react';

import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import Card from '@material-ui/core/Card';

import '../../../stylesheets/Models.css';
import PrivilegePicker from "./functions/PrivilegePicker";

import getURL from "../../helpers/functions/GetURL";

export default class CreateModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            display_name: "",
            password: "",
            email: "",
            selectedPrivileges:{
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
            this.setState({
                username: "",
                display_name: "",
                password: "",
                email: "",
            });
        }
    }

    createModel = () => {
        this.props.createModel(this.state.username, this.state.password, this.state.display_name, this.state.email, this.state.selectedPrivileges, this.resetCreate);
    }

    updateSelectedPrivileges = (event, values) => {
        var privs = {
            "model":false,
            "asset":false,
            "datacenters":this.state.selectedPrivileges["datacenters"],
            "power":false,
            "audit":false,
            "admin":false,
        };
        values.map(priv => { privs[priv.value] = true; });
        this.setState({ selectedPrivileges: privs });
    }

    updateDCPrivilege = (event, values) => {
        var privs = this.state.selectedPrivileges;
        privs["datacenters"] = values;
        this.setState({ selectedPrivileges: privs });
    }

    render() {
        return (
        <Card elevation={3} style={{ padding: "20px" }}>
            <Typography variant="h6">Create</Typography>
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
                        updatePrivilege={this.updateSelectedPrivileges}
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
                        onClick={this.createModel}
                        style={{
                            "width": "100%",
                            "marginTop": "20px",
                            "backgroundColor": "green",
                            "color": "white"
                        }}
                    >
                        Create
                    </Button>
                </Grid>
            </Grid>
        </Card>
        );
    }
}
