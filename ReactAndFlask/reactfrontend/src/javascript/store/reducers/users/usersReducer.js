import { UserActionTypes } from "../../actions/users/userTypes.ts"
import * as UserConstants from "../../../users/UserConstants";

const initailState = {
	items:[],
	statusOpen:false,
	statusSeverity:'',
	statusMessage:'',
	searchUsernm:'',
	searchEml:'',
	searchDspNm:'',
	searchPriv:'',
	deleteUsername:'',
	viewUser:'',
	csvData:[],
	showDetailedView: false,
	detailViewLoading:false,
	originalUsername:'',
	allDCPrivileges:[],
	loadingPrivileges:true,
};

export default function (state=initailState, action) {
	switch(action.type) {
		case UserActionTypes.GET_PRIVILEGES:
			return {
				...state,
				allDCPrivileges: action.payload.data.privileges.Datacenters,
				loadingPrivileges:false,
			}
		case UserActionTypes.CREATE:
			if (action.payload.data.message === UserConstants.USER_SUCCESS_TOKEN) {
				return {
					...state,
					statusOpen:true,
					statusMessage:UserConstants.USER_CREATION_SUCCESS_MESSAGE,
					statusSeverity:UserConstants.USER_SUCCESS_TOKEN
				}
			} else {
				return {
					...state,
					statusOpen:true,
					statusMessage:action.payload.data.message,
					statusSeverity:UserConstants.USER_FAILURE_TOKEN
				}
			}
		case UserActionTypes.EDIT:
			if (action.payload.data.message === UserConstants.USER_SUCCESS_TOKEN) {
				return {
					...state,
					statusOpen:true,
					statusMessage:UserConstants.USER_EDIT_SUCCESS_MESSAGE,
					statusSeverity:UserConstants.USER_FAILURE_TOKEN
				}
			} else {
				return {
					...state,
					statusOpen:true,
					statusMessage:action.payload.data.message,
					statusSeverity:UserConstants.USER_FAILURE_TOKEN
				}
			}
		case UserActionTypes.DELETE:
			if (action.payload.data.message === UserConstants.USER_SUCCESS_TOKEN) {
				return {
					...state,
					statusOpen:true,
					statusMessage:UserConstants.USER_DELETE_SUCCESS_MESSAGE,
					statusSeverity:UserConstants.USER_FAILURE_TOKEN
				}
			} else {
				return {
					...state,
					statusOpen:true,
					statusMessage:action.payload.data.message,
					statusSeverity:UserConstants.USER_FAILURE_TOKEN
				}
			}
		case UserActionTypes.DETAIL_VIEW:
			return {
				...state,
				detailedValues: action.payload.data['user'],
				detailViewLoading: false,
			}
		case UserActionTypes.SEARCH:
			const columnLookup = {
				"username": "Username",
				"email": "Email",
				"display_name": "Display Name",
				'privilege': 'Privilege'
			}

			const models = action.payload.data['users'] === undefined ? [] : action.payload.data['users'];
			var rows = [];
			Object.values(models).forEach(model => {
				var row = {};
				Object.keys(model).forEach(key => {
					if (key in columnLookup) {
						row[columnLookup[key]] = model[key];
					} else {
						row[key] = model[key];
					}
				});
				rows.push(row);
			});
			return {
				...state,
				items: rows
			}
		case UserActionTypes.SHOW_DETAIL_VIEW:
			return {
				showDetailedView: true,
				detailViewLoading:true,
				originalUsername:this.state.items[action.payload]['username'],
			}
		case UserActionTypes.CLOSE_DETAIL_VIEW:
			return {
				...state,
				showDetailedView: false,
			}
		case UserActionTypes.UPDATE_USER_EDITED:
			const newDetails = state.detailedValues;
			newDetails[action.payload.target.name] = action.payload.target.value;
			return {
				...state,
				detailedValues: newDetails
			}
		case UserActionTypes.CLOSE_SHOW_STATUS:
			return {
				...state,
				statusOpen: false
			}
		default:
			return state;
	}
}
