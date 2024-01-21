import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { useVoucherQuery } from "../../generated/graphql";
import { useRollups } from "../../hooks/useRollups";
import { DAPP_ADDRESS } from "../../shared/constants";
import { VoucherExtended } from "../../shared/types";
import { Button } from "../ui/button";
import CanvasSnapshotLight from "../ImagesRollups/CanvasSnapshotLight";

type VoucherProp = {
  voucherData: VoucherExtended;
};

const Voucher = ({ voucherData }: VoucherProp) => {
  const [voucherToFetch, setVoucherToFetch] = useState([0, 0]);
  const [voucherResult, reexecuteVoucherQuery] = useVoucherQuery({
    variables: {
      voucherIndex: voucherToFetch[0],
      inputIndex: voucherToFetch[1],
    },
  });

  const [voucherToExecute, setVoucherToExecute] = useState<VoucherExtended>();

  const [loading, setLoading] = useState(false);
  const rollups = useRollups(DAPP_ADDRESS);

  const getProof = async (voucher: VoucherExtended) => {
    setVoucherToFetch([voucher.index, voucher.input.index]);
    reexecuteVoucherQuery({ requestPolicy: "network-only" });
  };

  const executeVoucher = async (voucher: VoucherExtended) => {
    if (rollups && !!voucher.proof) {
      setLoading(true);
      const newVoucherToExecute = { ...voucher };

      try {
        const tx = await rollups.dappContract.executeVoucher(
          voucher.destination,
          voucher.payload,
          voucher.proof,
        );
        const receipt = await tx.wait();

        newVoucherToExecute.msg = `voucher executed! (tx="${tx.hash}")`;
        if (receipt.events) {
          const event = receipt.events?.find(
            (e) => e.event === "VoucherExecuted",
          );

          if (!event) {
            throw new Error(
              `InputAdded event not found in receipt of transaction ${receipt.transactionHash}`,
            );
          }
          newVoucherToExecute.msg = `${
            newVoucherToExecute.msg
          } - resulting events: ${JSON.stringify(receipt.events)}`;

          newVoucherToExecute.executed =
            await rollups.dappContract.wasVoucherExecuted(
              BigNumber.from(voucher.input.index),
              BigNumber.from(voucher.index),
            );
        }
        setLoading(false);
      } catch (e) {
        newVoucherToExecute.msg = `COULD NOT EXECUTE VOUCHER: ${JSON.stringify(
          e,
        )}`;
        console.log(`COULD NOT EXECUTE VOUCHER: ${JSON.stringify(e)}`);
      }

      setVoucherToExecute(newVoucherToExecute);
      setLoading(false);
    }
  };

  useEffect(() => {
    const setVoucher = async (voucher: VoucherExtended) => {
      if (rollups) {
        voucher.executed = await rollups.dappContract.wasVoucherExecuted(
          BigNumber.from(voucher.input.index),
          BigNumber.from(voucher.index),
        );
      }
      setVoucherToExecute(voucher);
    };

    if (!voucherResult.fetching && voucherResult.data) {
      setVoucher(voucherResult.data.voucher);
    }
  }, [voucherResult, rollups]);

  return (
    <div className="my-4 border-b-2 pb-4">
      {voucherData.drawing && (
        <div className="w-1/2 p-2">
          <CanvasSnapshotLight src={voucherData.drawing} />
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
                onClick={() => executeVoucher(voucherToExecute)}
                className="rounded-lg bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              >
                Mint NFT
              </Button>
            )}
          </span>
        )}
      </div>

      {voucherToExecute && voucherToExecute.input.payload && (
        <dl className="mb-2">
          <dt className="font-semibold">Payload</dt>
          <dd>{voucherToExecute.input.payload}</dd>
        </dl>
      )}

      {voucherToExecute && (
        <p>{loading ? <span>...</span> : voucherToExecute.msg}</p>
      )}
    </div>
  );
};
export default Voucher;
