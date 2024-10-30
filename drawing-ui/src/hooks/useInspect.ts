import { useSetChain } from "@web3-onboard/react";

import { Network } from "../shared/types";

import configFile from "../config/config.json";
import { useMemo } from "react";
import { ethers } from "ethers";
import pako from "pako";
import { handleCompressedResponse, handlePlainResponse } from "../utils";

const config: { [name: string]: Network } = configFile;

export const useInspect = () => {
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
  /**
   * Sends request to Rollups Inspect service
   * @param queryStr
   * @return notices OutputPayload[]
   */
  const inspectCall = async (queryStr: string, type: string = "compressed") => {
    if (!inspectUrl) return;
    const response = await fetch(`${inspectUrl}${queryStr}`);
    if (response.status == 200) {
      const result = await response.json();
      for (const i in result.reports) {
        // @TODO refractor to abstract the result
        let output = result.reports[i].payload;
        switch (type) {
          case "compressed":
            return handleCompressedResponse(output);
          default:
            return handlePlainResponse(output);
        }
      }
    } else {
      const errMessage = JSON.stringify(await response.text());
      console.error(errMessage);
    }
  };
  return { inspectCall };
};
