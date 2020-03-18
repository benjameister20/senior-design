import React, { Component } from 'react'

import {
    IconButton,
    Snackbar
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import MuiAlert from '@material-ui/lab/Alert';

class StatusDisplay extends React.Component {
    render() {
        return (
            <div>
                <Snackbar open={this.props.open} autoHideDuration={8000} onClose={() => this.props.close() }>
                    <MuiAlert elevation={6} variant="filled" severity={this.props.severity} >
                        <div>
                            {this.props.message}
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => this.props.close() }
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        </div>
                    </MuiAlert >
                </Snackbar>
            </div>
        )
    }
}

export default StatusDisplay;
