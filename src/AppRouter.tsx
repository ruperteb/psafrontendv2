import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

/* import { useAuth0 } from "@auth0/auth0-react"; */

import App from "./App";
import Login from "./components/Login";
import { AuthContext } from "./AuthContext";

export default function AppRouter() {
  const { authorised } = useContext(AuthContext);

  /*  const { isAuthenticated } = useAuth0(); */

  return (
    <Router>
      <Switch>
        <Route path="/login">
          {authorised ? <Redirect to="/main" /> : <Login></Login>}
        </Route>
        <Route path="/main">
          {authorised ? <App></App> : <Redirect to="/login" />}
        </Route>
        <Route path="/">
          {authorised ? <Redirect to="/main" /> : <Redirect to="/login" />}
        </Route>
      </Switch>
    </Router>
  );
}
