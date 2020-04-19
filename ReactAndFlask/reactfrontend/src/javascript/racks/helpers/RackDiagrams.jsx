import React, { Component } from 'react'

import axios from "axios";

import {
	withStyles,
	Typography
} from "@material-ui/core";

import getURL from "../../helpers/functions/GetURL";
import * as Constants from "../../Constants";

function createRackElem(color, title, index) {
	return { color, title, index };
}

function createRack(rackTitle, racks) {
	return { rackTitle, racks }
}

function sort(a, b) {
	if (a.rackTitle > b.rackTitle) return 1;
	if (a.rackTitle < b.rackTitle) return -1;
	return 0;
}

function sortRack(a, b) {
	if (a.index > b.index) return -1;
	if (a.index < b.index) return 1;
	return 0;
}

const useStyles = theme => ({
	root: {
		align: "center",
	},
	index: {
		backgroundColor: "#000000",
		color: "#FFFFFF",
		width: "15%",
		display: "inline-block",
		paddingLeft:"5%",
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
			loadingRacks: true,

			racks: [],
		};
	}

	componentDidMount() {
		this.getRacks();
	}


	createDiagram = (startL, stopL, startN, stopN) => {
		axios.post(getURL(Constants.RACKS_MAIN_PATH, "details/"),
			{
				"start_letter": startL,
				"stop_letter": stopL,
				"start_number": startN,
				"stop_number": stopN,
				"datacenter_name": this.props.datacenter_name,
			}
		).then(
			response => {
				var assets = response.data.racks[0][startL + startN];
				var rack = [];

				for (let rackPos = 1; rackPos <= 42; rackPos++) {
					if (assets.length > 0) {
						var asset = assets[0];
						if (asset.rack_position === rackPos) {
							console.log(rackPos);
							console.log("asset")
							console.log(asset);
							console.log(asset.height);
							for (let assetHeight = 0; assetHeight < asset.height; assetHeight++) {
								console.log("in inner loop");
								var title = (asset.hostname === "") ? asset.asset_number : asset.hostname;
								title = (assetHeight > 0) ? "" : title;
								rack.push(createRackElem(asset.display_color, title, rackPos + assetHeight));
								console.log("color")
								console.log(rack[rackPos + assetHeight - 1].color);
							}
							rackPos += (asset.height - 1);
							console.log(rackPos)
						} else {
							rack.push(createRackElem("#FFFFFF", "", rackPos));
						}
					} else {
						rack.push(createRackElem("#FFFFFF", "", rackPos));
					}
				}

				rack.sort(sortRack);
				console.log(rack);
				var rackTitle = startL + (startN > 9 ? startN : " " + startN);
				this.state.racks.push(createRack(rackTitle, rack));
				this.state.racks.sort(sort)
				this.forceUpdate();
			});
	}

	getRacks = () => {
		axios.post(getURL(Constants.RACKS_MAIN_PATH, "all/"),
			{
				"datacenter_name": this.props.datacenter_name,
			}
		).then(
			response => {
				var racks = [];
				response.data.racks.map(rack => {
					racks.push(rack.label);
				})
				console.log(response);
				racks.map(rack => {
					var startL = rack.substring(0, 1);
					var startN = parseInt(rack.substring(1));
					this.createDiagram(startL, startL, startN, startN);
				});
			});
	}


	render() {
		const { classes } = this.props;

		return (
			<div className={classes.root}>
				{this.state.racks.length > 0 ?
					this.state.racks.map((rack, index) => (
						<span className={classes.rack}>
							<Typography
								className={classes.title}
							>
								{rack.rackTitle}
							</Typography>

							{rack.racks.map(rack => (
								<div>
									<Typography
										className={classes.index}
									>
										{rack.index + " "}
									</Typography>
									{rack.title !== "" ?
										<Typography
											style={{ background: rack.color, display: "inline-block", width: "70%" }}
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
						</span>
					))
					: null}
			</div>
		)
	}
}


export default withStyles(useStyles)(RackDiagrams);
