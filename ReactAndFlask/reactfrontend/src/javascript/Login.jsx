import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import getURL from './helpers/functions/GetURL';
import { Privilege } from './enums/privilegeTypes.ts'
import StatusDisplay from './helpers/StatusDisplay';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import logo from '../images/logo.png';
import { loginKeys } from './JSONKeys';

const loginMainPath = 'users/';

export default class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username:'',
            password:'',
            statusMessage:'',
            showStatus:false,
            statusSeverity:'info',
        };

        this.closeShowStatus = this.closeShowStatus.bind(this);
        this.submitCredentials = this.submitCredentials.bind(this);
    }

    submitCredentials() {
        const usernameKey = loginKeys.username;
        const passwordKey = loginKeys.password;

        axios.post(
            getURL(loginMainPath, 'authenticate'), {
                usernameKey: this.state.username,
                passwordKey: this.state.password,
            }).then(response => {
                var valid = response.data['message'];
                if (valid == 'success') {
                    this.setState({ message: '' });
                    this.props.loginFunc(response.data['token'], response.data['privilege']);
                } else {
                    this.setState({ showStatus:true, statusMessage:response.data['message'] });
                }
            });
        this.props.loginFunc('token', Privilege.ADMIN);
    }

    updateUsername(event) {
        this.setState({ username: event.target.value })
    }

    updatePassword(event) {
        this.setState({ password: event.target.value })
    }

    closeShowStatus() {
        this.setState({ showStatus: false })
    }

    onKeyPressed(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            this.submitCredentials();
        }
    }

    render() {
        return (
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
                    <img src={logo} style={{height: "200px", "marginTop": "50px"}} />
                </Grid>
                <Grid item xs={12}>
                    <Card
                        style={
                            {
                                minWidth: '20vw',
                            }
                        }
                    >
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
                                        id="outlined-basic"
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
                                        id="outlined-basic"
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
                                        onClick={this.submitCredentials}
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
            </Grid>
        );
    }
}
