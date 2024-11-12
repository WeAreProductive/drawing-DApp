import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./views/Draw";
import Contests from "./views/BrowseContests";
import Browse from "./views/BrowseDrawings";
import ErrorPage from "./views/Error";
import { Toaster } from "./components/ui/sonner";
import { ConnectionContextProvider } from "./context/ConnectionContext";
import { CanvasContextProvider } from "./context/CanvasContext";
import CreateContest from "./views/CreateContest";
import Contest from "./views/Contest";
import { ContestContextProvider } from "./context/ContestContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "drawing",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: ":uuid",
            element: <Root />,
            errorElement: <ErrorPage />,
          },
        ],
      },
    ],
  },
  {
    path: "contests",
    element: <Contests />,
    errorElement: <ErrorPage />,
  },
  {
    path: "contest",
    errorElement: <ErrorPage />,
    children: [
      {
        path: "create",
        element: <CreateContest />,
        errorElement: <ErrorPage />,
      },
      {
        path: ":contestId",
        element: <Contest />,
        errorElement: <ErrorPage />,
      },
    ],
  },

  {
    path: "/browse",
    element: <Browse />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <>
    <ConnectionContextProvider>
      <ContestContextProvider>
        <CanvasContextProvider>
          <RouterProvider router={router} />
          <Toaster position="top-center" />
        </CanvasContextProvider>
      </ContestContextProvider>
    </ConnectionContextProvider>
  </>,
);
