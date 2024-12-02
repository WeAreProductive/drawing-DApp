import { ethers } from "ethers";

import { useQuery } from "@tanstack/react-query";
import { zeroAddress } from "../shared/constants";
import { useSetChain } from "@web3-onboard/react";
import { useMemo } from "react";
import { Address } from "../shared/types";

import configFile from "../config/config.json";

const config: { [name: string]: { [name: string]: string } } = configFile;

export const balanceKeys = {
  base: ["balance"] as const,
  details: () => [...balanceKeys.base, "detail"] as const,
  detail: (id: Address) => [...balanceKeys.details(), id] as const,
};
const createError = (message: string) => Promise.reject(new Error(message));

const fetchBalance = async (inspectUrl: string, account?: Address) => {
  if (account === undefined || account === null || !inspectUrl) return 0;

  const url =
    inspectUrl + encodeURIComponent(encodeURIComponent(`balance/${account}`));

  const response = await fetch(url);

  if (!response.ok) {
    return createError(`Network response error - ${response.status}`);
  }

  const data = await response.json();

  // if (data.status === "Exception")
  //   return createError(hexToString(data.exception_payload));

  const result = ethers.utils.toUtf8String(data.reports[0].payload);
  return +result;
};
export const useGetBalance = (account: Address | null) => {
  const [{ connectedChain }] = useSetChain();
  const inspectUrl = useMemo(() => {
    if (!connectedChain) {
      return null;
    }
    let url = "";

    if (config[connectedChain.id]?.inspectAPIURL) {
      url = `${config[connectedChain.id].inspectAPIURL}`;
    } else {
      console.error(
        `No inspect interface defined for chain ${connectedChain.id}`,
      );
      return null;
    }

    if (!url) {
      return null;
    }

    return url;
  }, [connectedChain]);

  return useQuery({
    queryKey: balanceKeys.detail(account ?? zeroAddress),
    queryFn: () => fetchBalance(inspectUrl, account),
    refetchInterval: 20 * 1000,
    refetchIntervalInBackground: true,
  });
};
