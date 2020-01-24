import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import axios from 'axios';


export default class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            usernameText: "Email Address",
            passwordText: "Password"
        };

    }

    makeTextField(text) {
        return (<TextField
                    id="outlined-basic"
                    label={text}
                    variant="outlined"
                />);
    }

    encryptedPassword() {
        return this.state.passwordText;
    }

    submitCredentials() {
        axios.post('http://localhost:4010/testing', { "username":"username", "password":"password"} ).then(response => console.log(response))
    }

    changePages() {
        axios.get('http://localhost:4010/testing').then(response => console.log(response))
    }

    render() {
        return (
            <div>
                {this.makeTextField(this.state.usernameText)}
                {this.makeTextField(this.state.passwordText)}
                <Checkbox
                    value="primary"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                    value="Remember me"
                />
                <Button
                    onClick={this.submitCredentials}
                    variant="secondary"
                >
                    Sign In
                </Button>
                <Link
                    onClick={this.changePages}
                >
                    Forgot Password?
                </Link>
            </div>
        );
    }
}
