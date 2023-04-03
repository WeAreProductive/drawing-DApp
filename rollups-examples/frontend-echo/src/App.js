import "./App.css";
import { useState } from "react";
import { CanvasContextProvider } from "./context/CanvasContext";
// import ImagesList from "./components/Images";
import DrawingControls from "./components/Drawing/DrawingControls";
import FabricJSCanvas from "./components/FabricJSCanvas";
import CanvasControls from "./components/CanvasControls";

// Simple App to present the Input field and produced Notices
function App() {
    const [accountIndex] = useState(0);

    return (
        // <div className="App">
        //     <header className="App-header">
        //         <h1>Echo DApp</h1>
        //         <Flex>
        //             <RoarForm accountIndex={accountIndex} />
        //             <Spacer />
        //             {/* <Echoes /> */}
        //         </Flex>
        //     </header>
        // </div>
        <CanvasContextProvider>
            <div className="App">
                {/* <ImagesList /> */}
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
}

export default App;
