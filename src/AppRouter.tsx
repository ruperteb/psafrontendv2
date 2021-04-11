import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";

import { useAuth0 } from "@auth0/auth0-react";

import App from "./App"
import Login from "./components/Login"

export default function AppRouter() {

    const { isAuthenticated } = useAuth0();

    return (
        <Router>

            <Switch>
                <Route path="/login">
                {isAuthenticated? <Redirect to="/main" /> : <Login></Login> }
                   
                </Route>
                <Route path="/main">
                    <App></App>
                </Route>
                <Route path="/">
                    {isAuthenticated? <Redirect to="/main" /> : <Redirect to="/login" /> }
                    
                </Route>
            </Switch>

        </Router>
    );
}