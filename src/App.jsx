import "./App.css";
import { CanvasContextProvider } from "./context/CanvasContext";
import DrawingControls from "./components/Drawing/DrawingControls";
import FabricJSCanvas from "./components/FabricJSCanvas";
import CanvasControls from "./components/CanvasControls";

const App = () => {
  return (
    <CanvasContextProvider>
      <div className="App">
        <FabricJSCanvas />
        <DrawingControls />
        <CanvasControls />
      </div>
    </CanvasContextProvider>
  );
};

export default App;
