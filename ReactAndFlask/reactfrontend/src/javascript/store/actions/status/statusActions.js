import { StatusActionTypes } from "./statusTypes.ts";

export const open = (message) => dispatch => {
	dispatch({
		type: StatusActionTypes.OPEN,
		payload: message,
	});
}

export const close = () => dispatch => {
	console.log("closing status");
	dispatch({
		type: StatusActionTypes.CLOSE,
		payload: "",
	});
}
