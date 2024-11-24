import React from 'react';
import ReactDOM from 'react-dom';
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  concat,
  createHttpLink,
  Observable,
  split,
} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import 'firebase/messaging';
import ConfigurableValues from './config/constants';
import { ConfigurationProvider } from './context/Configuration';
import App from './app';
import { RestProvider } from './context/Restaurant';
import { ThemeProvider, StyledEngineProvider } from '@mui/material';
import theme from './utils/theme';

function Main() {
  const { SERVER_URL, WS_SERVER_URL } = ConfigurableValues();

  const cache = new InMemoryCache();

  // HTTP Link for Queries and Mutations
  const httpLink = createHttpLink({
    uri: `${SERVER_URL}/graphql`,
  });

  // WebSocket Link for Subscriptions using graphql-ws
  const wsLink = new GraphQLWsLink(
    createClient({
      url: `${WS_SERVER_URL}/graphql`,
      connectionParams: {
        authToken: localStorage.getItem('authToken'), // Example: Include auth token
      },
    })
  );

  // Request middleware to add Authorization Header
  const request = async(operation) => {
    const data = localStorage.getItem('user-enatega');
    let token = null;

    if (data) {
      token = JSON.parse(data).token;
    }

    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    });
  };

  const requestLink = new ApolloLink(
    (operation, forward) =>
      new Observable((observer) => {
        let handle;
        Promise.resolve(operation)
          .then((oper) => request(oper))
          .then(() => {
            handle = forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            });
          })
          .catch(observer.error.bind(observer));

        return () => {
          if (handle) handle.unsubscribe();
        };
      })
  );

  // Split the traffic based on the operation type
  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink, // Use WebSocket for subscriptions
    httpLink // Use HTTP for queries and mutations
  );

  const client = new ApolloClient({
    link: concat(ApolloLink.from([requestLink]), splitLink),
    cache,
    resolvers: {},
    connectToDevTools: true,
  });

  return (
    <ApolloProvider client={client}>
      <ConfigurationProvider>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <RestProvider>
              <App />
            </RestProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </ConfigurationProvider>
    </ApolloProvider>
  );
}
// eslint-disable-next-line react/no-deprecated
ReactDOM.render(<Main />, document.getElementById('root'));
