import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./views/Draw";
import ErrorPage from "./views/Error";
import { Toaster } from "./components/ui/sonner";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "drawing/:uuid?",
        element: <Root />,
        errorElement: <ErrorPage />, //@TODO add dynamic message drawing not found
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <>
    <RouterProvider router={router} />
    <Toaster position="top-center" />
  </>,
);
