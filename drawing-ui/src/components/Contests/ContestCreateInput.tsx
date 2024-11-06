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

const now = moment().utc();

const validationErrMsg = {
  required: "The field is required!",
  gt0: "Value must be greater than 0!",
  gtNow: "Select date greater than now!",
  gtFrom: "Select date greater than From date!",
};
const validationRules = {
  title: ["required"],
  activeFrom: ["required", "gtNow"],
  activeTo: ["required", "gtDate"],
  mintingOpen: ["required", "gt0"],
};
const validationInit = {
  title: { valid: true, msg: "" },
  activeFrom: { valid: true, msg: now },
  activeTo: { valid: true, msg: "" },
  mintingOpen: { valid: true, msg: "" },
};
const initialInput = {
  title: "",
  description: "",
  activeFrom: now, // @TODO set to now
  activeTo: now, // @TODO set to now+1
  mintingOpen: 1,
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
  // @TODO
  const validateInput = () => {
    return true;
  };
  const handleReset = () => {
    console.log(initialInput);
    setInputValues(initialInput);
  };
  const createContest = async () => {
    console.warn("CONTEST :: Creating new contest ...");
    // @TODO - update dapp states console.warn(dappState);
    const unixTimestamp = nowUnixTimestamp();
    const contest_data = {
      data: {
        ...inputValues,
        activeFrom: dateToTimestamp(inputValues.activeFrom),
        activeTo: dateToTimestamp(inputValues.activeTo),
      },
      created_by: account,
      created_at: unixTimestamp,
    };
    const contestData = JSON.stringify(contest_data);

    const queryString = `contests/create/${contestData}`;
    const data = await inspectCall(queryString, "plain");
    console.log(data);
    setLoading(false);
    setInputValues(initialInput);
  };
  const handleSubmit = async () => {
    // @TODO validate fields
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
          <TextInput
            id="title"
            ref={titleInputRef}
            placeholder="Contest title ..."
            onChange={(e) => handleInputChange(e, "title")}
            required
            value={inputValues.title}
            color={fieldValidation.title.valid ? "" : "failure"}
            helperText={fieldValidation.title.msg}
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
            htmlFor="activeFrom"
            value="Contest is active"
            color={fieldValidation.activeFrom.valid ? "" : "failure"}
          />
          <div className="m-2 flex gap-2">
            <div>
              <Label
                value="from"
                color={fieldValidation.activeFrom.valid ? "" : "failure"}
              />
              <InputDatepicker
                name="activeFrom"
                onChange={(date) => handleDateSelected(date, "activeFrom")}
                value={inputValues.activeFrom}
              />
            </div>
            <div>
              <Label
                htmlFor="activeTo"
                value="to"
                color={fieldValidation.activeFrom.valid ? "" : "failure"}
              />
              <InputDatepicker
                name="activeTo"
                onChange={(date) => handleDateSelected(date, "activeTo")}
                value={inputValues.activeTo}
              />
            </div>
          </div>
        </div>
        <div className="m-2 flex flex-col">
          <Label
            htmlFor="mintingOpen"
            value="Minting is active for"
            className="mb-4"
            color={fieldValidation.mintingOpen.valid ? "" : "failure"}
          />
          <TextInput
            id="mintingOpen"
            placeholder="0"
            required
            addon="Hours"
            value={inputValues.mintingOpen}
            onChange={(e) => handleInputChange(e, "mintingOpen")}
            color={fieldValidation.mintingOpen.valid ? "" : "failure"}
            helperText={fieldValidation.mintingOpen.msg}
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
