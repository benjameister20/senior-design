import React from 'react';

import { connect } from "react-redux"
import PropTypes from "prop-types";
import {
    TextField,
    Button,
    Typography,
    Grid,
    Card,
} from "@material-ui/core/";

import PrivilegePicker from "./functions/PrivilegePicker";
import { createUser } from "../../store/actions/users/userActions";

class CreateModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            displayName: "",
            password: "",
            email: "",
            privilege: "",
            selectedPrivileges:[],
        };
    }

    createModel = () => {
        this.props.createUser(this.state.username, this.state.password, this.state.displayName, this.state.email, "admin"/*this.state.selectedPrivileges*/);
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
        <Card elevation={3} padding={3}>
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
                    <TextField id="standard-basic" variant="outlined" label="Display Name" name="displayName" value={this.state.displayName} onChange={(e) => this.setState({ displayName: e.target.value })}/>
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
                        onClick={() => this.createModel()}
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


CreateModal.propTypes = {
	createUser: PropTypes.func.isRequired,
}

export default connect(null, { createUser })(CreateModal);
