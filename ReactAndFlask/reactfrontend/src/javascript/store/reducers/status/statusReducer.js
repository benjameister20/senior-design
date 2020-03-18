import { StatusActionTypes } from "../../actions/status/statusTypes.ts"
import * as UserConstants from "../../../users/UserConstants";

const initailState = {
	open:false,
	message:"",
	severity:"",
};

export default function (state=initailState, action) {
	switch(action.type) {
		case StatusActionTypes.OPEN:
			return {
				...state,
				open:true,
				message:action.payload.message,
				severity:action.payload.severity,
			}
		case StatusActionTypes.CLOSE:
			return {
				...state,
				open:false,
				message:"",
				severity:action.payload.severity,
			}
		default:
			return state;
	}
}
