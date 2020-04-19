import React from 'react'

import {
	Grid
} from "@material-ui/core"

export default function Rack(props) {

	return (
		<div>
				<div>{props.title}</div>
			{props.rackVals.map(rack => (
				[
					<div>{rack.index + " "}</div>,
					<div style={"background-color:" + rack.color}>{rack.title}</div>,
					<div>{" " + rack.index}</div>
				]
			))}
		</div>
	)
}
