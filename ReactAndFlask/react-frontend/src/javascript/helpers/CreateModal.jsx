import React from 'react';
import Modal from '@material-ui/core/Modal';
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { palette } from '@material-ui/system';

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
                style={{top: `50%`,left: `50%`,transform: `translate(-50%, -50%)`, backgroundColor: palette.background.paper,}}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.props.showCreateModal}
                onClose={this.props.closeCreateModal}
            >
                <div>
                    {this.props.inputs.map((input, index) => (
                        (index===0 && this.props.useAutocomplete) ? <Autocomplete
                            id="combo-box-demo"
                            options={this.props.options}
                            includeInputInList
                            freeSolo
                            renderInput={params => (
                            <TextField {...params} label={input} name={input} onChange={this.props.updateModelCreator} onBlur={this.props.updateModelCreator} variant="outlined" fullWidth />
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
