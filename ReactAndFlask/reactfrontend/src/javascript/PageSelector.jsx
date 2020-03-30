import React from "react";

import axios from 'axios';

import Login from "./Login";
import TabViewer from "./Tabs";
import getURL from './helpers/functions/GetURL';
import * as Constants from "./Constants";
import ErrorBoundary from "./errors/ErrorBoundry";

const storedToken = 'token';
const storedPrivilege = 'privilege';
const storedLoggedIn = 'loggedIn';
const storedUsername = 'username';

export default class PageSelector extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			token: sessionStorage.getItem(storedToken) || '',
			privilege: sessionStorage.getItem(storedPrivilege) || '',
			loggedIn: sessionStorage.getItem(storedLoggedIn) || '',
			username: sessionStorage.getItem(storedUsername) || '',
		};

	}

	componentDidMount() {

		axios.defaults.headers.common['token'] = this.state.token;
		axios.defaults.headers.common['privilege'] = this.state.privilege;
	}

	login = (token, username, privilege) => {
		console.log(privilege);
		sessionStorage.setItem(storedToken, token);
		sessionStorage.setItem(storedPrivilege, JSON.stringify(privilege));
		sessionStorage.setItem(storedLoggedIn, true);
		sessionStorage.setItem(storedUsername, username);

		axios.defaults.headers.common['token'] = token;
		axios.defaults.headers.common['privilege'] = privilege;

		this.setState({
			token: token,
			privilege: privilege,
			loggedIn: true,
			username: username,
		});

		window.history.replaceState({}, "Hyposoft Asset Management", "/")
	}

	loginWithOAuth = (token, username, privilege) => {

		sessionStorage.setItem(storedToken, token);
		sessionStorage.setItem(storedPrivilege, privilege);
		sessionStorage.setItem(storedLoggedIn, true);
		sessionStorage.setItem(storedUsername, username);

		axios.defaults.headers.common['token'] = token;
		axios.defaults.headers.common['privilege'] = privilege;

		this.setState({
			token: token,
			privilege: privilege,
			loggedIn: true,
			username: username,
		}, () => { window.history.replaceState({}, "Hyposoft Asset Management", "/") });
	}

	logout = () => {
		axios.get(getURL('users/', 'logout'));

		this.setState({
			token: '',
			privilege: '',
			loggedIn: false,
			username: '',
		});

		sessionStorage.removeItem(storedToken);
		sessionStorage.removeItem(storedPrivilege);
		sessionStorage.removeItem(storedLoggedIn);
		sessionStorage.removeItem(storedUsername);

		window.history.replaceState({}, "Hyposoft Asset Management", "/")
		console.log(window.location.href);
		console.log(Constants.SHIB_REDIRECT_URI);
		//window.location = Constants.SHIB_REDIRECT_URI;
	}

	render() {

		var privilege = "";
		try {
			privilege = JSON.parse(this.state.privilege);
		} catch {
			privilege = this.state.privilege;
		}
		console.log("privilege: ");
		console.log(privilege);

		return (
			<ErrorBoundary>
				<div>
					{this.state.loggedIn ?
						<TabViewer
							token={this.state.token}
							username={this.state.username}
							privilege={privilege}
							logout={this.logout}
						/> :
						<Login
							loginFunc={this.login}
							shib={this.props.redirected}
							loginFuncOAuth={this.loginWithOAuth}
						/>}
				</div>
			</ErrorBoundary>
		);
	}

}
