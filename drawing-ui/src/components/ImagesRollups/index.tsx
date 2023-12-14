import CanvasSnapshot from "./CanvasSnapshot";
import { ethers } from "ethers";
import { useNoticesQuery } from "../../generated/graphql";
import { useToast } from "@chakra-ui/react";
import { useWallets } from "@web3-onboard/react";
import { useEffect } from "react";
import { DAPP_STATE } from "../../shared/constants";
import { useCanvasContext } from "../../context/CanvasContext";
import { DrawingInput } from "../../shared/types";
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
  const { dappState, setDappState } = useCanvasContext();
  const [connectedWallet] = useWallets();
  const [result, reexecuteQuery] = useNoticesQuery();
  const { data, fetching, error } = result;
  const mineDrawings: DrawingInput[] = [];
  const account = connectedWallet.accounts[0].address;
  useEffect(() => {
    if (result.fetching) return;
    if (dappState !== DAPP_STATE.canvasSave) return;

    reexecuteQuery({ requestPolicy: "network-only" });

    setDappState(DAPP_STATE.canvasInit);
  }, [result.fetching, reexecuteQuery, dappState]);

  if (fetching) return <p className="fetching">Loading...</p>;
  if (error) return <p className="error">Oh no... {error.message}</p>;

  if (!data || !data.notices) return <p className="no-notices">No notices</p>;

  const drawingsData = data.notices.edges.map(({ node }: DataNoticeEdge) => {
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
      // @TODO check drawing data has drawing prop and is not empty
      if (drawingData.owner?.toLowerCase() == account.toLowerCase()) {
        mineDrawings.push(drawingData);
      }
      return drawingData;
    } catch (e) {
      console.log(e);
    }
  });

  return (
    <div className="lists-container">
      <div className="list-wrapper">
        <div className="list-header">
          <h5>All Svgs saved in Rollups</h5>
          <i>Updates on canvas save</i>
        </div>
        <div className="images-list">
          <div className="images-list-box">
            {drawingsData.length > 0 ? (
              drawingsData.map((drawing, idx) => {
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
          <i>Updates on canvas save</i>
        </div>
        <div className="images-list">
          <div className="images-list-box">
            {mineDrawings.length > 0 ? (
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
