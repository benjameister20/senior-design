import React, { Component } from 'react'

import axios from "axios";

import {
	withStyles,
	Typography,
	CircularProgress
} from "@material-ui/core";

import getURL from "../../helpers/functions/GetURL";
import * as Constants from "../../Constants";
import DetailAsset from "../../assets/helpers/DetailsAsset";

const decomType = "decommissioned";

const useStyles = theme => ({
	root: {
		align: "center",
	},
	index: {
		backgroundColor: "#000000",
		color: "#FFFFFF",
		width: "15%",
		display: "inline-block",
		paddingLeft: "5%",
	},
	asset: {
		width: "70%",
		display: "inline-block"
	},
	title: {
		backgroundColor: "#A9A9A9",
		width: "100%",
		align: "center",
		paddingLeft: "45%",
	},
	footer: {
		backgroundColor: "#A9A9A9",
		color:"#A9A9A9",
		width: "100%",
		align: "center",
		paddingLeft: "45%",
	},
	rack: {
		display: "inline-block",
		width: "20%",
		margin: "2%",
	}

});

class RackDiagrams extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showDetailedView: false,
			detailAsset: null,

		};
	}

	openAssetDetails = (assetNum) => {
		if (assetNum > 10000) {
			axios.post(getURL(Constants.ASSETS_MAIN_PATH, "detailView/"),
				{
					"asset_number": assetNum
				}
			).then(response => {
				this.setState({ detailAsset: response.data.instances[0], showDetailedView: true });
			});
		}
	}

	closeDetailedView = () => {
		this.setState({ showDetailedView: false });
	}

	getAssetList = () => {

	}

	showStatusBar = (status, severity, message) => {
		this.setState({ showStatus: status, statusSeverity: severity, statusMessage: message });
	}


	render() {
		const { classes } = this.props;

		return (
			<div className={classes.root}>
				{this.props.racks.length > 0 ?
					this.props.racks.map((rack, index) => (
						<span className={classes.rack}>
							<Typography
								className={classes.title}
							>
								{rack.rackTitle}
							</Typography>

							{rack.racks.map(rack => (
								<div onClick={() => this.openAssetDetails(rack.assetNum)}>
									<Typography
										className={classes.index}
									>
										{rack.index + " "}
									</Typography>
									{rack.title !== "" ?
										<Typography
											style={{ background: rack.color, display: "inline-block", width: "70%", color: rack.textColor }}
										>
											{rack.title}
										</Typography>

										:
										<Typography
											style={{ background: rack.color, display: "inline-block", width: "70%", color: rack.color, }}
										>
											{"."}
										</Typography>
									}
									<Typography
										className={classes.index}
									>
										{" " + rack.index}
									</Typography>
								</div>
							))}

							<Typography
								className={classes.footer}
							>
								{"."}
							</Typography>
						</span>
					))
					: null}


				{this.state.showDetailedView ?
					<DetailAsset
						close={this.closeDetailedView}
						showStatus={this.showStatusBar}
						search={this.props.getRacks}
						fetchAllAssets={this.props.getRacks}
						open={this.state.showDetailedView}
						privilege={this.props.privilege}
						username={this.props.username}
						asset={this.state.detailAsset}
						disabled={(!(this.props.privilege.admin || this.props.privilege.asset || this.props.privilege.datacenters.includes(this.state.detailAsset.datacenter_name)) || this.state.assetType === decomType)}
						changePlanActive={false}
						changePlanID={""}
						changePlanStep={-1}
						incrementChangePlanStep={null}
						changePlanName={""}
						showDecommissioned={false}
					/> : null}
			</div>
		)
	}
}


export default withStyles(useStyles)(RackDiagrams);
