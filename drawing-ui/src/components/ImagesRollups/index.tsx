import CanvasSnapshot from "./CanvasSnapshot";
import { ethers } from "ethers";
import { useGetNoticesQuery } from "../../generated/graphql";
import { useWallets } from "@web3-onboard/react";
import { useEffect, useState } from "react";
import { DrawingInputExtended } from "../../shared/types";
type DataNoticeEdge = {
  __typename?: "NoticeEdge" | undefined;
  node: {
    __typename?: "Notice" | undefined;
    index: number;
    payload: string;
    input: {
      __typename?: "Input" | undefined;
      index: number;
    };
  };
};
const ImagesListRollups = () => {
  const [connectedWallet] = useWallets();
  const account = connectedWallet.accounts[0].address;
  const [mineDrawings, setMineDrawings] = useState<
    DrawingInputExtended[] | null
  >(null);
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
        drawingData = JSON.parse(payload);
        return drawingData;
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
    const newMineDrawings = newDrawings.filter(
      (drawing) => drawing.owner.toLowerCase() == account.toLowerCase()
    );
    if (newMineDrawings && newMineDrawings.length) {
      // Add new rendered drawings to stored data
      const retMine = mineDrawings
        ? mineDrawings.concat(newMineDrawings)
        : newMineDrawings;
      if (!retMine) return;
      setMineDrawings(retMine);
    }
  }, [data]);
  if (error) return <p className="error">Oh no... {error.message}</p>;
  if (!data || !data.notices) return <p className="no-notices">No notices</p>;

  return (
    <div className="lists-container">
      <div className="list-wrapper">
        <div className="list-header">
          <h5>All Drawings</h5>
        </div>
        <div className="images-list">
          <div className="images-list-box">
            {noticeDrawings && noticeDrawings.length > 0 ? (
              noticeDrawings.map((drawing, idx) => {
                try {
                  return (
                    <CanvasSnapshot
                      key={`${drawing.id}-${idx}`}
                      src={drawing}
                    />
                  );
                } catch (e) {
                  console.log(e);
                }
              })
            ) : (
              <div className="canvas-image">
                Canvas shanpshots will appear here...
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="list-wrapper">
        <div className="list-header">
          <h5>Mine Drawings</h5>
        </div>
        <div className="images-list">
          <div className="images-list-box">
            {mineDrawings && mineDrawings.length > 0 ? (
              mineDrawings.map((drawing, idx) => {
                try {
                  return (
                    <CanvasSnapshot
                      key={`${drawing.id}-${idx}`}
                      src={drawing}
                    />
                  );
                } catch (e) {
                  console.log(e);
                }
              })
            ) : (
              <div className="canvas-image">
                Canvas shanpshots will appear here...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagesListRollups;
