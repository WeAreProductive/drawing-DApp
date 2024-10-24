import { useSetChain, useWallets } from "@web3-onboard/react";
import { Network } from "../shared/types";
import configFile from "../config/config.json";
import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
const config: { [name: string]: Network } = configFile;

const createError = (message: string) => Promise.reject(new Error(message));

// HOOKS

export const useGetBalance = () => {
  const [{ connectedChain }] = useSetChain();
  const [connectedWallet] = useWallets();

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
  const account = useMemo(() => {
    if (!connectedWallet) {
      return null;
    }
    return connectedWallet.accounts[0].address;
  }, [connectedWallet]);
  const fetchBalance = async () => {
    if (!account) return 0;
    const url = `${inspectUrl}balance/${account}`;
    const response = await fetch(url);
    if (!response.ok) {
      return createError(`Network response error - ${response.status}`);
    }
    const result = await response.json();
    for (const i in result.reports) {
      let output = result.reports[i].payload;
      let data;
      try {
        data = ethers.utils.toUtf8String(output);
      } catch (e) {
        data = output + " (hex)";
      }
      return data;
    }
  };

  return { fetchBalance };
};
