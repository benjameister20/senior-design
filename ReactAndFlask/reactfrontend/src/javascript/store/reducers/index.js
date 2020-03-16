import {
	combineReducers
} from "redux";

import usersReducer from "./users/usersReducer";

const rootReducer = combineReducers({
	/**
	 * add all reducers here in form
	 * reducer1,
	 * reducer2,
	 * ...
	 */
	usersReducer,
})

export default rootReducer;
