import { ethers } from "ethers";

import { useQueryClient, useQuery } from "@tanstack/react-query";
import { zeroAddress } from "../shared/constants";

type Address = `0x${string}`;
export const balanceKeys = {
  base: ["balance"] as const,
  details: () => [...balanceKeys.base, "detail"] as const,
  detail: (id: Address) => [...balanceKeys.details(), id] as const,
};
const createError = (message: string) => Promise.reject(new Error(message));

const fetchBalance = async (account?: Address) => {
  if (account === undefined || account === null) return 0;

  const url = `http://localhost:8080/inspect/balance/${account}`;

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
export const useGetBalance = (account: Address) => {
  return useQuery({
    queryKey: balanceKeys.detail(account ?? zeroAddress),
    queryFn: () => fetchBalance(account),
    refetchInterval: 20 * 1000,
    refetchIntervalInBackground: true,
  });
};
