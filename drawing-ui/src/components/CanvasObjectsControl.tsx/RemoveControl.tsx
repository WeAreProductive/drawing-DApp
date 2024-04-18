import { useState } from "react";
import { useCanvasContext } from "../../context/CanvasContext";
import { INITIAL_DRAWING_OPTIONS } from "../../shared/constants";
// import fabric from "fabric/fabric-impl";
// https://stackoverflow.com/questions/56105165/erasing-lines-on-fabric-js
// https://dinesh-rawat.medium.com/mastering-object-deletion-in-fabric-js-5-effortlessly-remove-selected-elements-programmatically-1c81cfc8f9b
// canvas.remove(canvas.getActiveObject[0]
// window.deleteObject = function() {
//   canvas.getActiveObject().remove();
// }

const RemoveControl = () => {
  const { canvas } = useCanvasContext();
  const removeActiveObject = () => {
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;
    canvas.remove(active);
  };

  return <button onClick={removeActiveObject}>Remove Active Abject</button>;
};

export default RemoveControl;
