import React from 'react';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import { palette } from '@material-ui/system';

export default class UploadModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <Modal
                style={{top: `50%`,left: `50%`,transform: `translate(-50%, -50%)`, background:'#AAAAAA'}}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.props.showImportModal}
                onClose={this.props.closeImportModal}
            >
                <div>
                    <div>
                    <input
                        type='file'
                        accept=".csv"
                        onChange={this.props.chooseFile}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.props.uploadFile}
                    >
                        Upload
                    </Button>
                    </div>
                    <p
                        style={{color: `white`}}
                    >
                        {this.props.textDescription}
                    </p>
                </div>
            </Modal>
        )
    }
}
