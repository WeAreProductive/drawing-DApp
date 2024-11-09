import {
  TelegramShareButton,
  TelegramIcon,
  TwitterShareButton,
  XIcon,
} from "react-share";

const CanvasShare = (currentDrawingData) => {
  return (
    <div className="flex flex-row items-center gap-2">
      <span className="text-sm">Share:</span>
      <TwitterShareButton
        title={`Hey, check out my DrawingCanvas ${currentDrawingData.currentDrawingData.title}!`}
        url={window.location.href}
      >
        <XIcon size={32} round={true} />
      </TwitterShareButton>
      <TelegramShareButton
        title={`Hey, check out my DrawingCanvas ${currentDrawingData.currentDrawingData.title}!`}
        url={window.location.href}
      >
        <TelegramIcon size={32} round={true} />
      </TelegramShareButton>
    </div>
  );
};

export default CanvasShare;
