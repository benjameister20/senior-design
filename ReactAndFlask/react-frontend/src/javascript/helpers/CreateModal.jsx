import React from 'react';
import Modal from '@material-ui/core/Modal';
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';

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
                style={{top: `50%`,left: `50%`,transform: `translate(-50%, -50%)`, background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',}}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.props.showCreateModal}
                onClose={this.props.closeCreateModal}
            >
                <div>
                    {this.props.inputs.map((input, index) => (
                        (index===1 && this.props.useAutocomplete) ? <Autocomplete
                            id="combo-box-demo"
                            options={this.props.options}
                            renderInput={params => (
                            <TextField {...params} label="Combo box" variant="outlined" fullWidth />
                            )}
                        /> :
                        <TextField id="standard-basic" variant="outlined" label={input} name={input} onChange={this.props.updateModelCreator}/>
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
