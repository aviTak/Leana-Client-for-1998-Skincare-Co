import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { InMemoryCache } from 'apollo-boost';

// Apollo Client Setup

const client = new ApolloClient({
  uri: 'https://server.1998skincareco.com',
  credentials: 'include',
  cache: new InMemoryCache({
      addTypename: false
   })
});

ReactDOM.render(
 <ApolloProvider client = {client}>
    <App />
 </ApolloProvider>,
    document.getElementById('root')
);

serviceWorker.unregister();
