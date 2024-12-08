import { useState } from "react";
import moment from "moment";
import Datepicker from "tailwind-datepicker-react";

const now = moment().utc(); // @TODO check formatting
// https://www.npmjs.com/package/tailwind-datepicker-react

const InputDatepicker = ({
  onChange,
  name,
  value,
}: {
  onChange: (date: Date) => void;
  name: string;
  value: any;
}) => {
  const [show, setShow] = useState(false);
  const options = {
    autoHide: true,
    todayBtn: true,
    clearBtn: true,
    clearBtnText: "Clear",
    minDate: now,
    theme: {
      // background: "bg-gray-700 dark:bg-gray-800",
      disabledText: "bg-gray-100",
    },
    icons: {
      // () => ReactElement | JSX.Element
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
  };

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
    </div>
  );
};
export default InputDatepicker;
