import CanvasSnapshot from "./CanvasSnapshot";
import { useCanvasContext } from "../../context/CanvasContext";

const DrawingContributorsList = () => {
  const { currentDrawingData } = useCanvasContext();
  console.log({ currentDrawingData });
  return (
    currentDrawingData && (
      <div className="rounded-xl bg-card p-6">
        <div className="-mx-1 flex flex-wrap">drawing contributors list</div>
      </div>
    )
  );
};

export default DrawingContributorsList;
