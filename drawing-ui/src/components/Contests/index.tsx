import ContestsList from "./ContestsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";

const Contests = () => {
  return (
    <div className="flex">
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="future">Future</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="flex">
          <ScrollArea className="max-h-[calc(100svh-var(--header-height)-120px)]">
            <ContestsList contestType="active" />
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