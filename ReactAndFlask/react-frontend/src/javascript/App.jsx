import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Login from "./components/Login.jsx";
import HomePage from "./components/Homepage.jsx";

export default function App() {
  return (
    <Router>
        <Switch>
          <Route path="/">
            <Login />
          </Route>
          <Route path="/homepage">
            <HomePage />
          </Route>
        </Switch>
    </Router>
  );
}
