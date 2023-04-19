import { CanvasContextProvider } from "./context/CanvasContext";
import ImagesList from "./components/Images";
import ImagesListRollups from "./components/ImagesRollups";
import DrawingControls from "./components/Drawing/DrawingControls";
import FabricJSCanvas from "./components/FabricJSCanvas";
import CanvasControls from "./components/CanvasControls";
import "./App.css";

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
        <ImagesListRollups />
      </div>
      <img
        src="http://localhost:3000/public/canvas-images/1681894496264-canvas.png"
        alt="new"
      />
    </CanvasContextProvider>
  );
};

export default App;
