import styled from "styled-components";

const StyledDiv = styled.div<any>`
  margin: 0 auto;
  width: 30px;
  height: 30px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #213547;
  border-radius: 50%;
  animation: spin 1s infinite linear;
  margin-top: 10%;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const CanvasSnapshotLoader = () => {
  return <StyledDiv />;
};

export default CanvasSnapshotLoader;
