import { useEffect, useState } from "react";
import moment from "moment";
import Datepicker from "tailwind-datepicker-react";

const now = moment().utc(); // @TODO check formatting
// https://www.npmjs.com/package/tailwind-datepicker-react

const InputDatepicker = ({
  onChange,
  name,
  value,
  validation,
}: {
  onChange: (date: Date) => void;
  name: string;
  value: any;
  validation: any;
}) => {
  const [show, setShow] = useState(false);
  const [options, setOptions] = useState({
    autoHide: true,
    todayBtn: true,
    clearBtn: true,
    clearBtnText: "Clear",
    minDate: now,
    theme: {
      disabledText: "bg-gray-100",
      input: "",
    },
    icons: {
      prev: () => <span>&lt;&lt;</span>,
      next: () => <span>&gt;&gt;</span>,
    },
    datepickerClassNames: "top-12",
    language: "en",
    weekDays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    inputNameProp: name,
    inputIdProp: name,
    inputPlaceholderProp: "Select Date",
    inputDateFormatProp: {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  });
  const inputClassNames = validation.valid
    ? ""
    : "text-red-900 bg-red-50 border-red-500";

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState, // Keep all other properties
      theme: {
        disabledText: "bg-gray-100",
        input: validation.valid ? "" : "text-red-900 bg-red-50 border-red-500",
      },
    }));
  }, [validation]);

  const handleClose = (state: boolean) => {
    setShow(state);
  };

  return (
    <div>
      <Datepicker
        options={options}
        onChange={onChange}
        show={show}
        setShow={handleClose}
        value={value}
      />
      {/* Display error message */}
      {!validation.valid && validation.msg && (
        <p className="mt-1 text-sm text-red-900">{validation.msg}</p>
      )}
    </div>
  );
};
export default InputDatepicker;
