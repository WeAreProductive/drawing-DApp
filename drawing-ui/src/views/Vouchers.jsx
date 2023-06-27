import Page from "../layouts/Page";
import VouchersList from "../components/VouchersList";
import { GraphQLProvider } from "../context/GraphQLContext";

//@TODO move to components - vauchersList or smth ... @TODO graphql setup?
const Vouchers = () => {
  return (
    <GraphQLProvider>
      <Page>
        <VouchersList />
      </Page>
    </GraphQLProvider>
  );
};

export default Vouchers;
//
