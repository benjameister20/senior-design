import React from "react";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export default function PrivilegePicker(props) {
	const [state, setState] = React.useState(false);

	const handleChange = name => event => {
		setState({ ...state, [name]: event.target.checked });
	  };

	return (
		<List
			subheader={
				<ListSubheader component="div" id="nested-privilege-selecter">
					Privileges
				</ListSubheader>
			}
			style={{
				maxHeight: "30vh",
				overflow: "auto",
			}}
		>
			{props.privileges.map(privilege => {
				return (
				<ListItem role={undefined} dense>
					<FormControlLabel
						control={<Checkbox checked={state.privilege} onChange={handleChange(privilege)} value={privilege} color="primary" />}
						label={privilege}
					/>
				</ListItem>
				);
			})}
		</List>
	)

}
