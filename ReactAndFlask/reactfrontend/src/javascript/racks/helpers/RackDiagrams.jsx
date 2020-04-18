import React, { Component } from 'react'

import axios from "axios";

import {
	Button,
	CircularProgress
} from "@material-ui/core";

import getURL from "../../helpers/functions/GetURL";
import * as Constants from "../../Constants";


export default class RackDiagrams extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loadingRacks: true,
		};
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
				console.log(response)
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

				racks.map(rack => {
					var startL = rack.substring(0,1);
					var startN = parseInt(rack.substring(1));
					this.createDiagram(startL, startL, startN, startN);
				});

				console.log(racks)
			});
	}


	render() {
		return (
			<div>
				<Button
					onClick={() => this.getRacks()}
				>
					Get Racks
				</Button>

				{this.state.loadingRacks ? <CircularProgress /> : null}
			</div>
		)
	}
}
