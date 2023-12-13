import CanvasSnapshot from "./CanvasSnapshot";
import { ethers } from "ethers";
import { useNoticesQuery } from "../../generated/graphql";
import { useToast } from "@chakra-ui/react";
import { useWallets } from "@web3-onboard/react";
import { useEffect } from "react";
import { DAPP_STATE } from "../../shared/constants";
import { useCanvasContext } from "../../context/CanvasContext";

const ImagesListRollups = () => {
  const { dappState, setDappState } = useCanvasContext();
  const [connectedWallet] = useWallets();
  const [result, reexecuteQuery] = useNoticesQuery();
  const { data, fetching, error } = result;
  const mineDrawings: any[] = [];
  const account = connectedWallet.accounts[0].address;
  useEffect(() => {
    if (result.fetching) return;
    if (dappState !== DAPP_STATE.CANVAS_SAVE) return;

    reexecuteQuery({ requestPolicy: "network-only" });

    setDappState(DAPP_STATE.CANVAS_INIT);
  }, [result.fetching, reexecuteQuery, dappState]);
  
if (fetching) return <p className="fetching">Loading...</p>;
if (error) return <p className="error">Oh no... {error.message}</p>;

if (!data || !data.notices) return <p className="no-notices">No notices</p>;
  // @TODO cache results, reexecute query notices on new canvas saved
  const drawingsData = data.notices.edges.map(({ node }: any) => {
    let payload = node?.payload;
    if (payload) {
      try {
        payload = ethers.utils.toUtf8String(payload);
      } catch (e) {
        payload = payload;
      }
    } else {
      payload = "(empty)";
    }
    const drawingData = JSON.parse(payload);
    if (drawingData.owner.toLowerCase() == account.toLowerCase()) {
      mineDrawings.push(drawingData);
    }
    return drawingData;
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
