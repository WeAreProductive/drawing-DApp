import DrawingsList from "./DrawingsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";

const ImagesListRollups = () => {
  return (
    <div className="flex">
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">My Drawings</TabsTrigger>
          <TabsTrigger value="password">All Drawings</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="flex">
          <ScrollArea className="max-h-[calc(100svh-var(--header-height)-120px)]">
            <DrawingsList drawingsType="user" />
          </ScrollArea>
        </TabsContent>
        <TabsContent value="password" className="flex">
          <ScrollArea className="max-h-[calc(100svh-var(--header-height)-120px)]">
            <DrawingsList drawingsType="all" />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImagesListRollups;
