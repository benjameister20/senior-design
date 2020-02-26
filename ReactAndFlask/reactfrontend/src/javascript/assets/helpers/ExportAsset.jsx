import React from 'react';

import axios from "axios";
import { CSVLink } from "react-csv";

import {
	Button,
	Paper,
	Grid,
	Typography,

} from '@material-ui/core/';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

import { AssetCommand } from '../enums/AssetCommands.ts'
import getURL from '../../helpers/functions/GetURL';
import * as AssetConstants from "../AssetConstants";

export default class ExportAsset extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
			csvData:"",
		};
	}

	downloadTable = () => {
        axios.post(
            getURL(AssetConstants.ASSETS_MAIN_PATH, AssetCommand.EXPORT_FILE),
            {
                'filter':{},
                "datacenter_name":"",
            }
            ).then(response => {
                console.log(response);
                this.setState({ csvData: response.data.csvData });
                this.csvLink.link.click();
            });
    }

    render() {
        return (
            <div>
                <Paper elevation={3}>
                <Grid
                    container
                    spacing={2}
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                    style={{"padding": "10px"}}
                >
                    <Grid item xs={12}>
                        <Typography variant="h6">Export</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography>Download what is currently shown in the table.</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            onClick={() => {this.downloadTable()}}
                            variant="contained"
                            color="primary"
                            startIcon={<CloudDownloadIcon />}
                            style={{
                                width: "100%"
                            }}
                        >
                            Export All Data
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

			<CSVLink
                data={this.state.csvData}
				filename={AssetConstants.ASSET_DOWNLOAD_FILE_NAME}
				className="hidden"
				ref={(r) => this.csvLink = r}
				target="_blank"
			/>
            </div>
        );
    }
}
