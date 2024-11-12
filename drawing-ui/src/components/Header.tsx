import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Balance } from "./Balance/Balance";
import Vouchers from "./Vouchers/Vouchers";
import { Link } from "react-router-dom";
import { useConnectionContext } from "../context/ConnectionContext";
const queryClient = new QueryClient();
const Header = () => {
  const { connectedWallet } = useConnectionContext();

  return (
    <div className="flex h-header flex-shrink-0 items-center px-6">
      {connectedWallet ? (
        <>
          <Vouchers />
          <div className="mx-3 flex items-center gap-2 text-sm font-semibold">
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
