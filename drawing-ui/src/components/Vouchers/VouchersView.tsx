"use client";

import { useSetChain, useWallets } from "@web3-onboard/react";
import { useVouchersWithProofQuery } from "../../utils/queries";
import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { ETHER_TRANSFER_SELECTOR, MINT_SELECTOR } from "../../shared/constants";

// import {
//   Badge,
//   Box,
//   Button,
//   Card,
//   Center,
//   Group,
//   SimpleGrid,
//   Stack,
//   Text,
// } from "@mantine/core";
// import { notifications } from "@mantine/notifications";
// import { FC, useEffect } from "react";
import { formatEther } from "viem";
import { Network } from "../../shared/types";
import { useRollups } from "../../hooks/useRollups";
// import { useAccount, useWaitForTransactionReceipt } from "wagmi";
// import {
//   useReadCartesiDAppWasVoucherExecuted,
//   useSimulateCartesiDAppExecuteVoucher,
//   useWriteCartesiDAppExecuteVoucher,
// } from "../../generated/wagmi-rollups";
// import { useApplicationAddress } from "../../hooks/useApplicationAddress";
// import { CenteredErrorMessage } from "../CenteredErrorMessage";
// import { CenteredLoaderBars } from "../CenteredLoaderBars";
// import { InfoMessage } from "../InfoMessage";
// import { dummyProof } from "./functions";
// import { UserVoucher, useGetUserVouchers } from "./queries";
// import { Voucher } from "./types";

import configFile from "../../config/config.json";
const config: { [name: string]: Network } = configFile;
type Hex = `0x${string}`;
type Hash = `0x${string}`;
const zeroHash =
  "0x0000000000000000000000000000000000000000000000000000000000000000";
export interface Validity {
  inputIndexWithinEpoch: number;
  outputIndexWithinInput: number;
  outputHashesRootHash: Hash;
  vouchersEpochRootHash: Hash;
  noticesEpochRootHash: Hash;
  machineStateHash: Hash;
  outputHashInOutputHashesSiblings: Hash[];
  outputHashesInEpochSiblings: Hash[];
}

export interface Proof {
  context: Hex;
  validity: Validity;
}
export const dummyProof: Proof = {
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
  // const {
  //   data: wasExecuted,
  //   error: wasExecutedError,
  //   isLoading: isCheckingVoucherStatus,
  //   refetch: recheckVoucherStatus,
  // } = useReadCartesiDAppWasVoucherExecuted({
  //   args: [BigInt(voucher.input.index), BigInt(voucher.index)],
  //   address: appAddress,
  // });
  const [{ connectedChain }] = useSetChain();
  if (!connectedChain) return;
  const { contracts, executeVoucher } = useRollups(
    config[connectedChain.id].DAppRelayAddress,
  );
  const [voucherExecuted, setVoucherExecuted] = useState(null);
  useEffect(() => {
    const recheckVoucherStatus = async (voucher: any) => {
      if (contracts) {
        voucher = await contracts.dappContract.wasVoucherExecuted(
          BigNumber.from(voucher.input.index),
          BigNumber.from(voucher.index),
        );
      }
      setVoucherExecuted(voucher);
    };
    recheckVoucherStatus(voucher);
    // @TODO after exetition - recheckVoucherStatus
  }, [contracts]);

  const proof = voucher.proof ?? dummyProof;
  const { validity } = proof;
  const { inputIndexWithinEpoch, outputIndexWithinInput } = validity;

  const prepare = useSimulateCartesiDAppExecuteVoucher({
    args: [
      voucher.destination,
      voucher.payload,
      {
        ...proof,
        validity: {
          ...validity,
          inputIndexWithinEpoch: BigInt(inputIndexWithinEpoch),
          outputIndexWithinInput: BigInt(outputIndexWithinInput),
        },
      },
    ],
    address: appAddress,
    query: {
      enabled: voucher.proof !== null && voucher.proof !== undefined,
    },
  });

  const execute = useWriteCartesiDAppExecuteVoucher();
  const wait = useWaitForTransactionReceipt({
    hash: execute.data,
  });

  // useEffect(() => {
  //   if (wait.isSuccess) {
  //     notifications.show({
  //       title: "Success",
  //       message: "The voucher was executed.",
  //       autoClose: 3000,
  //     });
  //     recheckVoucherStatus();
  //   }
  // }, [wait.isSuccess, recheckVoucherStatus]);

  // if (wasExecutedError !== null) {
  //   return <Badge color="red">{wasExecutedError.message}</Badge>;
  // }

  // if (isCheckingVoucherStatus) {
  //   return <Badge color="orange">Checking execution status...</Badge>;
  // }

  if (wasExecuted) {
    return <Badge color="green">Executed!</Badge>;
  }

  if (voucher.proof === null) {
    return <p color="orange">Waiting for proof...</p>;
  }

  if (execute === undefined) {
    return <p color="orange">Preparing transaction...</p>;
  }

  return <button>Execute</button>;
};

// interface Props {
//   userVoucher: UserVoucher;
// }
// @TODO - fix - NFT
const MintVoucher = ({ voucher }: any) => {
  return (
    <div>
      <p>Mint NFT</p>
      <ExecuteButton voucher={voucher} />
    </div>
  );
};

const WithdrawVoucher = ({ voucher }: any) => {
  return (
    <div>
      {/* <p>Withdraw {formatEther(BigInt(userVoucher.value))}</p> */}
      <p>Withdraw </p>
      <ExecuteButton voucher={voucher} />
    </div>
  );
};

const Info = ({ userVoucher }: any) => {
  const { payload } = userVoucher.voucher;
  const decoder = new ethers.utils.AbiCoder();
  const selector = decoder.decode(["bytes4"], payload)[0];
  return (
    <div>
      {selector === MINT_SELECTOR ? (
        <MintVoucher userVoucher={userVoucher.voucher} />
      ) : userVoucher.type === ETHER_TRANSFER_SELECTOR ? (
        <WithdrawVoucher userVoucher={userVoucher.voucher} />
      ) : (
        ""
      )}
    </div>
  );
};
// interface VoucherListProps {
//   userVouchers: UserVoucher[];
// }
const VoucherList = ({ userVouchers }: any) => {
  return (
    <div>
      {userVouchers.vouchers.edges.map((userVoucher: any, idx: any) => (
        <Info key={idx} voucher={userVoucher} />
      ))}
    </div>
  );
};

export const VouchersView = () => {
  const [connectedWallet] = useWallets();
  // const { inspectCall } = useInspect();
  const [cursor, setCursor] = useState<string | null | undefined | null>(null);

  const [result, reexecuteQuery] = useVouchersWithProofQuery({
    variables: { cursor },
    pause: true,
  });
  const [currentAccount, setCurrentAccount] = useState("");
  // const [myVouchers, setMyVouchers] = useState<VoucherExtended[]>([]);
  // const [drawings, setDrawings] = useState<DrawingInputExtended[]>([]);
  const [uuids, setUuids] = useState<string[]>([]);
  const { data } = result;
  // const provider = new ethers.providers.Web3Provider(connectedWallet.provider);
  console.log({ result });
  // if (fetching) {
  //   return <p>Loading ...</p>;
  // }

  // if (error) {
  //   return <p>{error.message} </p>;
  // }

  // if (!data) {
  //   return <p>There are no vouchers to be presented</p>;
  // }

  // if (!data) {
  //   return (
  //     <div>
  //       <p>{`Could not find vouchers for account ${address}`}</p>
  //     </div>
  //   );
  // }
  /**
   * Reexecuting query if the component
   * is accessed before vouchers are emition is finished.
   * Otherwise - if user requests a voucher, opens the voucher's component,
   * sees all his emitted vouchers, no new voucher he owns are expected to be seen.
   */
  useEffect(() => {
    if (result.fetching) return;
    // Set up to refetch in one second, if the query is idle
    // Retrieve vouchers every 1000 ms
    const timerId = setTimeout(() => {
      reexecuteQuery({ requestPolicy: "network-only" });
    }, 1000);
    const length = data?.vouchers?.edges?.length;
    if (length) {
      // Update cursor so that next GraphQL poll retrieves only newer data
      // setCursor(data.vouchers.pageInfo.endCursor);
    }
    return () => clearTimeout(timerId);
  }, [result.fetching, reexecuteQuery]);
  return <div>{data && <VoucherList userVouchers={data} />}</div>;
};
