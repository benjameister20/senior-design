import React from 'react';
import Modal from '@material-ui/core/Modal';
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';

export default class DetailedView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showConfirmationBox:false,
        };
    }

    closeModal() {
        this.setState({showConfirmationBox:false,});

    }

    render() {
        return (
        <div>
            <Modal
                style={{top: `50%`,left: `50%`,transform: `translate(-50%, -50%)`,}}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.props.showDetailedView}
                onClose={this.props.closeDetailedView}
            >
                <div>
                    {this.props.inputs.map(input => (
                        <TextField id="standard-basic" label={input} onChange={this.props.updateModelEdited} defaultValue={this.props.defaultValues[input]}/>
                    ))}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.props.edit}
                    >
                        Save
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.props.delete}
                    >
                        Delete
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.props.closeDetailedView}
                    >
                        Close
                    </Button>
                </div>
            </Modal>
        </div>
        );
    }
}
