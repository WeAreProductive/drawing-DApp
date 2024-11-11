import { CustomFlowbiteTheme, Select } from "flowbite-react";
import { ContestType } from "../../../shared/types";
import { ChangeEventHandler } from "react";
export const customThemeSelect: CustomFlowbiteTheme["select"] = {};
export function SelectInput({
  id,
  data,
  onChange,
  value,
}: {
  id: string;
  data: ContestType[];
  onChange: ChangeEventHandler<HTMLSelectElement>;
  value: string;
}) {
  return (
    <Select id={id} onChange={onChange} value={value}>
      <option value="0">----</option>
      {data && data.length > 0
        ? data.map(({ title, id }) => {
            return <option value={id}>{title}</option>;
          })
        : ""}
    </Select>
  );
}
