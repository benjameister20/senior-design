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
	const [state, setState] = React.useState(false);

	const handleChange = name => event => {
		console.log("handling change");
		setState({ ...state, [name]: event.target.checked });
		console.log("updating props");
		props.updatePrivilege(name, event.target.checked);
	  };

	const generalPrivileges=[
		"Model",
		"Audit",
		"Power",
		"Admin",
	]

	return (
		<span>
			<Typography>Privileges</Typography>
			<Autocomplete
				multiple
				id="tags-standard"
				options={generalPrivileges}
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
				renderInput={params => (
				<TextField
					{...params}
					variant="standard"
					label="Datacenter Asset Privileges"
					fullWidth
				/>
				)}
			/>}
			{/* <List
				style={{
					maxHeight: "100px",
					overflow: "auto",
					flexGrow:1,
				}}
			>
				{props.loading ? <CircularProgress /> :
				props.privileges.map(privilege => {
					return (
					<ListItem role={undefined} dense>
						<FormControlLabel
							control={<Checkbox checked={state.privilege} onChange={handleChange(privilege)} value={privilege} color="primary" />}
							label={privilege}
						/>
					</ListItem>
					);
				})}
			</List> */}
		</span>
	)

}
