import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import VouchersList from "./VouchersList";
import { GraphQLProvider } from "../../context/GraphQLContext";
import { VouchersView } from "./VouchersView";
const Vouchers = () => {
  return (
    <GraphQLProvider>
      <Sheet>
        <SheetTrigger>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Menu strokeWidth={1.5} className="h-6 w-6" />
            My NFTs
          </div>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="overflow-y-auto sm:w-[640px] sm:max-w-full"
        >
          <SheetHeader>
            <SheetTitle>My Vouchers</SheetTitle>
            {/* <VouchersList /> */}
            <VouchersView />
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </GraphQLProvider>
  );
};

export default Vouchers;
