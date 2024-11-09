import DrawingsList from "./DrawingsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";

const ImagesListRollups = () => {
  return (
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">My Drawings</TabsTrigger>
        <TabsTrigger value="password">All Drawings</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <ScrollArea>
          <DrawingsList drawingsType="user" />
        </ScrollArea>
      </TabsContent>
      <TabsContent value="password">
        <DrawingsList drawingsType="all" />
      </TabsContent>
    </Tabs>
  );
};

export default ImagesListRollups;
