import { ethers } from "ethers";
import { useGetNoticesQuery } from "../../generated/graphql";
import { useWallets } from "@web3-onboard/react";
import { useEffect, useState } from "react";
import { DrawingInputExtended, DataNoticeEdge } from "../../shared/types";
import DrawingsList from "./DrawingsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import pako from "pako";
import { useInspect } from "../../hooks/useInspect";

const ImagesListRollups = () => {
  const [connectedWallet] = useWallets();
  const { inspectCall } = useInspect();
  const account = connectedWallet.accounts[0].address;
  const [myDrawings, setMyDrawings] = useState<DrawingInputExtended[] | null>(
    null,
  );
  const [noticeDrawings, setNoticeDrawings] = useState<
    DrawingInputExtended[] | null
  >(null);

  const initDrawingsData = async () => {
    const data = await inspectCall("drawings");
    setNoticeDrawings(data);
  };

  useEffect(() => {
    initDrawingsData();
  }, []);

  return (
    <div className="flex">
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">My Drawings</TabsTrigger>
          <TabsTrigger value="password">All Drawings</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="flex">
          <ScrollArea className="max-h-[calc(100svh-var(--header-height)-120px)]">
            <DrawingsList drawings={myDrawings} />
          </ScrollArea>
        </TabsContent>
        <TabsContent value="password" className="flex">
          <ScrollArea className="max-h-[calc(100svh-var(--header-height)-120px)]">
            <DrawingsList drawings={noticeDrawings} />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImagesListRollups;
