import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import getURL from './helpers/functions/GetURL';
import * as Constants from './Constants';

const loginMainPath = 'users/';

export default class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username:'',
            password:'',
            message:'',
        };

        this.submitCredentials = this.submitCredentials.bind(this);
    }

    submitCredentials() {
        axios.post(
            getURL(loginMainPath, 'authenticate'),
            {
                "username":this.state.username,
                "password":this.state.password,
            }
            ).then(response => {
                var valid = response.data['message'];
                if (valid == 'success') {
                    this.setState({ message: '' });
                    this.props.loginFunc(response.data['token'], response.data['privilege']);
                } else {
                    this.setState({ message:response.data['message'] });
                }
            });
        this.props.loginFunc('token');
    }

    updateUsername(event) {
        this.setState({ username: event.target.value })
    }

    updatePassword(event) {
        this.setState({ password: event.target.value })
    }

    render() {
        return (
            <div>
                {this.state.message}
                <TextField
                    id="outlined-basic"
                    label="Username"
                    variant="outlined"
                    required="true"
                    ref='username'
                    onChange={this.updateUsername.bind(this)}
                />
                <TextField
                    id="outlined-basic"
                    label="Password"
                    variant="outlined"
                    required="true"
                    ref='password'
                    onChange={this.updatePassword.bind(this)}
                />
                <Button
                    onClick={this.submitCredentials}
                    variant="contained"
                    color="primary"
                >
                    Sign In
                </Button>
            </div>
        );
    }
}
