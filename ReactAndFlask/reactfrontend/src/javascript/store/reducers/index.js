import {
	combineReducers
} from "redux";

import usersReducer from "./users/usersReducer";
import statusReducer from "./status/statusReducer";

const rootReducer = combineReducers({
	/**
	 * add all reducers here in form
	 * reducer1,
	 * reducer2,
	 * ...
	 */
	usersReducer,
	statusReducer,
})

export default rootReducer;
