import Page from "../layouts/Page";
import VouchersList from "../components/VouchersList";
import { GraphQLProvider } from "../context/GraphQLContext";

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
