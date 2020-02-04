import React from "react";
import Login from "./Login";
import TabViewer from "./Tabs";
import axios from 'axios';
import getURL from './helpers/functions/GetURL';

const storedToken = 'token';
const storedPrivilege = 'privilege';
const storedLoggedIn = 'loggedIn';

export default class PageSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      token:sessionStorage.getItem(storedToken) || '',
      privilege:sessionStorage.getItem(storedPrivilege) || '',
      loggedIn:sessionStorage.getItem(storedLoggedIn) || '',
    };

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  login(token, privilege) {
    sessionStorage.setItem(storedToken, token);
    sessionStorage.setItem(storedPrivilege, privilege);
    sessionStorage.setItem(storedLoggedIn, true);

    this.setState({
      token:token,
      privilege:privilege,
      loggedIn:true,
    })
  }

  logout() {
    axios.get(getURL('users/', 'logout'));

    this.setState({
      token:'',
      privilege:'',
      loggedIn:false,
    });

    window.location.reload();
  }

  render() {
    return (
      <div>
        {this.state.loggedIn ?  <TabViewer token={this.state.token} privilege={this.state.privilege} logout={this.logout} /> : <Login loginFunc={this.login} />}
      </div>
    );
  }

}
