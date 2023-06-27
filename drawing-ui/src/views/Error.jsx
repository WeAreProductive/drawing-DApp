import { useRouteError } from "react-router-dom";
import Page from "../layouts/Page";

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <Page>
      <div id="error-page">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
      </div>
    </Page>
  );
};

export default ErrorPage;
