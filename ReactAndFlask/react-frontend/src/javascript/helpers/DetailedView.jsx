import React from 'react';
import Modal from '@material-ui/core/Modal';
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';

export default class DetailedView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
        <div>
            <Modal
                style={{top: `50%`,left: `50%`,transform: `translate(-50%, -50%)`,}}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.props.show}
                onClose={this.props.close}
            >
                <Button
                    variant="contained"
                    color="primary"
                    onClick={this.props.edit}
                >
                    Save Edits
                </Button>
            </Modal>
        </div>);
    }
}
