import { Link } from "react-router-dom";
import { ContestType } from "../../shared/types";
import { sliceAccountStr, timestampToDate } from "../../utils";

const ContestBlockLight = ({ data }: { data: ContestType }) => {
  const {
    id,
    title,
    description,
    created_by,
    active_from,
    active_to,
    minting_active,
    minting_price,
    drawings_count,
  } = data;
  return (
    <div className="rounded-lg border bg-background p-2">
      <Link to={`/contest/${id}`}>
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
          minting is Open for: {minting_active} hours
        </span>
        <span className="block text-xs">minting price: {minting_price} </span>
        <span className="block text-xs">
          Number of drawings: {drawings_count}
        </span>
      </Link>
    </div>
  );
};

export default ContestBlockLight;
