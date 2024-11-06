import { ContestType } from "../../shared/types";

const Contest = ({ data }: { data: ContestType }) => {
  return (
    <>
      <div>{data.title}</div>
      <div>created by: {data.created_by}</div>
    </>
  );
};

export default Contest;
