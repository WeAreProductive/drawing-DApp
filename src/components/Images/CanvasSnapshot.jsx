const CanvasSnapshot = ({ src }) => {
  return (
    <div className="canvas-image">
      <img src={`./canvas-images/${src}`} />
    </div>
  );
};

export default CanvasSnapshot;
