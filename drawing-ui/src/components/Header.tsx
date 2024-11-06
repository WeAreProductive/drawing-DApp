import { useCanvasContext } from "../context/CanvasContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Balance } from "./Balance/Balance";
import Vouchers from "./Vouchers/Vouchers";
import { Link } from "react-router-dom";

const queryClient = new QueryClient();

const Header = () => {
  return (
    <div className="mb-8 flex h-header flex-shrink-0 items-center border-b border-slate-300 px-6">
      <Vouchers />
      <div className="mx-3 ml-6 flex items-center gap-6 text-sm font-semibold">
        <Link to="/browse">Browse Drawings</Link>
        <QueryClientProvider client={queryClient}>
          <Balance />
        </QueryClientProvider>
        <Link
          to="/drawing"
          className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md border border-input bg-primary px-4 py-2 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-primary/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          New Drawing
        </Link>
      </div>
    </div>
  );
};

export default Header;
