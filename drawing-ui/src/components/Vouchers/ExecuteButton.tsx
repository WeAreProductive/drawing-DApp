import { useSetChain, useWallets } from "@web3-onboard/react";
import { useVouchersWithProofQuery } from "../../utils/queries";
import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { Button } from "../ui/button";
import {
  ETHER_TRANSFER_SELECTOR,
  MINT_SELECTOR,
  zeroHash,
} from "../../shared/constants";
import { Network, Proof, VoucherExtended } from "../../shared/types";
import { useRollups } from "../../hooks/useRollups";
import configFile from "../../config/config.json";
import { useVoucherQuery } from "../../generated/graphql";

const config: { [name: string]: Network } = configFile;

const dummyProof: Proof = {
  context: "0x",
  validity: {
    inputIndexWithinEpoch: 0,
    outputIndexWithinInput: 0,
    outputHashesRootHash: zeroHash,
    vouchersEpochRootHash: zeroHash,
    noticesEpochRootHash: zeroHash,
    machineStateHash: zeroHash,
    outputHashInOutputHashesSiblings: [],
    outputHashesInEpochSiblings: [],
  },
};
const ExecuteButton = ({ voucher }: any) => {
  console.log({ voucher });
  const [{ connectedChain }] = useSetChain();
  if (!connectedChain) return;
  const { contracts, executeVoucher } = useRollups(
    config[connectedChain.id].DAppRelayAddress,
  );
  const [executed, setVoucherExecuted] = useState(false); // VoucherExtended or null @TODO
  const [loading, setLoading] = useState(false);
  const [voucherToFetch, setVoucherToFetch] = useState([0, 0]);
  const [voucherResult, reexecuteVoucherQuery] = useVoucherQuery({
    variables: {
      voucherIndex: voucherToFetch[0],
      inputIndex: voucherToFetch[1],
    },
  });
  const proof = voucher.proof ?? dummyProof;

  const recheckVoucherStatus = async (voucher: any) => {
    if (contracts) {
      const result = await contracts.dappContract.wasVoucherExecuted(
        BigNumber.from(voucher.input.index),
        BigNumber.from(voucher.index),
      );
      setVoucherExecuted(result);
    }
  };
  const handleExecuteVoucher = async (voucher: VoucherExtended) => {
    setLoading(true);
    const newVoucherToExecute = await executeVoucher(voucher);
    console.log({ newVoucherToExecute });
    // setVoucherToExecute(newVoucherToExecute);
    setLoading(false);
  };
  const getProof = async (voucher: VoucherExtended) => {
    console.log("get proof");
    console.log({ voucher });
    setVoucherToFetch([voucher.index, voucher.input.index]);
    reexecuteVoucherQuery({ requestPolicy: "network-only" });
  };
  useEffect(() => {
    recheckVoucherStatus(voucher);
    // @TODO after exetition - recheckVoucherStatus
  }, [contracts]);
  if (executed) {
    return (
      <span className="font-medium text-green-700"> Voucher executed!</span>
    );
  }
  if (voucher.proof === null) {
    return (
      <button
        className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onClick={() => getProof(voucher)}
      >
        Check status
      </button>
    );
  }
  return (
    <Button
      onClick={() => handleExecuteVoucher(voucher)}
      className="rounded-lg bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
    >
      Mint NFT
    </Button>
  );
};
export default ExecuteButton;
