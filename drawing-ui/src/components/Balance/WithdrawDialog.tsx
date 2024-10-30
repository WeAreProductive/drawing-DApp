import { CustomFlowbiteTheme, Label, Modal, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import DialogButton from "../ui/formDialog/button";
import { useRollups } from "../../hooks/useRollups";
import { useSetChain } from "@web3-onboard/react";
import configFile from "../../config/config.json";
import { NetworkConfigType } from "../../shared/types";

const config: { [name: string]: NetworkConfigType } = configFile;

const customTheme: CustomFlowbiteTheme["modal"] = {
  root: {
    base: "fixed inset-x-0 top-0 z-50 h-screen overflow-y-auto overflow-x-hidden md:inset-0 md:h-full",
    show: {
      on: "flex bg-gray-900 bg-opacity-50 dark:bg-opacity-80",
      off: "hidden",
    },
    sizes: {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      "3xl": "max-w-3xl",
      "4xl": "max-w-4xl",
      "5xl": "max-w-5xl",
      "6xl": "max-w-6xl",
      "7xl": "max-w-7xl",
    },
    positions: {
      "top-left": "items-start justify-start",
      "top-center": "items-start justify-center",
      "top-right": "items-start justify-end",
      "center-left": "items-center justify-start",
      center: "items-center justify-center",
      "center-right": "items-center justify-end",
      "bottom-right": "items-end justify-end",
      "bottom-center": "items-end justify-center",
      "bottom-left": "items-end justify-start",
    },
  },
  content: {
    base: "relative h-full w-full p-4 md:h-auto",
    inner:
      "relative flex max-h-[90dvh] flex-col rounded-lg bg-white shadow dark:bg-gray-700",
  },
  body: {
    base: "flex-1 overflow-auto p-6",
    popup: "pt-0",
  },
  header: {
    base: "flex items-start justify-between rounded-t border-b p-5 dark:border-gray-600",
    popup: "border-b-0 p-2",
    title: "text-xl font-medium text-gray-900 dark:text-white",
    close: {
      base: "ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white",
      icon: "h-5 w-5",
    },
  },
  footer: {
    base: "flex items-center space-x-2 rounded-b border-gray-200 p-6 dark:border-gray-600",
    popup: "border-t",
  },
};
type WithdrawDialogType = {
  isOpen: boolean;
  handler: (open: boolean) => void;
};
const WithdrawDialog = ({ isOpen, handler }: WithdrawDialogType) => {
  const [{ connectedChain }] = useSetChain();

  const dappAddress = connectedChain
    ? config[connectedChain.id].DAppRelayAddress
    : "";
  const { sendWithdrawInput } = useRollups(dappAddress);
  const [openModal, setOpenModal] = useState(isOpen);
  const [amount, setAmount] = useState("0");

  // //  @TODO - use for input validation https://flowbite-react.com/docs/components/forms
  useEffect(() => {
    setOpenModal(isOpen);
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // // @TODO add validation for string length before updating the state
    setAmount(e.target.value);
  };

  const handleInputSend = () => {
    // @TODO - validate input is as equired

    // if (+amount <= 0) return;
    // the withdrawal is handled in the be
    const input = JSON.stringify({
      amount,
      cmd: "eth.withdraw",
    });
    sendWithdrawInput(input);
    handler(false); // close modal
  };
  return (
    <>
      <Modal
        show={isOpen}
        size="lg"
        popup
        onClose={() => handler(false)}
        // initialFocus={titleInputRef}
        theme={customTheme}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Enter amount to withdraw:
            </h3>
            <div className="my-2 flex flex-col">
              <Label htmlFor="title" value="Drawing title" className="mb-4" />
              <TextInput
                id="amount"
                // ref={titleInputRef}
                placeholder="Amount ..."
                // required
                onChange={(e) => handleInputChange(e)}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {/* add handler onClick continue*/}
          <DialogButton color="green" onClick={() => handleInputSend()}>
            Withdraw
          </DialogButton>
          <DialogButton color="red" onClick={() => handler(false)}>
            Decline
          </DialogButton>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default WithdrawDialog;
