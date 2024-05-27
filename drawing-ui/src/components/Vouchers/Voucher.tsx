import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSetChain } from "@web3-onboard/react";
import { useVoucherQuery } from "../../generated/graphql";
import { useRollups } from "../../hooks/useRollups";
import configFile from "../../config/config.json";
import { VoucherExtended, Network } from "../../shared/types";
import { Button } from "../ui/button";
import CanvasSnapshotLight from "../ImagesRollups/CanvasSnapshotLight";

type VoucherProp = {
  voucherData: VoucherExtended;
};

const config: { [name: string]: Network } = configFile;

const Voucher = ({ voucherData }: VoucherProp) => {
  const [{ connectedChain }] = useSetChain();
  const [voucherToFetch, setVoucherToFetch] = useState([0, 0]);
  const [voucherResult, reexecuteVoucherQuery] = useVoucherQuery({
    variables: {
      voucherIndex: voucherToFetch[0],
      inputIndex: voucherToFetch[1],
    },
  });

  const [voucherToExecute, setVoucherToExecute] = useState<VoucherExtended>();

  const [loading, setLoading] = useState(false);
  if (!connectedChain) return;
  const { contracts, executeVoucher } = useRollups(
    config[connectedChain.id].DAppRelayAddress,
  );

  const getProof = async (voucher: VoucherExtended) => {
    setVoucherToFetch([voucher.index, voucher.input.index]);
    reexecuteVoucherQuery({ requestPolicy: "network-only" });
  };

  const handleExecuteVoucher = async (voucher: VoucherExtended) => {
    setLoading(true);
    const newVoucherToExecute = await executeVoucher(voucher);

    setVoucherToExecute(newVoucherToExecute);
    setLoading(false);
  };

  useEffect(() => {
    const setVoucher = async (voucher: VoucherExtended) => {
      if (contracts) {
        voucher.executed = await contracts.dappContract.wasVoucherExecuted(
          BigNumber.from(voucher.input.index),
          BigNumber.from(voucher.index),
        );
      }
      setVoucherToExecute(voucher);
    };

    if (!voucherResult.fetching && voucherResult.data) {
      setVoucher(voucherResult.data.voucher);
    }
  }, [voucherResult, contracts]);

  return (
    <div className="my-4 flex flex-col gap-6 border-b-2 pb-4">
      {voucherData.drawing && (
        <div className="w-1/2 p-2">
          <CanvasSnapshotLight data={voucherData.drawing} />
        </div>
      )}

      <div className="flex flex-row items-center gap-3">
        <button
          className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={() => getProof(voucherData)}
        >
          Check status
        </button>

        {voucherToExecute && (
          <span
            key={`${voucherToExecute.input.index}-${voucherToExecute.index}`}
          >
            {!voucherToExecute.proof || voucherToExecute.executed ? (
              <span className="font-medium text-green-700">
                {voucherToExecute.executed ? "NFT already minted!" : "Pending"}
              </span>
            ) : loading ? (
              <Button
                disabled
                className="disabled rounded-lg bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              >
                Mint NFT
              </Button>
            ) : (
              <Button
                onClick={() => handleExecuteVoucher(voucherToExecute)}
                className="rounded-lg bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              >
                Mint NFT
              </Button>
            )}
          </span>
        )}
      </div>

      {voucherToExecute && voucherToExecute.msg && (
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
          )}
        </div>
      )}
    </div>
  );
};
export default Voucher;
