import React from 'react';
import Modal from '@material-ui/core/Modal';
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';

export default class CreateModal extends React.Component {
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
                open={this.props.showCreateModal}
                onClose={this.props.closeCreateModal}
            >
                <div>
                    {this.props.inputs.map(input => (
                        <TextField id="standard-basic" label={input} name={input} onChange={this.props.updateModelCreator}/>
                    ))}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.props.createModel}
                    >
                        Create
                    </Button>
                </div>
            </Modal>
        </div>
        );
    }
}
