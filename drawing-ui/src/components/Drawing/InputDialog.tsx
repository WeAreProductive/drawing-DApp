import {
  CustomFlowbiteTheme,
  Label,
  Modal,
  Textarea,
  TextInput,
} from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import DialogButton from "../ui/formDialog/button";
import { customThemeTextarea } from "../ui/formDialog/textArea";
import DialogToggleSwitch from "../ui/formDialog/toggleSwitch";
import { DrawingUserInput } from "../../shared/types";
import { useCanvasContext } from "../../context/CanvasContext";

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
type InputDialogType = {
  isOpen: boolean;
  setInputValues: React.Dispatch<React.SetStateAction<DrawingUserInput>>;
  inputValues: DrawingUserInput;
  action: () => Promise<void>;
  openHandler: React.Dispatch<React.SetStateAction<boolean>>;
};
const InputDialog = ({
  isOpen,
  openHandler,
  setInputValues,
  inputValues,
  action,
}: InputDialogType) => {
  // const [openModal, setOpenModal] = useState(false);
  const [switch1, setSwitch1] = useState(false);
  const { setLoading } = useCanvasContext();
  //  @TODO - use for input validation https://flowbite-react.com/docs/components/forms
  // const titleInputRef = useRef<HTMLInputElement>(null);
  // useEffect(() => {
  //   setOpenModal(isOpen);
  // }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    inputName: string,
  ) => {
    // @TODO add validation for string length before updating the state
    setInputValues({
      ...inputValues,
      [inputName]: e.target.value,
    });
  };
  const handleSwitch = () => {
    // handle switch display
    setSwitch1(!switch1);
    // handle isPrivate value
    setInputValues({
      ...inputValues,
      ["private"]: !switch1,
    });
  };
  const handleInputSend = () => {
    // @TODO - validate input is as equired
    // close modal
    openHandler(false);
    action();
  };
  const handleCloseDialog = () => {
    openHandler(false);
    setLoading(false);
  };
  return (
    <>
      <Modal
        show={isOpen}
        size="lg"
        popup
        onClose={handleCloseDialog}
        // initialFocus={titleInputRef}
        theme={customTheme}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Give us more info about your drawing:
            </h3>
            <div className="my-2 flex flex-col">
              <Label htmlFor="title" value="Drawing title" className="mb-4" />
              <TextInput
                id="title"
                // ref={titleInputRef}
                placeholder="Drawing title ..."
                // required
                onChange={(e) => handleInputChange(e, "title")}
              />
            </div>
            <div className="my-2 flex flex-col">
              <Label
                htmlFor="description"
                value="Drawing description(optional)"
                className="mb-4"
              />
              <Textarea
                theme={customThemeTextarea}
                rows={4}
                className="p-2"
                id="description"
                placeholder="Drawing description..."
                onChange={(e) => handleInputChange(e, "description")}
              ></Textarea>
            </div>
            <div className="flex">
              <div className="my-2 flex flex-col">
                <Label htmlFor="price" value="Minting Price" className="mb-4" />
                <TextInput
                  id="mintingPrice"
                  placeholder="0"
                  // required
                  addon="ETH"
                  onChange={(e) => handleInputChange(e, "mintingPrice")}
                />
              </div>
              <div className="m-2 flex flex-col">
                <Label
                  htmlFor="price"
                  value="Open for drawing"
                  className="mb-4"
                />
                <TextInput
                  id="open"
                  placeholder="0"
                  // required
                  addon="Hours"
                  onChange={(e) => handleInputChange(e, "open")}
                />
              </div>
            </div>
            <div className="my-2 flex items-start gap-4">
              <Label value="Private drawing" className="self-center" />
              <DialogToggleSwitch checked={switch1} onChange={handleSwitch} />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {/* add handler onClick continue*/}
          <DialogButton color="green" onClick={() => handleInputSend()}>
            Continue
          </DialogButton>
          <DialogButton color="red" onClick={handleCloseDialog}>
            Decline
          </DialogButton>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default InputDialog;
