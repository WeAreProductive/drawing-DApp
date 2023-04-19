import { useState, useEffect } from "react";
import { useCanvasContext } from "../../context/CanvasContext";
import CanvasSnapshot from "./CanvasSnapshot";
import { ethers } from "ethers";
import { useQuery, gql } from "@apollo/client";
import { useToast } from "@chakra-ui/react";
import { storeAsFiles } from "../../services/canvas";

// GraphQL query to retrieve notices given a cursor
const GET_NOTICES = gql`
  query GetNotices($cursor: String) {
    notices(first: 10, after: $cursor) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        payload
        index
        input {
          index
          epoch {
            index
          }
        }
      }
    }
  }
`;

// This component renders all the Notices produced by
// saving a canvas - sending the canvas svg to rollups.
// The Dapp uses notices to display the Inputs it receives.
// This component sends GraphQL requests to the Cartesi Rollups Query Server

const ImagesListRollups = () => {
  const [canvasImages, setCanvasImages] = useState([]);
  const { canvasesList } = useCanvasContext();
  useEffect(() => {
    setCanvasImages(canvasesList);
  }, [canvasesList]);

  const toast = useToast();
  const [noticeEchoes, setNoticeEchoes] = useState([]);
  const [cursor, setCursor] = useState(null);
  // Retrieve notices every 500 ms
  const { loading, error, data } = useQuery(GET_NOTICES, {
    variables: { cursor },
    pollInterval: 500,
  });
  console.log(loading, error, data);
  // Check query status
  useEffect(() => {
    if (loading) {
      toast({
        title: "Loading Rollups Query Server results",
        description: "last notice payload is in the end of the row",
        status: "info",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
    if (error) {
      toast({
        title: "Error querying Query Server ",
        description: `Check browser console for details`,
        status: "error",
        duration: 20000,
        isClosable: true,
        position: "top-right",
      });
      console.error(`Error querying Query Server : ${JSON.stringify(error)}`);
    }
  });

  // Check query result
  const length = data?.notices?.nodes?.length;
  if (length) {
    // Update cursor so that next GraphQL poll retrieves only newer data
    setCursor(data.notices.pageInfo.endCursor);
  }

  // Render new echoes
  const newEchoes = data?.notices?.nodes;

  // Concat new echoes with previous ones
  let ret = noticeEchoes;
  if (newEchoes && newEchoes.length) {
    // Add new rendered echoes to stored data
    console.log("there are new echoes, convert them to files");

    //@TODO - ad a name to the canvas before sending to rollups inittially
    //store as file
    storeAsFiles(newEchoes);
    ret = noticeEchoes.concat(newEchoes);
    setNoticeEchoes(ret);
  }
  return (
    <div className="list-wrapper">
      <div className="list-header">
        <h5>Svgs saved in Rollups</h5>
        <i>Updates on canvas save</i>
      </div>
      <div className="images-list">
        <div className="images-list-box">
          {noticeEchoes.length > 0 ? (
            noticeEchoes.map((node) => {
              // Render echo from notice
              const echo = ethers.utils.toUtf8String(node.payload);
              try {
                const echoParsed = JSON.parse(echo);
                return <CanvasSnapshot key={`${node.id}`} src={echoParsed} />;
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
