import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import VouchersList from "./VouchersList";
import { GraphQLProvider } from "../../context/GraphQLContext";
const Vouchers = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Menu strokeWidth={1.5} className="h-6 w-6" />
          <span className="hidden sm:inline-block">My NFTs</span>
        </div>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="overflow-y-auto sm:w-[640px] sm:max-w-full"
      >
        <SheetHeader>
          <SheetTitle>My NFTs</SheetTitle>
          <GraphQLProvider>
            <VouchersList />
          </GraphQLProvider>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default Vouchers;
