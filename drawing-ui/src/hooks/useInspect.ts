import { useSetChain } from "@web3-onboard/react";

import { Network } from "../shared/types";

import configFile from "../config/config.json";
import { useMemo } from "react";
import { ethers } from "ethers";
import pako from "pako";

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
  const inspectCall = async (queryStr: string) => {
    if (!inspectUrl) return;
    console.log(`Network inspect url: ${inspectUrl}${queryStr}`);
    const response = await fetch(`${inspectUrl}${queryStr}`);
    if (response.status == 200) {
      const result = await response.json();
      for (const i in result.reports) {
        let output = result.reports[i].payload;
        let compressedData;
        console.log(output);
        // try {
        //   // output = ethers.utils.toUtf8String(output);
        //   // console.log(JSON.parse(output));
        //   // return JSON.parse(output);
        // } catch (e) {
        //   // cannot decode hex payload as a UTF-8 string
        //   console.log(e);
        // }
        if (output) {
          try {
            compressedData = ethers.utils.arrayify(output);
          } catch (e) {
            console.log(e);
          }
        } else {
          output = "(empty)";
        }
        if (compressedData) {
          try {
            const drawingsData = pako.inflate(compressedData, {
              to: "string",
            });
            console.log(drawingsData);
            return JSON.parse(drawingsData);
          } catch (e) {
            console.log(e);
          }
        }
      }
    } else {
      const errMessage = JSON.stringify(await response.text());
      console.log(errMessage);
    }
  };
  return { inspectCall };
};
