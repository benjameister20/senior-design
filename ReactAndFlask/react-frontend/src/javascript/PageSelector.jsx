import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Login from "./Login";
import TabManager from "./TabManager";

export default function PageSelector() {
  return (
    <Router>
        <Switch>
          <Route path="/">
            <TabManager />
          </Route>
          <Route path="/homepage">
            <Login />
          </Route>
        </Switch>
    </Router>
  );
}
