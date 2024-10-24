import { useState } from "react";
import { useGetBalance } from "../../hooks/useGetBalance";
import { Dropdown } from "flowbite-react";
import WithdrawDialog from "./WitdrawDialog";

export const Balance = () => {
  const { fetchBalance } = useGetBalance();
  const [balance, setBalance] = useState<number | string | undefined>(0);
  const [openDialog, setOpenDialog] = useState(false);
  const getBalance = async () => {
    const balance = await fetchBalance();
    setBalance(balance);
  };
  const manageWithdraw = () => {
    setOpenDialog(true);
  };
  return (
    <>
      <Dropdown
        label=""
        dismissOnClick={true}
        renderTrigger={() => (
          <button>
            <span onClick={getBalance}>Balance</span>
          </button>
        )}
      >
        <Dropdown.Item>
          <span>Balance(ETH): {balance}</span>
        </Dropdown.Item>
        {balance && +balance > 0 && (
          <Dropdown.Item onClick={manageWithdraw}>Withdraw</Dropdown.Item>
        )}
      </Dropdown>
      <WithdrawDialog isOpen={openDialog} />
    </>
  );
};
