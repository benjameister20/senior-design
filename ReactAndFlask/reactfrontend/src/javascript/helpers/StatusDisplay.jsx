import React from 'react';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
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
                <Snackbar open={this.props.open} autoHideDuration={12000} onClose={this.props.closeStatus}>
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
