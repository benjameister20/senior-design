import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';


function submitCredentials() {
    axios.post('http://localhost:4010/testing', { "username":"username", "password":"password"} ).then(response => console.log(response))
}

function changePages() {
    axios.get('http://localhost:4010/testing').then(response => console.log(response))
}

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function Login(props) {
    const classes = useStyles();
    return (
        <div className={classes.paper}>
            <TextField
                id="outlined-basic"
                label="Email Address"
                variant="outlined"
            />
            <TextField
                id="outlined-basic"
                label="Password"
                variant="outlined"
            />
            <Checkbox
                value="primary"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
                value="Remember me"
            />
            <Button
                onClick={submitCredentials()}
                variant="secondary"
            >
                Sign In
            </Button>
            <Link
                onClick={changePages()}
            >
                Forgot Password?
            </Link>
        </div>
    );
}
