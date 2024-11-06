import { ContestType } from "../../shared/types";
import { sliceAccountStr, timestampToDate } from "../../utils";

const Contest = ({ data }: { data: ContestType }) => {
  console.log({ data });
  const {
    title,
    description,
    created_by,
    active_from,
    active_to,
    mintingOpen,
    mintingPrice,
    drawings,
  } = data;
  return (
    <div className="rounded-lg border bg-background p-2">
      <span className="block text-xs">{title}</span>
      <span className="block text-xs">{description}</span>
      <span className="block text-xs">
        created by: {sliceAccountStr(created_by)}
      </span>
      <span className="block text-xs">
        active from: {timestampToDate(Number(active_from))}
      </span>
      <span className="block text-xs">
        active to: {timestampToDate(Number(active_to))}
      </span>
      <span className="block text-xs">
        minting is Open for: {mintingOpen} hours
      </span>
      <span className="block text-xs">minting price: {mintingPrice} </span>
      <span className="block text-xs">
        Number of drawings:{" "}
        {drawings && drawings.length > 0 ? drawings.length : 0}{" "}
      </span>
    </div>
  );
};

export default Contest;
