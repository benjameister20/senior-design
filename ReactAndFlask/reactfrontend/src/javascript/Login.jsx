import React from 'react';
import { Grid, Button, TextField, Card, CardContent, Typography } from '@material-ui/core';
import axios from 'axios';
import getURL from './helpers/functions/GetURL';
import { Privilege } from './enums/privilegeTypes.ts'
import StatusDisplay from './helpers/StatusDisplay';
import logo from '../images/logo.png';
import ShibLogin from './ShibLogin';
import * as Constants from "./Constants";

const loginMainPath = 'users/';
const queryString = require('query-string');

export default class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // Login info
            username:'',
            password:'',

            // Snackbar
            statusMessage: '',
            showStatus: false,
            statusSeverity: 'info',

            // If view has been initialized
            initialized: false,

            // OAuth NetID login
            oauth: false,
        };

        this.closeShowStatus = this.closeShowStatus.bind(this);
        this.submitCredentials = this.submitCredentials.bind(this);
    }

    componentDidMount() {
        try {
            var params = queryString.parse(window.location.hash.substring(1));
            if (params.access_token != null) {
                this.getDukeCredentials(params.access_token);
                this.setState({ oauth: true });
            }
        } catch(e) {
            console.log("tried:")
        }

        this.setState({ initialized: true });
    }

    // Login and send credentials to backend
    submitCredentials() {
        axios.post(
            getURL(loginMainPath, 'authenticate'), {
                username: this.state.username,
                password: this.state.password,
            }).then(response => {
                const message = response.data['message'];
                if (message === 'success') {
                    this.setState({ message: '' });
                    this.props.loginFunc(response.data['token'], this.state.username, response.data['privilege']);
                } else {
                    this.setState({ showStatus: true, statusMessage: message });
                }
            });
        //this.props.loginFunc('token', "Administrator", Privilege.ADMIN);
    }

    // Set the username
    updateUsername(event) {
        this.setState({ username: event.target.value })
    }

    // Set the password
    updatePassword(event) {
        this.setState({ password: event.target.value })
    }

    // Close snackbar
    closeShowStatus() {
        this.setState({ showStatus: false })
    }

    // Fired when key is pressed, login on enter
    onKeyPressed(event) {
        if (event.key === 'Enter') {
            // Intercept key event
            event.preventDefault();
            event.stopPropagation();

            // Login
            this.submitCredentials();
        }
    }

    // Get Duke info from colab API
    getDukeCredentials = (token) => {
        axios.get('https://api.colab.duke.edu/identity/v1/', {
            headers: {
                'x-api-key': Constants.CLIENT_ID,
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            axios.post(
                getURL(loginMainPath, 'oauth'), {
                    "username": response.data.netid,
                    "email": response.data.mail,
                    "display_name": response.data.displayName,
                    "client_id": Constants.CLIENT_ID,
                    "token": token,
                }).then(response => {
                    const message = response.data['message'];
                    if (response.status === Constants.HTTPS_STATUS_OK) {
                        this.setState({
                            username: '',
                            password: '',

                            statusMessage: '',
                            showStatus: false,
                            statusSeverity:' info',

                            initialized: false,

                            oauth:false,
                         });

                        this.props.loginFuncOAuth(response.data['token'], response.data.username, response.data['privilege']);
                    } else {
                        this.setState({ showStatus: true, statusMessage: message });
                    }
            });
        });
    }

    // Redirect to shibboleth login
    loginWithOAuth = () => {
        window.location = Constants.SHIBBOLETH_LOGIN;
    }

    // Render view
    render() {
        return (
            <div>
                { (this.state.oauth) ? <ShibLogin /> :
                <Grid
                    container
                    spacing={5}
                    direction="column"
                    justify="flex-start"
                    alignItems="center"
                    onKeyDown={(e) => this.onKeyPressed(e)}
                    style={{
                        "minHeight": "102vh",
                        "background": "#56ab2f",
                        "background": "-webkit-linear-gradient(to top, #a8e063, #56ab2f)",
                        "background": "linear-gradient(to top, #a8e063, #56ab2f)",
                    }}
                >
                    <Grid item xs={12}>
                        <img src={logo} style={{ height: "200px", "marginTop": "50px" }} alt="Hyposoft" />
                    </Grid>
                    <Grid item xs={12}>
                        <Card style={{ minWidth: '20vw' }}>
                            <CardContent>
                                <Grid
                                    container
                                    spacing={1}
                                    direction="column"
                                    justify="center"
                                    alignItems="center"
                                >
                                    <Grid container item alignItems="flex-start" xs={12}>
                                        <Typography
                                            variant="h4"
                                            color="textPrimary"
                                            fontWeight="fontWeightBold"
                                            gutterBottom
                                        >
                                            Login
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            id="username-input"
                                            label="Username"
                                            variant="outlined"
                                            required={true}
                                            ref='username'
                                            onChange={this.updateUsername.bind(this)}
                                            style={{minWidth: "15vw"}}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            id="password-input"
                                            label="Password"
                                            variant="outlined"
                                            required={true}
                                            ref='password'
                                            type="password"
                                            onChange={this.updatePassword.bind(this)}
                                            style={{minWidth: "15vw"}}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            onClick={this.submitCredentials}
                                            variant="contained"
                                            color="primary"
                                            style={{minWidth: "15vw"}}
                                        >
                                            Sign In
                                        </Button>
                                    </Grid>
                                    <Grid container item direciton="row" justify="center" alignItems="center" xs={12}>
                                            <hr style={{width: "5vw"}} />
                                            <Typography color="textSecondary">
                                                Or
                                            </Typography>
                                            <hr style={{width: "5vw"}} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            onClick={this.loginWithOAuth}
                                            variant="contained"
                                            color="primary"
                                        >
                                            Sign In with NetID
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <StatusDisplay
                            open={this.state.showStatus}
                            severity={this.state.statusSeverity}
                            closeStatus={this.closeShowStatus}
                            message={this.state.statusMessage}
                        />
                    </Grid>
                </Grid>}
            </div>
        );
    }
}
