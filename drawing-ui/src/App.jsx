import { CanvasContextProvider } from "./context/CanvasContext";
import ImagesListRollups from "./components/ImagesRollups";
import DrawingControls from "./components/Drawing/DrawingControls";
import FabricJSCanvas from "./components/FabricJSCanvas";
import CanvasControls from "./components/CanvasControls";
import "./App.css";

const App = () => {
  return (
    <CanvasContextProvider>
      <div className="App">
        <ImagesListRollups />
        <div className="canvas-wrapper">
          <FabricJSCanvas />
          <div className="controls-container">
            <DrawingControls />
            <CanvasControls />
          </div>
        </div>
      </div>
    </CanvasContextProvider>
  );
};

export default App;
