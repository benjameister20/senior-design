import React from "react";

import axios from 'axios';
import Dropzone from 'react-dropzone'

import {
	Modal,
	Typography,
	Fade,
	Backdrop,
	Grid,
	Button,
	Paper,
	withStyles,
} from "@material-ui/core/";

import getURL from "../../helpers/functions/GetURL";
import { AssetCommand } from "../enums/AssetCommands.ts";
import * as AssetConstants from "../AssetConstants";
import StatusDisplay from "../../helpers/StatusDisplay"


const useStyles = theme => ({
	grid: {
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
		width: "50%"
	},
})

class ImportAsset extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
            importedFile:null,

            showStatus:false,
            statusSeverity:"",
            statusMessage:"",
		};
	}

	setFile = (file) => {
		this.setState({ importedFile: file });
	}

	chooseFile = (event) => {
        this.setState({ importedFile: event.target.files[0] })
    }

	uploadFile = () => {
        const data = new FormData();
        data.append('file', this.state.importedFile);
        this.sendUploadedFile(data);
    }

	closeImport = () => {
		this.setState({ importedFile: null }, () => { this.props.close() });
	}

	sendUploadedFile = (data) => {
        var baseURL = this.props.connections ? "networkConnections/" : AssetConstants.ASSETS_MAIN_PATH;
        axios.post(
            getURL(baseURL, AssetCommand.UPLOAD_FILE), data
        ).then(response => {
            if (response.data.message === AssetConstants.SUCCESS_TOKEN) {
				this.setState({ showStatus: true, statusMessage: response.data.summary, statusSeverity:AssetConstants.SUCCESS_TOKEN, showImport: false,})
				this.props.close();
            } else {
                this.setState({ showStatus: true, statusMessage: response.data.message, statusSeverity:AssetConstants.ERROR_TOKEN })
            }
        });
    }

    closeShowStatus = () => {
        this.setState({ showStatus: false, statusMessage:"", statusSeverity:"" });
    }

	render() {
		const { classes } = this.props;
		return (
            <div>
			<Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={this.props.open}
                onClose={this.closeImport}
                closeAfterTransition
            >
                    <Backdrop
                        open={this.props.open}
                    >
                        <div className={classes.grid}>
                        <Grid
                            container
                            spacing={1}
                            direction="row"
                            justify="flex-start"
                            alignItems="center"
                        >
                            <Grid item xs={9}>
                                <Typography variant="h5">Import Assets</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Button
                                    onClick={this.closeImport}
                                    style={{ width: "100%" }}
                                >
                                    Close
                                </Button>
                            </Grid>
                            <Grid container item direction="row" justify="center" alignItems="center" xs={12}>
								<input
									type='file'
									accept=".csv"
									onChange={this.chooseFile}
								/>
							</Grid>
							<Grid container item direciton="row" justify="center" alignItems="center" xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
									style={{width: "40%"}}
									onClick={() => {this.uploadFile()}}
                                >
                                    Upload File
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                </Backdrop>
            </Modal>
            <StatusDisplay
            open={this.state.showStatus}
            severity={this.state.statusSeverity}
            closeStatus={this.closeShowStatus}
            message={this.state.statusMessage}
        />
        </div>
		);
	}
}

export default withStyles(useStyles)(ImportAsset);
