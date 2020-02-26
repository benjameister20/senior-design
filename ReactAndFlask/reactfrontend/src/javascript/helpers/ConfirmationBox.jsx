import React from 'react';
import Modal from '@material-ui/core/Modal';
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

export default class DetailedView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showConfirmationBox:false,
        };

        this.closeModal = this.closeModal.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
    }

    confirmDelete() {
        this.setState({ showConfirmationBox: true });
    }

    closeModal() {
        this.setState({showConfirmationBox:false,});
    }

    render() {
        return (
        <div>
            Are you sure you wish to delete?
                <Button
                    variant="contained"
                    color="primary"
                    onClick={this.props.delete}
                >
                    Yes
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={this.closeModal}
                >
                    No
                </Button>
        </div>
        );
    }
}
