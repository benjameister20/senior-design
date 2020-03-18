import axios from "axios";

import { UserActionTypes } from "./userTypes.ts";
import getURL from "../../../helpers/functions/GetURL";
import makeCreateJSON from "../../../users/helpers/functions/MakeCreateJSON";
import makeDeleteJSON from "../../../users/helpers/functions/MakeDeleteJSON";
import makeEditJSON from "../../../users/helpers/functions/MakeEditJSON";
import makeDetailViewJSON from "../../../users/helpers/functions/MakeDetailViewJSON";
import * as Constants from "../../../Constants";
import { PrivilegeCommand } from "../../../users/enums/PrivilegeCommands.ts";
import { UserCommand } from "../../../users/enums/UserCommands.ts";

export const getPrivileges = () => dispatch => {
	axios.get(getURL(Constants.PERMISSIONS_MAIN_PATH, PrivilegeCommand.GET_PRIVILEGES)).then(
		response => dispatch({
			type: UserActionTypes.GET_PRIVILEGES,
			payload: response,
		}));
}

export const createUser = (username, password, display_name, email, privileges) => dispatch => {
	axios.post(
		getURL(Constants.USERS_MAIN_PATH, UserCommand.create),
		makeCreateJSON(username, password, display_name, email, privileges)
		).then(response => dispatch({
			type: UserActionTypes.CREATE,
			payload: response,
		}));
}

export const editUser = (originalUsername, username, password, display_name, email, privileges) => dispatch => {
	axios.post(
		getURL(Constants.USERS_MAIN_PATH, UserCommand.edit),
		makeEditJSON(originalUsername, username, password, display_name, email, privileges)
		).then(response => dispatch({
			type: UserActionTypes.EDIT,
			payload: response,
		}));
}

export const deleteUser = (username) => dispatch => {
	axios.post(
		getURL(Constants.USERS_MAIN_PATH, UserCommand.delete),
		makeDeleteJSON(username)
		).then(response => dispatch({
			type: UserActionTypes.DELETE,
			payload: response,
		}));
}

export const detailViewUser = (username) => dispatch => {
	axios.post(
		getURL(Constants.USERS_MAIN_PATH, UserCommand.detailView),
		makeDetailViewJSON(username)
		).then(response => dispatch({
			type: UserActionTypes.DETAIL_VIEW,
			payload: response,
		}));
}

export const searchUsers = (filters) => dispatch => {
	axios.post(
		getURL(Constants.USERS_MAIN_PATH, UserCommand.search),
		filters
		).then(response => dispatch({
			type: UserActionTypes.SEARCH,
			payload: response,
		}));
}

export const showDetailedView = (id) => dispatch => {
	dispatch({
		type: UserActionTypes.SHOW_DETAIL_VIEW,
		payload: id,
	});
}

export const closeDetailedView = () => dispatch => {
	dispatch({
		type: UserActionTypes.CLOSE_DETAIL_VIEW,
		payload: false,
	});
}

export const updateUserEdited = (event) => dispatch => {
	dispatch({
		type: UserActionTypes.UPDATE_USER_EDITED,
		payload: event,
	});
}

export const closeShowStatus = () => dispatch => {
	dispatch({
		type: UserActionTypes.CLOSE_SHOW_STATUS,
		payload: false,
	});
}
