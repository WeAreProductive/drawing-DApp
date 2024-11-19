import ContestsList from "./ContestsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";

const Contests = () => {
  return (
    <div className="flex">
      <Tabs defaultValue="active-drawing">
        <TabsList>
          <TabsTrigger value="active-drawing">Active: Drawing</TabsTrigger>
          <TabsTrigger value="active-minting">Active: Minting</TabsTrigger>
          <TabsTrigger value="future">Future</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="active-drawing" className="flex">
          <ScrollArea className="max-h-[calc(100svh-var(--header-height)-120px)]">
            <ContestsList contestType="active-drawing" />
          </ScrollArea>
        </TabsContent>
        <TabsContent value="active-minting" className="flex">
          <ScrollArea className="max-h-[calc(100svh-var(--header-height)-120px)]">
            <ContestsList contestType="active-minting" />
          </ScrollArea>
        </TabsContent>
        <TabsContent value="future" className="flex">
          <ScrollArea className="max-h-[calc(100svh-var(--header-height)-120px)]">
            <ContestsList contestType="future" />
          </ScrollArea>
        </TabsContent>
        <TabsContent value="completed" className="flex">
          <ScrollArea className="max-h-[calc(100svh-var(--header-height)-120px)]">
            <ContestsList contestType="completed" />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default Contests;
