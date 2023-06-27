import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Root from "./views/Draw";
import Vouchers from "./views/Vouchers";
import ErrorPage from "./views/Error";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/vouchers",
    element: <Vouchers />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <ChakraProvider>
    <RouterProvider router={router} />
  </ChakraProvider>
);
