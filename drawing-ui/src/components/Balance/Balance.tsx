import { useEffect, useState } from "react";
import WithdrawDialog from "./WitdrawDialog";
import { useWallets } from "@web3-onboard/react";
import { useGetBalance } from "../../hooks/useGetBalance";

export const Balance = () => {
  // @TODO move all connection and account related data to context

  const [connectedWallet] = useWallets();
  const account = connectedWallet?.accounts[0].address;
  const [openDialog, setOpenDialog] = useState(false);
  const { data, error } = useGetBalance(account); // @TODO handle on error
  const hasBalance = data && data > 0;
  const manageWithdraw = (open: boolean) => {
    console.log("open dialog");
    setOpenDialog(open);
  };
  console.log({ openDialog });
  return (
    <>
      Balance (ETH): {data}
      {hasBalance ? (
        <button onClick={() => manageWithdraw(true)}>Withdraw</button>
      ) : null}
      <WithdrawDialog isOpen={openDialog} handler={manageWithdraw} />
    </>
  );
};
