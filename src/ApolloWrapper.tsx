import React, { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";

import {
    ApolloClient,
    InMemoryCache,
    gql,
    NormalizedCacheObject,
    ApolloProvider,
    ApolloLink,
    HttpLink, useQuery,
} from '@apollo/client';
import { setContext } from "@apollo/client/link/context"

import { cache } from './cache/cache';
import { resolvers, typeDefs } from './resolvers';

interface Props {

    children: React.ReactNode

}
const ApolloWrapper: React.FC<Props> = ({ children }) => {

    const { isAuthenticated, getAccessTokenSilently } = useAuth0()
    const [bearerToken, setBearerToken] = useState("")

    useEffect(() => {
        const getToken = async () => {

            try {
                const token = await getAccessTokenSilently();
                setBearerToken(token);
            } catch (e) {
                console.log(e.message);
            }
        }
        getToken()
    }, [getAccessTokenSilently, isAuthenticated])

const httpLink = new HttpLink({
    uri: "https://psabackendv2.herokuapp.com/",
    credentials: 'include',
    /* headers: {
        authorization: localStorage.getItem('token'),
    }, */
    /*  fetchOptions: {
       mode: 'no-cors',
     }, */
})

const authLink = setContext((_, { headers, ...rest }) => {
    if (bearerToken)
        return {
            ...rest,
            headers: {
                ...headers,
                authorization: `Bearer: ${bearerToken}`
            }
        }
})

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    cache,
    link: authLink.concat(httpLink),
    typeDefs,
    resolvers: {},
});

return <ApolloProvider client={client}>{children}</ApolloProvider>

}

export default ApolloWrapper