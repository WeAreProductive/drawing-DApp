import { CustomFlowbiteTheme, Select } from "flowbite-react";
export const customThemeSelect: CustomFlowbiteTheme["select"] = {};
export function SelectInput() {
  return (
    <Select id="contests" required>
      <option>----</option>
      <option>United States</option>
      <option>Canada</option>
      <option>France</option>
      <option>Germany</option>
    </Select>
  );
}
