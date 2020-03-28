import React from "react";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from "@material-ui/core/TextField";
import { Typography } from "@material-ui/core";

export default function PrivilegePicker(props) {
	const generalPrivileges=[
		{title:"Model Management", value:"model"},
		{title:"Global Asset Management", value:"asset"},
		{title:"Auditing", value:"audit"},
		{title:"Power Management", value:"power"},
		{title:"Administrator", value:"admin"},
	]

	var defaultPrivs = [];
	var defaultDCs = [];

	if(props.defaultPrivileges !== undefined) {
		if (props.defaultPrivileges.Model) {
			defaultPrivs.push(generalPrivileges[0]);
		}
		if (props.defaultPrivileges.Asset) {
			defaultPrivs.push(generalPrivileges[1]);
		}
		if (props.defaultPrivileges.Audit) {
			defaultPrivs.push(generalPrivileges[2]);
		}
		if (props.defaultPrivileges.Power) {
			defaultPrivs.push(generalPrivileges[3]);
		}
		if (props.defaultPrivileges.admin) {
			defaultPrivs.push(generalPrivileges[4]);
		}

		defaultDCs = props.defaultPrivileges.datacenters
	}

	return (
		<span>
			<Typography>Privileges</Typography>
			<Autocomplete
				multiple
				id="tags-standard"
				getOptionLabel={option => option.title}
				options={generalPrivileges}
				onChange={props.updatePrivilege}
				defaultValue={defaultPrivs}
				renderInput={params => (
				<TextField
					{...params}
					variant="standard"
					label="General Privileges"
					fullWidth
				/>
				)}
			/>
			{props.loading ? <CircularProgress /> :
			<Autocomplete
				multiple
				id="tags-standard"
				options={props.dcPrivileges}
				onChange={props.updateDCPrivilege}
				defaultValue={defaultDCs}
				renderInput={params => (
				<TextField
					{...params}
					variant="standard"
					label="Datacenter Asset Privileges"
					fullWidth
				/>
				)}
			/>}
		</span>
	)

}
