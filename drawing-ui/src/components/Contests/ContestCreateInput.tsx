import { useRef, useState } from "react";
import { Button, Label, Textarea, TextInput } from "flowbite-react";
import { customThemeTextarea } from "../ui/formDialog/textArea";
import InputDatepicker from "../ui/formDialog/inputDatepicker";
import ButtonSpinner from "../ui/formDialog/buttonSpinner";
import { useInspect } from "../../hooks/useInspect";
import moment from "moment";
import { useConnectionContext } from "../../context/ConnectionContext";
import { dateToTimestamp, nowUnixTimestamp } from "../../utils";
import { ContestInitType } from "../../shared/types";
import DialogTextinput from "../ui/formDialog/textInput";

const now = moment().utc();
// @TODO fix typing
const validationErrMsg = {
  required: "The field is required!",
  gt0: "Value must be greater than 0!",
  gtNow: "Select date greater than now!",
  gtDate: "Select date after 'from' date!",
};
const validationRules = {
  title: ["required"],
  active_from: ["required"],
  active_to: ["required", "gtDate:active_from"],
  minting_active: ["required", "gt0"],
};
const validationInit = {
  title: { valid: true, msg: "" },
  active_from: { valid: true, msg: now },
  active_to: { valid: true, msg: "" },
  minting_active: { valid: true, msg: "" },
};
const initialInput = {
  title: "",
  description: "",
  active_from: now,
  active_to: now,
  minting_active: 1,
};

const ContestCreateInput = () => {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const { account } = useConnectionContext();
  const { inspectCall } = useInspect();
  const [fieldValidation, setFieldValidation] = useState(validationInit);
  const [inputValues, setInputValues] = useState<ContestInitType>(initialInput);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
    inputName: string,
  ) => {
    setInputValues({
      ...inputValues,
      [inputName]: e.target.value,
    });
    // reset validation
    if (Object.hasOwn(fieldValidation, inputName)) {
      setFieldValidation((fieldValidation) => ({
        ...fieldValidation,
        [inputName]: { valid: true },
      }));
    }
  };
  const handleDateSelected = (date: Date, inputName: string) => {
    setInputValues({
      ...inputValues,
      [inputName]: date,
    });
    // reset validation
    if (Object.hasOwn(fieldValidation, inputName)) {
      setFieldValidation((fieldValidation) => ({
        ...fieldValidation,
        [inputName]: { valid: true },
      }));
    }
  };
  const validateInput = () => {
    let isValidInput = true;
    for (let name in inputValues) {
      if (Object.hasOwn(validationRules, name)) {
        validationRules[name].forEach((rule: string) => {
          if (rule == "gt0") {
            if (+inputValues[name] < 1 || isNaN(inputValues[name])) {
              setFieldValidation((fieldValidation) => ({
                ...fieldValidation,
                [name]: { valid: false, msg: validationErrMsg.gt0 },
              }));
              console.log(`Validation error :: ${validationErrMsg.gt0}`);
              isValidInput = false;
            }
          }
          if (rule.includes("gtDate")) {
            const validationArgs = rule.split(":");
            if (inputValues[name] <= inputValues[validationArgs[1]]) {
              setFieldValidation((fieldValidation) => ({
                ...fieldValidation,
                [name]: { valid: false, msg: validationErrMsg.gtDate },
              }));
              console.log(`Validation error :: ${validationErrMsg.gtDate}`);
              isValidInput = false;
            }
          }
          if (rule == "required") {
            if (!inputValues[name].toString().trim()) {
              setFieldValidation((fieldValidation) => ({
                ...fieldValidation,
                [name]: { valid: false, msg: validationErrMsg.required },
              }));
              console.log(`Validation error :: ${validationErrMsg.required}`);
              isValidInput = false;
            }
          }
        });
      }
    }
    return isValidInput;
  };
  const handleReset = () => {
    setInputValues(initialInput);
    setFieldValidation(validationInit);
  };
  const createContest = async () => {
    console.warn("CONTEST :: Creating new contest ...");
    const unixTimestamp = nowUnixTimestamp();
    const contest_data = {
      data: {
        ...inputValues,
        active_from: dateToTimestamp(inputValues.active_from, "startOf"),
        active_to: dateToTimestamp(inputValues.active_to, "endOf"),
      },
      created_by: account,
      created_at: unixTimestamp,
    };
    const contestData = JSON.stringify(contest_data);

    const queryString = `contests/create/${contestData}`;
    const data = await inspectCall(queryString, "plain");
    setLoading(false);
    setInputValues(initialInput);
  };
  const handleSubmit = async () => {
    const isValid = validateInput();
    if (!isValid) return;

    setLoading(true);

    // send input
    const result = await createContest();
    // @TODO display success toast
    setInputValues(initialInput);
  };
  return (
    <div>
      <div className="space-y-6 bg-card p-10">
        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
          Create contest
        </h3>
        <div className="my-2 flex flex-col">
          <Label
            htmlFor="title"
            value="Contest title"
            className="mb-4"
            color={fieldValidation.title.valid ? "" : "failure"}
          />
          <DialogTextinput
            id="title"
            ref={titleInputRef}
            placeholder="Contest title ..."
            value={inputValues.title}
            onChange={(e) => handleInputChange(e, "title")}
            color={fieldValidation.title.valid ? "" : "failure"}
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
            value={inputValues.description}
            placeholder="Drawing description..."
            onChange={(e) => handleInputChange(e, "description")}
          ></Textarea>
        </div>
        <div className="flex flex-col">
          <Label
            htmlFor="active_from"
            value="Contest is active"
            color={fieldValidation.active_from.valid ? "" : "failure"}
          />
          <div className="m-2 flex gap-2">
            <div>
              <Label
                value="from"
                color={fieldValidation.active_from.valid ? "" : "failure"}
              />
              <InputDatepicker
                name="active_from"
                onChange={(date) => handleDateSelected(date, "active_from")}
                value={inputValues.active_from}
                validation={fieldValidation.active_from}
              />
            </div>
            <div>
              <Label
                htmlFor="active_to"
                value="to"
                color={fieldValidation.active_to.valid ? "" : "failure"}
              />
              <InputDatepicker
                name="active_to"
                onChange={(date) => handleDateSelected(date, "active_to")}
                value={inputValues.active_to}
                validation={fieldValidation.active_to}
              />
            </div>
          </div>
        </div>
        <div className="m-2 flex flex-col">
          <Label
            htmlFor="minting_active"
            value="Minting is active for"
            className="mb-4"
            color={fieldValidation.minting_active.valid ? "" : "failure"}
          />
          <DialogTextinput
            id="minting_active"
            placeholder="1"
            addon="Hours"
            value={inputValues.minting_active}
            onChange={(e) => handleInputChange(e, "minting_active")}
            color={fieldValidation.minting_active.valid ? "" : "failure"}
            validation={fieldValidation.minting_active}
          />
        </div>
        <div className="m-2 flex flex-wrap gap-4">
          <Button color="blue" onClick={handleReset}>
            Reset
          </Button>
          <Button disabled={loading} color="success" onClick={handleSubmit}>
            {loading ? (
              <ButtonSpinner
                ariaLabel="Saving contest"
                label="Saving contest..."
              />
            ) : (
              " Save contest"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default ContestCreateInput;
