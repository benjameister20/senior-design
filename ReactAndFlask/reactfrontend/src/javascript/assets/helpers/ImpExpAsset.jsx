import React from 'react';

import axios from 'axios';
import { CSVLink } from "react-csv";

import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

import { AssetCommand } from '../enums/AssetCommands.ts'
import getURL from '../../helpers/functions/GetURL';
import * as AssetConstants from "../AssetConstants";

const useStyles = theme => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    button: {
        margin: theme.spacing(2, 4, 3),
    }
  });

class ImpExpAsset extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            csvData:'',
            importedFile:null,

            showImport:false,
        };
    }

    sendUploadedFile = (data) => {
        axios.post(
            getURL(AssetConstants.ASSETS_MAIN_PATH, AssetCommand.UPLOAD_FILE), data
            ).then(response => {
                if (response.data.message === AssetConstants.SUCCESS_TOKEN) {
                    this.setState({ showStatus: true, statusMessage: response.data.summary, statusSeverity:AssetConstants.SUCCESS_TOKEN, showImport: false,})
                } else {
                    this.setState({ showStatus: true, statusMessage: response.data.message, statusSeverity:AssetConstants.ERROR_TOKEN })
                }
            });
        }

    downloadTable = () => {
        axios.post(
            getURL(AssetConstants.ASSETS_MAIN_PATH, AssetCommand.EXPORT_FILE), { 'filter':this.props.filters }
            ).then(response => {
                this.setState({ csvData: response.data.csvData });
                this.csvLink.link.click();
            });
    }

    openImportModal = () => {
        this.setState({showImport: true});
    }

    closeImportModal = () => {
        this.setState({showImport: false});
    }

    uploadFile = () => {
        const data = new FormData();
        data.append('file', this.state.importedFile);
        this.sendUploadedFile(data);
        this.setState({ showImport: false });
    }

    chooseFile = (event) => {
        this.setState({ importedFile: event.target.files[0] })
    }

    render() {
        const { classes } = this.props;

        return(
            <span>
                <Grid container spacing={3}>
                    <Grid item xs={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<CloudUploadIcon />}
                            onClick={() => {this.openImportModal()} }
                        >
                            Import
                        </Button>
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<CloudDownloadIcon />}
                            onClick={() => {this.downloadTable()}}
                        >
                            Export
                        </Button>
                    </Grid>
                </Grid>

                <CSVLink
                    data={this.state.csvData}
                    filename={AssetConstants.ASSET_DOWNLOAD_FILE_NAME}
                    className="hidden"
                    ref={(r) => this.csvLink = r}
                    target="_blank"
                />

                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={this.state.showImport}
                    onClose={this.closeImportModal}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                    timeout: 500,
                    }}
                >
                    <Fade in={this.state.showImport}>
                    <div className={classes.paper}>
                        <input
                            type='file'
                            accept=".csv"
                            onChange={this.chooseFile}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {this.uploadFile()}}
                            className={classes.button}
                        >
                            Upload
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {this.uploadFile()}}
                        >
                            Cancel
                        </Button>
                    </div>
                    </Fade>
                </Modal>
            </span>
        );
    }
}

export default withStyles(useStyles)(ImpExpAsset);
