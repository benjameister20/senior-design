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
        axios.post(
            getURL(AssetConstants.ASSETS_MAIN_PATH, AssetCommand.UPLOAD_FILE), data
            ).then(response => {
                if (response.data.message === AssetConstants.SUCCESS_TOKEN) {
					this.setState({ showStatus: true, statusMessage: response.data.summary, statusSeverity:AssetConstants.SUCCESS_TOKEN, showImport: false,})
					this.props.close();
                } else {
                    this.setState({ showStatus: true, statusMessage: response.data.message, statusSeverity:AssetConstants.ERROR_TOKEN })
                }
            });
	}

	render() {
		const { classes } = this.props;
		return (
			<Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={this.props.open}
                onClose={this.closeImport}
                closeAfterTransition
            >
                <Fade in={this.props.open}>
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
                                <Typography variant="h5">Import Models</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Button
                                    onClick={this.closeImport}
                                    style={{ width: "100%" }}
                                >
                                    Close
                                </Button>
                            </Grid>
                            {/*<Grid item xs={12}>
                                <Dropzone onDrop={acceptedFiles => { this.setFile(acceptedFiles); } }>
                                    {({getRootProps, getInputProps}) => (
                                        <section>
                                        <div {...getRootProps()}>
                                        <input {...getInputProps()} />

                                            <Paper
                                                elevation={3}
                                                style={{
                                                    height: "100px"
                                                }}
                                            >
                                                <Grid
                                                    container
                                                    spacing={2}
                                                    direction="row"
                                                    justify="center"
                                                    alignItems="center"
                                                    style={{"padding": "30px"}}
                                                >
                                                    <Grid item xs={12}>
                                                        <Typography align="center" variant="h6">Drag and drop file here!</Typography>
                                                    </Grid>
                                                </Grid>

                                            </Paper>
                                        </div>
                                        </section>
                                    )}
                                </Dropzone>
                            </Grid>
                            <Grid container item direciton="row" justify="center" alignItems="center" xs={12}>
                                <hr style={{width: "20vw"}} />
                                <Typography color="textSecondary">
                                    Or
                                </Typography>
                                <hr style={{width: "20vw"}} />
                            </Grid>*/}
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
                </Fade>
            </Modal>
		);
	}
}

export default withStyles(useStyles)(ImportAsset);
