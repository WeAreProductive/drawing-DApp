import { CustomFlowbiteTheme, Label, Modal, Textarea } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import DialogButton from "../ui/formDialog/button";
import { customThemeTextarea } from "../ui/formDialog/textArea";
import DialogToggleSwitch from "../ui/formDialog/toggleSwitch";
import { ContestType, DrawingUserInput } from "../../shared/types";
import { useCanvasContext } from "../../context/CanvasContext";
import DialogTextinput from "../ui/formDialog/textInput";
import { SelectInput } from "../ui/formDialog/selectInput";

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
const validationRules: { [key: string]: string[] } = {
  title: ["required"],
  minting_price: ["required", "gt0"],
  open: ["required", "gt0"],
};
const validationErrMsg = {
  required: "The field is required!",
  gt0: "Value must be greater than 0!",
};
const validationInit = {
  title: { valid: true, msg: "" },
  minting_price: { valid: true, msg: "" },
  open: { valid: true, msg: "" },
};
type InputDialogType = {
  isOpen: boolean;
  setInputValues: React.Dispatch<React.SetStateAction<DrawingUserInput>>;
  inputValues: DrawingUserInput;
  action: () => Promise<void>;
  openHandler: React.Dispatch<React.SetStateAction<boolean>>;
  contests: ContestType[];
};
const InputDialog = ({
  isOpen,
  openHandler,
  setInputValues,
  inputValues,
  action,
  contests,
}: InputDialogType) => {
  const [switch1, setSwitch1] = useState(false);
  const { setLoading } = useCanvasContext();
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [fieldValidation, setFieldValidation] = useState(validationInit);
  const handleDependantFields = (type: string, value: number | string) => {
    switch (type) {
      case "contest":
        // returns single element arr, minting_active, minting_price
        const selectedContest = contests.filter((el) => {
          return el.id == value;
        });
        setInputValues({
          ...inputValues,
          ["contest"]: {
            value: value ? value : 0,
            isReadOnly: false,
          },
          ["minting_price"]: {
            value: selectedContest[0] ? selectedContest[0].minting_price : "",
            isReadOnly: selectedContest[0] ? true : false,
          },
          ["open"]: {
            value: selectedContest[0] ? selectedContest[0].minting_active : 0,
            isReadOnly: selectedContest[0] ? true : false,
          },
        });
        setSwitch1(false);
        break;

      default:
        break;
    }
  };
  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
    inputName: string,
  ) => {
    setInputValues({
      ...inputValues,
      [inputName]: { value: e.target.value, isReadOnly: false },
    });
    // @TODO if inputName == 'contest' => update minting price and open from the contest, set the fields to read only
    // if is contest and value < 1 minting price and open are not readonly and data are returned to initial state
    if (inputName == "contest") {
      handleDependantFields("contest", e.target.value);
    }
    // reset validation
    if (Object.hasOwn(fieldValidation, inputName)) {
      setFieldValidation((fieldValidation) => ({
        ...fieldValidation,
        [inputName]: { valid: true },
      }));
    }
  };
  const handleSwitch = () => {
    // handle switch display
    setSwitch1(!switch1);
    // handle isPrivate value
    setInputValues({
      ...inputValues,
      ["is_private"]: { value: !switch1, isReadOnly: false },
    });
  };
  const handleInputSend = () => {
    const isValid = validateInput();
    if (!isValid) return;
    // close modal
    openHandler(false);
    action();
    // reset validation to initial state
    setFieldValidation(validationInit);
  };
  const handleCloseDialog = () => {
    openHandler(false);
    setLoading(false);
    // reset validation to initial state
    setFieldValidation(validationInit);
  };
  const validateInput = () => {
    let isValidInput = true;
    for (let name in inputValues) {
      if (Object.hasOwn(validationRules, name)) {
        validationRules[name].forEach((rule: string) => {
          if (rule == "gt0") {
            if (+inputValues[name].value < 1) {
              setFieldValidation((fieldValidation) => ({
                ...fieldValidation,
                [name]: { valid: false, msg: validationErrMsg.gt0 },
              }));
              isValidInput = false;
            }
          }
          if (rule == "required") {
            if (!inputValues[name].value.toString().trim()) {
              setFieldValidation((fieldValidation) => ({
                ...fieldValidation,
                [name]: { valid: false, msg: validationErrMsg.required },
              }));
              isValidInput = false;
            }
          }
        });
      }
    }
    return isValidInput;
  };

  return (
    <>
      <Modal
        show={isOpen}
        size="lg"
        popup
        onClose={handleCloseDialog}
        initialFocus={titleInputRef}
        theme={customTheme}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Give us more info about your drawing:
            </h3>
            <div className="my-2 flex flex-col">
              <Label
                htmlFor="title"
                value="Drawing title"
                className="mb-4"
                color={fieldValidation.title.valid ? "" : "failure"}
              />
              <DialogTextinput
                id="title"
                ref={titleInputRef}
                placeholder="Drawing title ..."
                value={inputValues.title.value}
                isReadOnly={inputValues.title.isReadOnly}
                color={fieldValidation.title.valid ? "" : "failure"}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(e, "title")
                }
                validation={fieldValidation.title}
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
                value={inputValues.description.value}
                readOnly={inputValues.description.isReadOnly}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  handleInputChange(e, "description")
                }
              ></Textarea>
            </div>
            {contests && contests.length > 0 ? (
              <div className="my-2 flex flex-col">
                <Label
                  htmlFor="description"
                  value="Attach the drawing to a contests:"
                  className="mb-4"
                />
                <SelectInput
                  id="contest"
                  value={inputValues.contest.value}
                  data={contests}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleInputChange(e, "contest")
                  }
                />
              </div>
            ) : (
              ""
            )}
            <div className="flex">
              <div className="my-2 flex flex-col">
                <Label
                  htmlFor="minting_price"
                  value="Minting Price"
                  className="mb-4"
                  color={fieldValidation.minting_price.valid ? "" : "failure"}
                />
                <DialogTextinput
                  id="minting_price"
                  placeholder="0"
                  addon="ETH"
                  value={inputValues.minting_price.value}
                  isReadonly={inputValues.minting_price.isReadOnly}
                  color={fieldValidation.minting_price.valid ? "" : "failure"}
                  onChange={(e) => handleInputChange(e, "minting_price")}
                  validation={fieldValidation.minting_price}
                />
              </div>
              <div className="m-2 flex flex-col">
                <Label
                  htmlFor="open"
                  value="Open for drawing"
                  className="mb-4"
                  color={fieldValidation.open.valid ? "" : "failure"}
                />
                <DialogTextinput
                  id="open"
                  placeholder="0"
                  addon="Hours"
                  value={inputValues.open.value}
                  isReadonly={inputValues.open.isReadOnly}
                  color={fieldValidation.open.valid ? "" : "failure"}
                  onChange={(e) => handleInputChange(e, "open")}
                  validation={fieldValidation.open}
                />
              </div>
            </div>
            <div className="my-2 flex items-start gap-4">
              <Label value="Private drawing" className="self-center" />
              {/* @TODO set to public without option to change if attached to */}
              {/* contest */}
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
