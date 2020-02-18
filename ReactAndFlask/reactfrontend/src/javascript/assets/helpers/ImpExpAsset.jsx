import React from 'react';

import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

export default class ImpExpAsset extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        return(
            <Grid container spacing={3}>
                <Grid item xs={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<CloudUploadIcon />}
                        onClick={() => {this.props.openImportModal()} }
                    >
                        Import
                    </Button>
                </Grid>
                <Grid item xs={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<CloudDownloadIcon />}
                        onClick={() => {this.props.downloadTable()}}
                    >
                        Export
                    </Button>
                </Grid>
            </Grid>
        );
    }
}
