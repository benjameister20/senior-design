import React from "react";
import Login from "./Login";
import TabManager from "./TabManager";

export default class PageSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      token:'',
      privilege:'',
      loggedIn:false,
    };

    this.login = this.login.bind(this);
  }

  login(token, privilege) {
    this.setState({
      token:token,
      privilege:privilege,
      loggedIn:true,
    })
  }

  render() {
    return (
      <div>
        {this.state.loggedIn ?  <TabManager  token={this.props.token} privilege={this.props.privilege} /> : <Login loginFunc={this.login} />}
      </div>
    );
  }

}
