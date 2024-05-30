import { ethers } from "ethers";
import { useGetNoticesQuery } from "../../generated/graphql";
import { useWallets } from "@web3-onboard/react";
import { useEffect, useState } from "react";
import { DrawingInputExtended, DataNoticeEdge } from "../../shared/types";
import DrawingsList from "./DrawingsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import pako from "pako";

const ImagesListRollups = () => {
  const [connectedWallet] = useWallets();
  const account = connectedWallet.accounts[0].address;
  const [myDrawings, setMyDrawings] = useState<DrawingInputExtended[] | null>(
    null,
  );
  const [noticeDrawings, setNoticeDrawings] = useState<
    DrawingInputExtended[] | null
  >(null);
  const [cursor, setCursor] = useState<string | null | undefined | null>(null);
  const [result, reexecuteQuery] = useGetNoticesQuery({
    variables: { cursor },
    pause: true,
  });
  const { data, error } = result;

  useEffect(() => {
    if (result.fetching) return;
    // Set up to refetch in one second, if the query is idle
    //Retrieve notices every 1000 ms
    const timerId = setTimeout(() => {
      reexecuteQuery({ requestPolicy: "network-only" });
    }, 1000);
    const length = data?.notices?.edges?.length;
    if (length) {
      // Update cursor so that next GraphQL poll retrieves only newer data
      setCursor(data.notices.pageInfo.endCursor);
    }
    return () => clearTimeout(timerId);
  }, [result.fetching, reexecuteQuery]);

  useEffect(() => {
    const newDrawings = data?.notices.edges.map(({ node }: DataNoticeEdge) => {
      let payload = node?.payload;
      let drawingData;
      if (payload) {
        try {
          payload = ethers.utils.toUtf8String(payload);
        } catch (e) {
          payload = payload;
        }
      } else {
        payload = "(empty)";
      }
      try {
        const parsedPayload = JSON.parse(payload);
        const drawingData = pako.inflate(parsedPayload, {
          to: "string",
        });
        return JSON.parse(drawingData);
      } catch (e) {
        console.log(e);
      }
    });

    // Concat new drawings with previous ones
    if (newDrawings && newDrawings.length) {
      // Add new rendered drawings to stored data
      const ret = noticeDrawings
        ? noticeDrawings.concat(newDrawings)
        : newDrawings;
      if (!ret) return;
      setNoticeDrawings(ret);
    }

    if (!newDrawings) return;

    const newMyDrawings = newDrawings.filter(
      (drawing) => drawing.owner.toLowerCase() == account.toLowerCase(),
    );

    if (newMyDrawings && newMyDrawings.length) {
      // Add new rendered drawings to stored data
      const retMine = myDrawings
        ? myDrawings.concat(newMyDrawings)
        : newMyDrawings;
      if (!retMine) return;
      setMyDrawings(retMine);
    }
  }, [data]);

  // reset my drawings on account change
  useEffect(() => {
    if (!noticeDrawings) return;
    const newMyDrawings = noticeDrawings.filter(
      (drawing) => drawing.owner.toLowerCase() == account.toLowerCase(),
    );
    setMyDrawings(newMyDrawings);
  }, [account]);

  if (error) return <p className="error">Oh no... {error.message}</p>;

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
