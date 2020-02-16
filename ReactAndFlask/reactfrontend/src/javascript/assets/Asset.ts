import { Component} from 'react';

export default class Asset {

	model: string;
	hostname: string;
	rack: string;
	rackU: number;
	owner: string;
	comment: string;
	datacenter_id: string;
	tags: any;
	mac_address: string;
	network_connections: any;
	power_connections: any;
	asset_number: number;
	json: any;

	constructor() {
		this.model = "";
		this.hostname = "";
		this.rack = "";
		this.rackU = -1;
		this.owner = "";
		this.comment = "";
		this.datacenter_id = "";
		this.tags = [];
		this.mac_address = "";
		this.network_connections = [];
		this.power_connections = [];
		this.asset_number = -1;

		this.json = {
			"model":this.model,
			"hostname":this.hostname,
			"rack":this.rack,
			"rackU":this.rackU,
			"owner":this.owner,
			"comment":this.comment,
			"datacenter_id":this.datacenter_id,
			"tags":this.tags,
			"mac_address":this.mac_address,
			"network_connections":this.network_connections,
			"power_connections":this.power_connections,
			'asset_number':this.asset_number,
		}
	}

	updateVal(key: any, val: any) {
		this.json[key] = val;
	}

	getAssetAsJSON() {
		return this.json;
	}

}
