import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Balance } from "./Balance/Balance";
import Vouchers from "./Vouchers/Vouchers";
import { Link } from "react-router-dom";
import { useConnectionContext } from "../context/ConnectionContext";
const queryClient = new QueryClient();
const Header = () => {
  const { connectedWallet } = useConnectionContext();

  return (
    <div className="flex items-center flex-shrink-0 px-6 h-header">
      {connectedWallet ? (
        <>
          <Vouchers />
          <div className="flex items-center gap-2 mx-3 text-sm font-semibold">
            <Link to="/browse">Browse Drawings</Link>
            <Link to="/drawing">Draw</Link>
            <Link to="/contests">Contests</Link>
            <Link to="/contest/create">Create Contest</Link>
            <QueryClientProvider client={queryClient}>
              <Balance />
            </QueryClientProvider>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Header;
