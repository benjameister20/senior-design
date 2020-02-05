import React from 'react';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';


export default class StatusDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
            <div>
                <Collapse in={this.props.open}>
                    <Alert
                        severity={this.props.severity}
                        action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={this.props.closeStatus}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                        }
                    >
                        {this.props.message}
                    </Alert>
                </Collapse>
            </div>
        )
    }
}
