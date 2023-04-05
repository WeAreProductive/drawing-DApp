import "./App.css";
import { CanvasContextProvider } from "./context/CanvasContext";
import ImagesList from "./components/Images";
import DrawingControls from "./components/Drawing/DrawingControls";
import FabricJSCanvas from "./components/FabricJSCanvas";
import CanvasControls from "./components/CanvasControls";

const App = () => {
  return (
    <CanvasContextProvider>
      <div className="App">
        <ImagesList />
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
