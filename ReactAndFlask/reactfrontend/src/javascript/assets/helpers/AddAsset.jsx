import React from "react";

import {
	Grid,
	Typography,
	Button,
	Paper,
	Dialog,
	withStyles,
	AppBar,
	Toolbar,
	IconButton,
	Slide
} from "@material-ui/core/";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CloseIcon from '@material-ui/icons/Close';

import CreateAsset from "./CreateAsset";
import ImportAsset from "./ImportAsset";

const useStyles = theme => ({
	appBar: {
	  position: 'relative',
	},
	title: {
	  marginLeft: theme.spacing(2),
	  flex: 1,
	},
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

class AddAsset extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			showCreate: false,
			showImport: false,
			showConnectionsImport: false,
		};
	}

	openImport = () => {
		this.setState({ showImport: true });
	}

	closeImport = () => {
		this.setState({ showImport: false });
	}

	openConnectionsImport = () => {
		this.setState({ showConnectionsImport: true });
	}

	closeConnectionsImport = () => {
		this.setState({ showConnectionsImport: false });
	}

	openCreate = () => {
		this.setState({ showCreate: true });
	}

	closeCreate = () => {
		this.setState({ showCreate: false });
	}

	render() {
		const { classes } = this.props;
		return (
			<React.Fragment>
				<Paper elevation={3} style={{ minHeight: this.props.height }}>
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
								Import Assets
							</Button>
						</Grid>
						<Grid item xs={12}>
							<Button
								variant="contained"
								color="primary"
								style={{width: "100%"}}
								startIcon={<CloudUploadIcon />}
								onClick={() => {this.openConnectionsImport()} }
							>
								Import Network Connections
							</Button>
						</Grid>
					</Grid>
				</Paper>

				<Dialog fullScreen open={this.state.showCreate} onClose={this.closeCreate} TransitionComponent={Transition} padding={3}>
					<AppBar className={classes.appBar}>
						<Toolbar>
							<IconButton edge="start" color="inherit" onClick={this.closeCreate} aria-label="close">
								<CloseIcon />
							</IconButton>
							<Typography variant="h6" className={classes.title}>
								Create Asset
							</Typography>
						</Toolbar>
					</AppBar>
					<CreateAsset
						close={this.closeCreate}
						getAssetList={this.props.getAssetList}
						showStatus={this.props.showStatus}
						privilege={this.props.privilege}
						changePlanActive={this.props.changePlanActive}
						changePlanID={this.props.changePlanID}
						changePlanStep={this.props.changePlanStep}
						incrementChangePlanStep={this.props.incrementChangePlanStep}
						fetchAllAssets={this.props.fetchAllAssets}
					/>
				</Dialog>

				<ImportAsset
					open={this.state.showImport}
					close={this.closeImport}
				/>
			</React.Fragment>
		);
	}
}

export default withStyles(useStyles)(AddAsset);
