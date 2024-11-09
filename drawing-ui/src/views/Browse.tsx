import { useEffect } from "react";
import Page from "../layouts/Page";
import ImagesListRollups from "../components/ImagesRollups";
import ReactGA from "react-ga4";
import { GA4_ID } from "../shared/constants";

const Browse = () => {
  useEffect(() => {
    ReactGA.initialize(GA4_ID);
    ReactGA.send({
      hitType: "pageview",
      page: "/browse",
      title: "Browse Drawings",
    });
  }, []);

  return (
    <>
      <Page>
        <div className="mb-6 rounded-xl bg-card p-6">
          <ImagesListRollups />
        </div>
      </Page>
    </>
  );
};

export default Browse;
