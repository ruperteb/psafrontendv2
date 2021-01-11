import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import './index.css';
import App from './App';
import { Customizer, mergeStyles } from 'office-ui-fabric-react';

import { AUTH_TOKEN } from './constants'
import { resolvers, typeDefs } from './resolvers';

import {
  ApolloClient,
  InMemoryCache,
  gql,
  NormalizedCacheObject,
  ApolloProvider,
  ApolloLink,
  HttpLink, useQuery
} from '@apollo/client';


import { cache } from './cache/cache';

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link: new HttpLink({
    uri: "https://psabackendv2.herokuapp.com/",
    credentials: 'include',
    headers: {
      authorization: localStorage.getItem('token'),
    },
   /*  fetchOptions: {
      mode: 'no-cors',
    }, */
  }),
 
  typeDefs,
  resolvers: {},


  
});



// Inject some global styles
mergeStyles({
  selectors: {
    ':global(body), :global(html), :global(#root)': {
      margin: 0,
      padding: 0,
      height: '100vh'
    }
  }
});


ReactDOM.render(
  <React.StrictMode>
  <ApolloProvider client={client}>
    <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
