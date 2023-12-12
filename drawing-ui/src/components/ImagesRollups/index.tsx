import { useState, useEffect } from "react";
import CanvasSnapshot from "./CanvasSnapshot";
import { ethers } from "ethers";
import { useNoticesQuery } from "../../generated/graphql";
import { useToast } from "@chakra-ui/react";
import { useWallets } from "@web3-onboard/react";

const ImagesListRollups = () => {
  const [connectedWallet] = useWallets();
  // const toast = useToast();
  const [result, reexecuteQuery] = useNoticesQuery();
  const { data, fetching, error } = result;
  const mineDrawings: any[] = [];
  const account = connectedWallet.accounts[0].address;

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  if (!data || !data.notices) return <p>No notices</p>;
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
  // return (
  //   <div>
  //     <button onClick={() => reexecuteQuery({ requestPolicy: "network-only" })}>
  //       Reload
  //     </button>
  //     <table>
  //       <thead>
  //         <tr>
  //           <th>Epoch</th>
  //           <th>Input Index</th>
  //           <th>Notice Index</th>
  //           <th>Payload</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {notices.length === 0 && (
  //           <tr>
  //             <td colSpan={4}>no notices</td>
  //           </tr>
  //         )}
  //         {notices.map((n: any, idx) => (
  //           <tr key={idx}>
  //             <td>{n.payload}</td>
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>
  //   </div>
  // );
  return (
    @TODO move the lists in separate component
    <>
      <div className="list-wrapper">
        <div className="list-header">
          <h5>Mine Drawings</h5>
          <i>Updates on canvas save</i>
        </div>
        <div className="images-list">
          <div className="images-list-box">
            {mineDrawings.length > 0 ? (
              mineDrawings.map((drawing) => {
                try {
                  return <CanvasSnapshot key={drawing.id} src={drawing} />;
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
          <h5>All Svgs saved in Rollups</h5>
          <i>Updates on canvas save</i>
        </div>
        <div className="images-list">
          <div className="images-list-box">
            {drawingsData.length > 0 ? (
              drawingsData.map((drawing) => {
                try {
                  return <CanvasSnapshot key={drawing.id} src={drawing} />;
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
    </>
  );
};

export default ImagesListRollups;
