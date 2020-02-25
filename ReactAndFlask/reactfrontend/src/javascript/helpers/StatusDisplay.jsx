import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';


export default class StatusDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
            <div>
                <Snackbar open={this.props.open} autoHideDuration={8000} onClose={this.props.closeStatus}>
                    <MuiAlert elevation={6} variant="filled"
                        severity={this.props.severity}
                    >
                        <div>
                        {this.props.message}
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={this.props.closeStatus}
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
