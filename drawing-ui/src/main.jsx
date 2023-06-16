import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { ChakraProvider } from "@chakra-ui/react";
import Root from "./views/Draw";
import Contact from "./views/Vouchers";
import ErrorPage from "./views/Error";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/vouchers",
    element: <Contact />,
  },
]);
//Setup GraphQL Apollo client
const URL_QUERY_GRAPHQL = "http://localhost:4000/graphql";

const client = new ApolloClient({
  uri: URL_QUERY_GRAPHQL,
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </ApolloProvider>
);
