import { useEffect, useState } from "react";
import WithdrawDialog from "./WithdrawDialog";
import { useWallets } from "@web3-onboard/react";
import { useGetBalance } from "../../hooks/useGetBalance";
import { useConnectionContext } from "../../context/ConnectionContext";

export const Balance = () => {
  const { account } = useConnectionContext();
  const [openDialog, setOpenDialog] = useState(false);
  const { data, error } = useGetBalance(account); // @TODO handle on error
  const hasBalance = data && data > 0;
  const manageWithdraw = (open: boolean) => {
    setOpenDialog(open);
  };
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
