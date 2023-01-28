import React, { useEffect, useState, useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import {
  ApolloClient,
  InMemoryCache,
  gql,
  NormalizedCacheObject,
  ApolloProvider,
  ApolloLink,
  HttpLink,
  useQuery,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import { cache } from "./cache/cache";
import { resolvers, typeDefs } from "./resolvers";
import { AuthContext } from "./AuthContext";

interface Props {
  children: React.ReactNode;
}
const ApolloWrapper: React.FC<Props> = ({ children }) => {
  /* const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [bearerToken, setBearerToken] = useState(""); */

  const { token } = useContext(AuthContext);

  /* useEffect(() => {
    const getToken = async () => {
      try {
        const token = await getAccessTokenSilently();
        setBearerToken(token);
      } catch (e) {
        console.log(e.message);
      }
    };
    getToken();
  }, [getAccessTokenSilently, isAuthenticated]); */

  const httpLink = new HttpLink({
    uri: process.env.REACT_APP_SERVER_URL /* "http://localhost:4000/" */,
    credentials: "include",

    /* headers: {
        authorization: localStorage.getItem('token'),
    }, */
    /*  fetchOptions: {
       mode: 'no-cors',
     }, */
    /* fetchOptions: {
      mode: "no-cors",
    }, */
  });

  const authLink = setContext((_, { headers, ...rest }) => {
    if (token)
      return {
        ...rest,
        headers: {
          ...headers,
          authorization: `Bearer: ${token}`,
          "Apollo-Require-Preflight": "true",
        },
      };
  });

  const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    cache,
    link: authLink.concat(httpLink),
    typeDefs,
    resolvers: {},
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloWrapper;
