import { useState, useEffect } from "react";
import { useCanvasContext } from "../../context/CanvasContext";
import CanvasSnapshot from "./CanvasSnapshot";
import { ethers } from "ethers";
import { useNoticesQuery } from "../../generated/graphql";
import { useToast } from "@chakra-ui/react";

const ImagesListRollups = () => {
  // const [canvasImages, setCanvasImages] = useState([]);
  // const { canvasesList } = useCanvasContext();
  // useEffect(() => {
  //   setCanvasImages(canvasesList);
  // }, [canvasesList]);

  const toast = useToast();
  // const [noticeEchoes, setNoticeEchoes] = useState([]);
  // const [cursor, setCursor] = useState(null);
  // @TODO Update list on new notice or reexecute query?
  const [result, reexecuteQuery] = useNoticesQuery();
  const { data, fetching, error } = result;

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  if (!data || !data.notices) return <p>No notices</p>;
  // @TODO filter only drawing notices
  const notices = data.notices.edges.map(({ node }: any) => {
    let payload = node?.payload;
    payload = ethers.utils.toUtf8String(payload);

    if (payload) {
      try {
        payload = ethers.utils.toUtf8String(payload);
        console.log(JSON.parse(payload));
      } catch (e) {
        payload = payload;
      }
    } else {
      payload = "(empty)";
    }
    return {
      // id: `${node?.id}`,
      // index: parseInt(node?.index),
      payload: `${payload}`,
      // input: node?.input || { epoch: {} },
    };
  });
  console.log(notices);
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
    <div className="list-wrapper">
      <div className="list-header">
        <h5>Svgs saved in Rollups</h5>
        <i>Updates on canvas save</i>
      </div>
      <div className="images-list">
        <div className="images-list-box">
          {notices.length > 0 ? (
            notices.map((node, idx) => {
              try {
                const drawingData = JSON.parse(node.payload);
                return <CanvasSnapshot key={idx} src={drawingData} />;
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
  );
};

export default ImagesListRollups;
