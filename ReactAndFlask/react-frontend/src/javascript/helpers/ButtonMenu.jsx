import React from 'react';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Button from '@material-ui/core/Button';

export default class ButtonMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        return(
            <div>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={this.props.openCreateModal}
                >
                    Create
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<CloudUploadIcon />}
                    onClick={this.props.openImportModal}
                >
                    Import
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<CloudDownloadIcon />}
                    onClick={this.props.downloadTable}
                >
                    Export
                </Button>
            </div>
        );
    }
}
