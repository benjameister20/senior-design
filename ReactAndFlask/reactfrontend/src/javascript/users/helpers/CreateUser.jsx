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
            privilege: "",
            selectedPrivileges:[],
        };
    }

    resetCreate = (success) => {
        if (success) {
            this.setState({username: "", display_name: "", password: "", email: "", privilege: ""});
        }
    }

    createModel = () => {
        this.props.createModel(this.state.username, this.state.password, this.state.display_name, this.state.email, this.state.selectedPrivileges, this.resetCreate);
    }

    updateSelectedPrivileges = (privilege, checked) => {
        var selected = [];

        this.state.selectedPrivileges.map(priv => {
            if (priv !== privilege || (priv === privilege && checked)) {
                selected.push(priv);
            }
        });
        if (!this.state.selectedPrivileges.includes(privilege) && checked) {
            selected.push(privilege);
        }
        this.setState({ selectedPrivileges: selected });
    }

    render() {
        return (
            <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <Typography>Create</Typography>
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
                            <Grid item xs={6}>
                                <FormControl
                                    style={{"minWidth": "200px"}}
                                    value={this.state.pivilege}
                                    gutterbottom="true"
                                >
                                    <PrivilegePicker
                                        privileges={this.props.privileges}
                                        loading={this.props.loading}
                                        updatePrivilege={this.updateSelectedPrivileges}
                                    />
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
                    </ExpansionPanelDetails>
                </ExpansionPanel>
        );
    }
}
