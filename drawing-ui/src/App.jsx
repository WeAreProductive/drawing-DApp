import { init } from "@web3-onboard/react";
import injectedModule from "@web3-onboard/injected-wallets";
import { CanvasContextProvider } from "./context/CanvasContext";
import Network from "./components/Network";
import ImagesListRollups from "./components/ImagesRollups";
import DrawingControls from "./components/Drawing/DrawingControls";
import FabricJSCanvas from "./components/FabricJSCanvas";
import CanvasControls from "./components/CanvasControls";
import blocknativeIcon from "./icons/blocknative-icon"; //@TODO use app's own icon instead
import "./App.css";

import configFile from "./config/config.json";

const config = configFile;

const injected = injectedModule();
//for more customizations look here
// https://github.com/kokolina1888/react-demo
// https://github.com/blocknative/react-demo/tree/master
init({
  connect: {
    autoConnectAllPreviousWallet: true,
  },
  wallets: [injected],
  chains: Object.entries(config).map(([k, v], i) => ({
    id: k,
    token: v.token,
    label: v.label,
    rpcUrl: v.rpcUrl,
  })),
  appMetadata: {
    name: "Drawing DApp",
    icon: blocknativeIcon,
    description: "Demo app for Cartesi Rollups",
    recommendedInjectedWallets: [
      { name: "MetaMask", url: "https://metamask.io" },
    ],
  },
  accountCenter: {
    desktop: {
      position: "topRight",
      enabled: true,
      minimal: false,
      // containerElement: "<div></div>", @TODO must be an existing DOM element selector ?!
    },
  },
  // theme: "dark",
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
