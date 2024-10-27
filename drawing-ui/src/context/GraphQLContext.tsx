import { useSetChain } from "@web3-onboard/react";
import { useMemo } from "react";
import { Client, createClient, Provider } from "urql";
import { cacheExchange, fetchExchange } from "@urql/core";

import configFile from "../config/config.json";
import { Network } from "../shared/types";

const config: { [name: string]: Network } = configFile;

const useGraphQL = () => {
  const [{ connectedChain }] = useSetChain();
  return useMemo<Client | null>(() => {
    if (!connectedChain) {
      return null;
    }
    let url = "";

    if (config[connectedChain.id]?.graphqlAPIURL) {
      url = `${config[connectedChain.id].graphqlAPIURL}`;
    } else {
      console.error(
        `No GraphQL interface defined for chain ${connectedChain.id}`,
      );
      return null;
    }

    if (!url) {
      return null;
    }

    return createClient({ url, exchanges: [cacheExchange, fetchExchange] });
  }, [connectedChain]);
};

export const GraphQLProvider: any = (props: any) => {
  const client = useGraphQL();
  if (!client) {
    return <div />;
  }

  return <Provider value={client}>{props.children}</Provider>;
};
