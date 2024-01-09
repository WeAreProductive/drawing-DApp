import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import VouchersList from "../components/VouchersList";
import { GraphQLProvider } from "../context/GraphQLContext";
const Vouchers = () => {
  return (
    <GraphQLProvider>
      <Sheet>
        <SheetTrigger>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Menu strokeWidth={1.5} className="h-6 w-6" />
            Vouchers
          </div>
        </SheetTrigger>
        <SheetContent side="left" className="sm:w-[640px] sm:max-w-full">
          <SheetHeader>
            <SheetTitle>Vouchers</SheetTitle>
            <VouchersList />
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </GraphQLProvider>
  );
};

export default Vouchers;
