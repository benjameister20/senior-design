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
		{title:"Model Management", value:"Model"},
		{title:"Global Asset Management", value:"Asset"},
		{title:"Auditing", value:"Audit"},
		{title:"Power Management", value:"Power"},
		{title:"Administrator", value:"Admin"},
	]

	return (
		<span>
			<Typography>Privileges</Typography>
			<Autocomplete
				multiple
				id="tags-standard"
				getOptionLabel={option => option.title}
				options={generalPrivileges}
				onChange={props.updatePrivilege}
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
