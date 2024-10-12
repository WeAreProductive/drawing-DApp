import type { CustomFlowbiteTheme } from "flowbite-react";
import { Button } from "flowbite-react";

const customTheme: CustomFlowbiteTheme["button"] = {
  color: {
    default: "bg-grey-500 hover:bg-grey-600 text-white",
    red: "bg-red-600 hover:bg-red-500 text-white",
    green: "bg-green-500 hover:bg-green-400 text-white",
  },
};

export default function DialogButton({ color, children }: any) {
  return (
    <Button theme={customTheme} color={color} className="m-2">
      {children}
    </Button>
  );
}
