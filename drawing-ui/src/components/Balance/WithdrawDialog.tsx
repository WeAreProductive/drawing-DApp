import { CustomFlowbiteTheme, Label, Modal, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import DialogButton from "../ui/formDialog/button";
import { useRollups } from "../../hooks/useRollups";

// @TODO extract validation as a hook
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
const validationRules = {
  amount: ["required", "gt0"],
};
const validationErrMsg = {
  required: "The field is required!",
  gt0: "Value must be greater than 0!",
};
const validationInit = {
  amount: { valid: true, msg: "" },
};
const WithdrawDialog = ({ isOpen, handler }: WithdrawDialogType) => {
  const { sendWithdrawInput } = useRollups();
  const [openModal, setOpenModal] = useState(isOpen);
  const [amount, setAmount] = useState("0");
  const [fieldValidation, setFieldValidation] = useState(validationInit);
  const amountInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setOpenModal(isOpen);
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    // reset validation
    setFieldValidation(validationInit);
  };

  const handleInputSend = () => {
    // validation
    const isValid = validateInput();
    if (!isValid) return;
    const input = JSON.stringify({
      amount,
      cmd: "eth.withdraw",
    });
    sendWithdrawInput(input);
    handler(false); // close modal
    setFieldValidation(validationInit);
  };
  const handleClose = () => {
    handler(false);
    setFieldValidation(validationInit);
  };
  const validateInput = () => {
    let isValidInput = true;
    if (Object.hasOwn(validationRules, "amount")) {
      validationRules.amount.forEach((rule: string) => {
        if (rule == "gt0") {
          if (+amount < 1 || isNaN(+amount)) {
            setFieldValidation((fieldValidation) => ({
              ...fieldValidation,
              ["amount"]: { valid: false, msg: validationErrMsg.gt0 },
            }));
            isValidInput = false;
          }
        }
        if (rule == "required") {
          if (!amount.toString().trim()) {
            setFieldValidation((fieldValidation) => ({
              ...fieldValidation,
              ["amount"]: { valid: false, msg: validationErrMsg.required },
            }));
            isValidInput = false;
          }
        }
      });
    }
    return isValidInput;
  };
  return (
    <>
      <Modal
        show={isOpen}
        size="lg"
        popup
        onClose={handleClose}
        initialFocus={amountInputRef}
        theme={customTheme}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Enter amount to withdraw:
            </h3>
            <div className="flex flex-col my-2">
              <Label
                htmlFor="title"
                value="Drawing title"
                className="mb-4"
                color={fieldValidation.amount.valid ? "" : "failure"}
              />
              <TextInput
                id="amount"
                ref={amountInputRef}
                placeholder="Amount ..."
                required
                onChange={(e) => handleInputChange(e)}
                color={fieldValidation.amount.valid ? "" : "failure"}
                helperText={fieldValidation.amount.msg}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <DialogButton color="green" onClick={handleInputSend}>
            Withdraw
          </DialogButton>
          <DialogButton color="red" onClick={handleClose}>
            Decline
          </DialogButton>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default WithdrawDialog;
