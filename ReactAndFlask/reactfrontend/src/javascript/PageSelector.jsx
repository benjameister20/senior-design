import React from "react";
import Login from "./Login";
import TabViewer from "./Tabs";
import axios from 'axios';
import getURL from './helpers/functions/GetURL';

const storedToken = 'token';
const storedPrivilege = 'privilege';
const storedLoggedIn = 'loggedIn';
const storedUsername = 'username';

export default class PageSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      token:sessionStorage.getItem(storedToken) || '',
      privilege:sessionStorage.getItem(storedPrivilege) || '',
      loggedIn:sessionStorage.getItem(storedLoggedIn) || '',
      username:sessionStorage.getItem(storedUsername) || '',
    };

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  login(token, username, privilege) {
    sessionStorage.setItem(storedToken, token);
    sessionStorage.setItem(storedPrivilege, privilege);
    sessionStorage.setItem(storedLoggedIn, true);
    sessionStorage.setItem(storedUsername, username);

    this.setState({
      token:token,
      privilege:privilege,
      loggedIn:true,
      username: username,
    })
  }

  logout() {
    axios.get(getURL('users/', 'logout'));

    this.setState({
      token:'',
      privilege:'',
      loggedIn:false,
      username:'',
    });

    sessionStorage.removeItem(storedToken);
    sessionStorage.removeItem(storedPrivilege);
    sessionStorage.removeItem(storedLoggedIn);
    sessionStorage.removeItem(storedUsername);

    window.location.reload();
  }

  render() {
    return (
      <div>
        {this.state.loggedIn ?  <TabViewer token={this.state.token} username={this.state.username} privilege={this.state.privilege} logout={this.logout} /> : <Login loginFunc={this.login} shib={this.props.redirected}/>}
      </div>
    );
  }

}
