import { useState } from "react";
import { Dropdown } from "flowbite-react";
import WithdrawDialog from "./WitdrawDialog";
import { zeroAddress } from "../../shared/constants";
import { useWallets } from "@web3-onboard/react";
import { useInspect } from "../../hooks/useInspect";
import { ethers } from "ethers";
import { useGetBalance } from "../../hooks/useGetBalance";

export const Balance = () => {
  // @TODO move all connection and account related data to context

  const [connectedWallet] = useWallets();
  const account = connectedWallet?.accounts[0].address;
  const { inspectCall } = useInspect();
  // const { fetchBalance } = useGetBalance();
  // const [balance, setBalance] = useState<number | string | undefined>(0);
  const [openDialog, setOpenDialog] = useState(false);
  const { data, error } = useGetBalance(account);
  console.log({ data });
  const hasBalance = data && data > 0;
  const manageWithdraw = () => {
    setOpenDialog(true);
  };
  return (
    <>
      Balance (ETH): {data}
      {hasBalance ? <button>Withdraw</button> : null}
      <WithdrawDialog isOpen={openDialog} />
    </>
  );
};
