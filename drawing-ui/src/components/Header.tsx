import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Balance } from "./Balance/Balance";
import Vouchers from "./Vouchers/Vouchers";
import { Link } from "react-router-dom";
import { useConnectionContext } from "../context/ConnectionContext";

const queryClient = new QueryClient();

const Header = () => {
  const { connectedWallet } = useConnectionContext();

  return (
    <div className="mb-8 flex h-header flex-shrink-0 items-center border-b border-slate-300 px-6">
      {connectedWallet && (
        <>
          <Vouchers />
          <div className="mx-3 ml-6 flex items-center gap-4 text-sm font-semibold md:gap-6">
            <Link to="/browse">
              Browse <span className="hidden sm:inline-block">Drawings</span>
            </Link>
            <QueryClientProvider client={queryClient}>
              <Balance />
            </QueryClientProvider>
            <a
              href="/drawing"
              className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md border border-input bg-primary px-4 py-2 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-primary/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              New Drawing
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default Header;
