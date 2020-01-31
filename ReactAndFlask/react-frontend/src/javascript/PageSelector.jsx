import React from "react";
import Login from "./Login";
import TabManager from "./TabManager";

export default class PageSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      token:'',
      loggedIn:false,
    };

    this.login = this.login.bind(this);
  }

  login(token, privilege) {
    this.setState({
      token:token,
      loggedIn:true,
    })
  }

  render() {
    return (
      <div>
        {this.state.loggedIn ?  <TabManager token={this.state.token} /> : <Login loginFunc={this.login} />}
      </div>
    );
  }

}
