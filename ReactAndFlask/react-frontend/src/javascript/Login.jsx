import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';


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

    render() {
        return (
            <div>
                {this.makeTextField(this.state.usernameText)}
                {this.makeTextField(this.state.passwordText)}
                <Checkbox
                    value="secondary"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                    label="Remember me"
                />
                <Button>
                    Sign In
                </Button>
                <div>
                    Forgot Password?
                </div>
            </div>
        );
    }
}
