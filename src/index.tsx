import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import AppRouter from "./AppRouter";
import ApolloWrapper from "./ApolloWrapper";
import { Customizer, mergeStyles } from "office-ui-fabric-react";
/* import { Auth0Provider } from "@auth0/auth0-react"; */
import { AuthContextProvider } from "./AuthContext";

import { AUTH_TOKEN } from "./constants";
import { resolvers, typeDefs } from "./resolvers";

/* import {
  ApolloClient,
  InMemoryCache,
  gql,
  NormalizedCacheObject,
  ApolloProvider,
  ApolloLink,
  HttpLink, useQuery
} from '@apollo/client'; */

/* import { cache } from './cache/cache';

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link: new HttpLink({
    uri: "https://psabackendv2.herokuapp.com/",
    credentials: 'include',
    headers: {
      authorization: localStorage.getItem('token'),
    },
    
  }),

  typeDefs,
  resolvers: {},



}); */

// Inject some global styles
mergeStyles({
  selectors: {
    ":global(body), :global(html), :global(#root)": {
      margin: 0,
      padding: 0,
      height: "100vh",
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    {/*   <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN!}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID!}
      audience={process.env.REACT_APP_AUDIENCE}
      redirectUri={`${window.location.origin}/main`}
    > */}
    <AuthContextProvider>
      <ApolloWrapper>
        <AppRouter />
      </ApolloWrapper>
    </AuthContextProvider>
    {/* </Auth0Provider> */}
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
