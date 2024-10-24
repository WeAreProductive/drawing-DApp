import { Balance } from "./Balance/Balance";
import Vouchers from "./Vouchers/Vouchers";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="flex h-header flex-shrink-0 items-center px-6">
      <Vouchers />
      <div className="mx-3 flex items-center gap-2 text-sm font-semibold">
        <Link to="/browse">Browse Drawings</Link>
        <Link to="/drawing">Draw</Link>

        <Balance />
      </div>
    </div>
  );
};

export default Header;
