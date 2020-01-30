import React from 'react';
import Button from '@material-ui/core/Button';

export default class UploadModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
            <Modal
                style={{top: `50%`,left: `50%`,transform: `translate(-50%, -50%)`,}}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.props.showImportModal}
                onClose={() => (this.setState({showImportModal:false}))}
            >
                <div>
                    <input type='file' accept=".csv" />
                    <Button
                        variant="contained"
                        color="primary"
                    >
                        Upload
                    </Button>
                </div>
            </Modal>
        )
    }
}