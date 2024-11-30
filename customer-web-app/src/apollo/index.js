import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  Observable,
  split,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import ConfigurableValues from "../config/constants";

const setupApollo = () => {
  const { SERVER_URL, WS_SERVER_URL } = ConfigurableValues();
  const cache = new InMemoryCache();

  // HTTP Link for Queries and Mutations
  const httpLink = new HttpLink({
    uri: `${SERVER_URL}graphql`,
  });

  // WebSocket Link for Subscriptions
  const wsLink = new GraphQLWsLink(
    createClient({
      url: `${WS_SERVER_URL}graphql`, // WebSocket URL
      connectionParams: () => {
        const token = localStorage.getItem("token");
        return {
          Authorization: token ? `Bearer ${token}` : "",
        };
      },
    })
  );

  // Request Middleware for Authorization
  const request = async (operation) => {
    const token = localStorage.getItem("token");
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : "",
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

  // Split Link: Route Subscriptions to WebSocket and Others to HTTP
  const splitLink = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === "OperationDefinition" && operation === "subscription";
    },
    wsLink, // WebSocket for subscriptions
    httpLink // HTTP for queries and mutations
  );

  // Apollo Client Instance
  const client = new ApolloClient({
    link: ApolloLink.from([requestLink, splitLink]),
    cache,
    resolvers: {},
    connectToDevTools: true,
  });

  return client;
};

export default setupApollo;
