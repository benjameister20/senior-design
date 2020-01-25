import React from 'react';
import Modal from '@material-ui/core/Modal';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";

export default function AddItemToBackendModal(properties, type) {

    const [open, setOpen] = React.useState(true);
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            onClose={handleClose}
            >
                <form noValidate autoComplete="off">
                    <FormControlLabel>
                        {type}
                    </FormControlLabel>
                    {properties.map(prop => (
                        <TextField id="standard-basic" label={prop} />
                    ))}
                </form>
            </Modal>
        </div>
    );
}
