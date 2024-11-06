import { BigNumber } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { useSetChain } from "@web3-onboard/react";
import { useVoucherQuery } from "../../generated/graphql";
import { useRollups } from "../../hooks/useRollups";
import configFile from "../../config/config.json";
import {
  VoucherExtended,
  Network,
  DrawingInputExtended,
} from "../../shared/types";
import { Button } from "../ui/button";
import CanvasSnapshotLight from "../ImagesRollups/CanvasSnapshotLight";
import CanvasSnapshotLoader from "../ImagesRollups/CanvasSnapshotLoader";
import { ETHER_TRANSFER_SELECTOR, MINT_SELECTOR } from "../../shared/constants";

type VoucherProp = {
  voucherData: VoucherExtended;
  drawing: DrawingInputExtended;
  selector?: string;
};

const config: { [name: string]: Network } = configFile;

const Voucher = ({ voucherData, drawing }: VoucherProp) => {
  const [{ connectedChain }] = useSetChain();
  const [voucher, setVoucher] = useState(voucherData);
  const [voucherToFetch, setVoucherToFetch] = useState([0, 0]);
  // run on getProof to update voucher proof
  const [voucherResult, reexecuteVoucherQuery] = useVoucherQuery({
    variables: {
      voucherIndex: voucherToFetch[0],
      inputIndex: voucherToFetch[1],
    },
  });
  /**
   * once voucher has proof - on page load or after getProof is run
   * it becomes the `voucherToExecute`
   */
  const [loading, setLoading] = useState(false); // use for disable button @TODO
  const [wasExecuted, setWasExecuted] = useState<null | boolean>(null); // check on page load and after executeVoucher is run

  if (!connectedChain) return;
  const { contracts, executeVoucher } = useRollups(
    config[connectedChain.id].DAppAddress,
  );

  const handleVoucherDisplay = (
    data: VoucherExtended,
    drawing: DrawingInputExtended,
  ) => {
    switch (data.selector) {
      case MINT_SELECTOR:
        return drawing ? (
          <div className="w-1/2 border p-2">
            <CanvasSnapshotLight data={drawing} />
          </div>
        ) : (
          <CanvasSnapshotLoader />
        );
      case ETHER_TRANSFER_SELECTOR:
        return <div className="w-1/2 p-2">{data.info}</div>;
      default:
        break;
    }
  };

  const recheckVoucherStatus = async (voucher: any) => {
    if (contracts) {
      const result = await contracts.dappContract.wasOutputExecuted(
        BigNumber.from(voucher.index),
      );
      setWasExecuted(result);
    }
  };
  const handleExecuteVoucher = async () => {
    setLoading(true);
    const newVoucherExecuted = await executeVoucher(voucher);
    setWasExecuted(newVoucherExecuted);
    setLoading(false);
  };
  const getProof = async (voucher: VoucherExtended) => {
    setVoucherToFetch([voucher.index, voucher.input.index]);
    reexecuteVoucherQuery({ requestPolicy: "network-only" });
    // @TODO add message if proof is still falsy - as a button label or toast or dissapearing message
    setVoucher({
      ...voucher, // Copy the old fields
      proof: voucherResult.data?.voucher.proof, // But override this one
      payload: voucherResult.data?.voucher.payload || "", // But override this one
    });
  };

  useEffect(() => {
    recheckVoucherStatus(voucher);
  }, [contracts]);

  return (
    <div className="my-4 flex flex-col justify-between gap-6 border-b-2 pb-4">
      <div className="flex">
        {handleVoucherDisplay(voucher, drawing)}

        <div className="flex w-1/2 flex-row items-center justify-end gap-3">
          {/* @TODO check proof */}
          {!voucher.proof && (
            <button
              className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={() => getProof(voucher)}
            >
              Check status
            </button>
          )}
          {voucher.proof && wasExecuted && (
            <span className="font-medium text-green-700">
              Voucher executed!
            </span>
          )}
          {voucher.proof && wasExecuted === false && (
            <Button
              onClick={handleExecuteVoucher}
              className="rounded-lg bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              {loading ? "Minting" : "Mint"}
            </Button>
          )}
          {/* @TODO add info for NFT minted  */}
          {/* {voucherToExecute && voucherToExecute.msg && (
          <div className="mt-3 text-sm">
          {loading ? (
            <span>Minting NFT, please wait...</span>
          ) : (
            <>
              {voucherToExecute.msg && <p>{voucherToExecute.msg}</p>}
              {voucherToExecute.events?.address && (
                <>
                  <p className="mt-2">
                    Use this data to import your NFT to MetaMask
                  </p>
                  <dl className="mt-2">
                    <dt className="font-semibold">NFT Address</dt>
                    <dd>{voucherToExecute.events.address}</dd>
                  </dl>
                  <dl className="mt-2">
                    <dt className="font-semibold">NFT ID#</dt>
                    <dd>{voucherToExecute.events.nft_id}</dd>
                  </dl>
                </>
              )}
            </>
          )} */}
        </div>
      </div>
    </div>
  );
};
export default Voucher;
