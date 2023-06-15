import { init } from "@web3-onboard/react";
import injectedModule from "@web3-onboard/injected-wallets";
import { CanvasContextProvider } from "./context/CanvasContext";
import Network from "./components/Network";
import ImagesListRollups from "./components/ImagesRollups";
import DrawingControls from "./components/Drawing/DrawingControls";
import FabricJSCanvas from "./components/FabricJSCanvas";
import CanvasControls from "./components/CanvasControls";
import "./App.css";

import configFile from "./config/config.json";

const config = configFile;

const injected = injectedModule();

init({
  wallets: [injected],
  chains: Object.entries(config).map(([k, v], i) => ({
    id: k,
    token: v.token,
    label: v.label,
    rpcUrl: v.rpcUrl,
  })),

  appMetadata: {
    name: "Drawing DApp",
    icon: "<svg><svg/>",
    description: "Demo app for Cartesi Rollups",
    recommendedInjectedWallets: [
      { name: "MetaMask", url: "https://metamask.io" },
    ],
  },
});

const App = () => {
  return (
    <div>
      <Network />
      <div className="App">
        <CanvasContextProvider>
          {/* <ImagesListRollups /> */}
          <div className="canvas-wrapper">
            <FabricJSCanvas />
            <div className="controls-container">
              <DrawingControls />
              <CanvasControls />
            </div>
          </div>
        </CanvasContextProvider>
      </div>
    </div>
  );
};

export default App;
