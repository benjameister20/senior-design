import React from "react";

import {
	Grid,
	Typography,
	Button,
	Paper,
} from "@material-ui/core/";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

import CreateAsset from "./CreateAsset";
import ImportAsset from "./ImportAsset";

class AddAsset extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			showCreate:false,
			showImport:false,
		};
	}

	openImport = () => {
		this.setState({ showImport: true });
	}

	closeImport = () => {
		this.setState({ showImport: false });
	}

	openCreate = () => {
		this.setState({ showCreate: true });
	}

	closeCreate = () => {
		this.setState({ showCreate: false });
	}

	render() {
		return (
			<React.Fragment>
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
							<Typography
								variant="h5"
							>
								Add
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Button
								variant="contained"
								style={{
									width: "100%",
									background: "green",
									color: "white"
								}}
								onClick={this.openCreate}
							>
								Create
							</Button>
						</Grid>
						<Grid container item direciton="row" justify="center" alignItems="center" xs={12}>
							<hr style={{width: "5vw"}} />
							<Typography color="textSecondary">
								Or
							</Typography>
							<hr style={{width: "5vw"}} />
						</Grid>
						<Grid item xs={12}>
							<Button
								variant="contained"
								color="primary"
								style={{width: "100%"}}
								startIcon={<CloudUploadIcon />}
								onClick={() => {this.openImport()} }
							>
								Import
							</Button>
						</Grid>
					</Grid>
				</Paper>
				<CreateAsset
					open={this.state.showCreate}
					close={this.closeCreate}
				/>
				<ImportAsset
					open={this.state.showImport}
					close={this.closeImport}
				/>
			</React.Fragment>
		);
	}
}

export default AddAsset;
