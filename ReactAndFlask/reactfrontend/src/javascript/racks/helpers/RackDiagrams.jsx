import React, { Component } from 'react'

import axios from "axios";

import {
	Button,
} from "@material-ui/core";

import getURL from "../../helpers/functions/GetURL";
import * as Constants from "../../Constants";

export default class RackDiagrams extends Component {
	constructor(props) {
		super(props);

		this.state = {

		};
	}

	getRacks = () => {
		axios.post(getURL(Constants.RACKS_MAIN_PATH, "all/"),
		{
			"datacenter_name":this.props.datacenter_name,
		}
		).then(
			response => console.log(response)
		)
	}


	render() {
		return (
			<div>
				<Button
					onClick={() => this.getRacks()}
				>
					Get Racks
				</Button>
			</div>
		)
	}
}
