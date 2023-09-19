import { useConnectWallet } from "@web3-onboard/react";

const Network = () => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  return (
    <>
      {!wallet ? (
        <button onClick={() => connect()}>
          {connecting ? "connecting" : "connect"}
        </button>
      ) : (
        <button onClick={() => disconnect(wallet)}>Disconnect Wallet</button>
      )}
    </>
  );
};

export default Network;
