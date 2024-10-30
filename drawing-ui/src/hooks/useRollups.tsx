import { useEffect, useState } from "react";
import { ethers, BigNumber } from "ethers";
import { useSetChain, useWallets } from "@web3-onboard/react";
import { ConnectedChain } from "@web3-onboard/core";

import {
  InputBox__factory,
  DAppAddressRelay__factory,
  CartesiDApp__factory,
  ERC721Portal__factory,
  EtherPortal__factory,
} from "@cartesi/rollups";

import { toast } from "sonner";
import pako from "pako";
import {
  DrawingInitialData,
  NetworkConfigType,
  RollupsContracts,
  RollupsInteractions,
  VoucherExtended,
} from "../shared/types";

import { useCanvasContext } from "../context/CanvasContext";

import configFile from "../config/config.json";
import { DAPP_STATE } from "../shared/constants";

const config: { [name: string]: NetworkConfigType } = configFile;

export const useRollups = (dAddress: string): RollupsInteractions => {
  const [contracts, setContracts] = useState<RollupsContracts | undefined>();
  const [{ connectedChain }] = useSetChain();
  const [connectedWallet] = useWallets();
  const [account, setAccount] = useState("0x");

  const [dappAddress] = useState<string>(dAddress);

  const {
    setDappState,
    canvas,
    setLoading,
    currentDrawingData,
    currentDrawingLayer,
    setCurrentDrawingData,
  } = useCanvasContext();
  useEffect(() => {
    const connect = async (chain: ConnectedChain) => {
      const provider = new ethers.providers.Web3Provider(
        connectedWallet.provider,
      );
      const signer = provider.getSigner();

      let dappRelayAddress = "";
      if (config[chain.id]?.DAppRelayAddress) {
        dappRelayAddress = config[chain.id].DAppRelayAddress;
      } else {
        console.error(
          `No dapp relay address address defined for chain ${chain.id}`,
        );
      }

      let inputBoxAddress = "";
      if (config[chain.id]?.InputBoxAddress) {
        inputBoxAddress = config[chain.id].InputBoxAddress;
      } else {
        console.error(
          `No input box address address defined for chain ${chain.id}`,
        );
      }

      let erc721PortalAddress = "";
      if (config[chain.id]?.Erc721PortalAddress) {
        erc721PortalAddress = config[chain.id].Erc721PortalAddress;
      } else {
        console.error(
          `No erc721 portal address address defined for chain ${chain.id}`,
        );
        alert(`No box erc721 portal address defined for chain ${chain.id}`);
      }
      // @TODO check the address in config
      let etherPortalAddress = "";
      if (config[chain.id]?.etherPortalAddress) {
        etherPortalAddress = config[chain.id].etherPortalAddress;
      } else {
        console.error(
          `No Ether portal address address defined for chain ${chain.id}`,
        );
        alert(`No box ether portal address defined for chain ${chain.id}`);
      }
      // dapp contract
      const dappContract = CartesiDApp__factory.connect(dappAddress, signer);
      // relay contract
      const relayContract = DAppAddressRelay__factory.connect(
        dappRelayAddress,
        signer,
      );
      // input contract
      const inputContract = InputBox__factory.connect(inputBoxAddress, signer);
      const erc721PortalContract = ERC721Portal__factory.connect(
        erc721PortalAddress,
        signer,
      );
      const etherPortalContract = EtherPortal__factory.connect(
        etherPortalAddress,
        signer,
      );

      return {
        dappContract,
        signer,
        relayContract,
        inputContract,
        erc721PortalContract,
        etherPortalContract,
      };
    };
    if (connectedWallet) {
      if (connectedWallet?.provider && connectedChain) {
        connect(connectedChain).then((contracts) => {
          setContracts(contracts);
        });
      }
    }
  }, [connectedWallet, connectedChain, dappAddress]);
  useEffect(() => {
    if (!connectedWallet) return;
    setAccount(connectedWallet.accounts[0].address);
  }, [connectedWallet]);

  const sendInput = async (
    strInput: string,
    initDrawingData: DrawingInitialData | null,
  ) => {
    if (!contracts) return;
    toast.info("Sending input to rollups...");

    const compressedStr = pako.deflate(strInput);

    // Encode the input
    const inputBytes = ethers.utils.isBytesLike(compressedStr)
      ? compressedStr
      : ethers.utils.toUtf8Bytes(compressedStr);

    if (!connectedChain) return;
    // Send the transaction
    try {
      const tx = await contracts.inputContract.addInput(
        config[connectedChain.id].DAppRelayAddress,
        inputBytes,
      );
      toast.success("Transaction Sent");
      // Wait for confirmation
      const receipt = await tx.wait(1);

      // Search for the InputAdded event
      const event = receipt.events?.find((e) => e.event === "InputAdded");
      setLoading(false);
      if (event?.args?.inputIndex) {
        // clearCanvas(); // manages the dApp state
        toast.success("Transaction Confirmed", {
          description: `Input added => index: ${event?.args?.inputIndex} `,
        });
        setDappState(DAPP_STATE.refetchDrawings); // @TODO this state update is not correct anymore
        if (currentDrawingData) {
          const newLogItem = {
            drawing_objects: JSON.stringify(currentDrawingLayer),
            painter: account,
            dimensions: JSON.stringify({
              width: canvas?.width || 0, // ?? @TODO get from current drawing layer ...
              height: canvas?.height || 0,
            }),
          };
          if (currentDrawingData?.update_log) {
            const log = [...currentDrawingData?.update_log, newLogItem];

            setCurrentDrawingData({
              ...currentDrawingData,
              update_log: log,
            });
          }
        } else {
          // init currentDrawingData, @TODO observe
          setCurrentDrawingData(initDrawingData);
          window.history.replaceState(
            null,
            "Page Title",
            `/drawing/${initDrawingData?.uuid}`,
          );
        }
      } else {
        toast.error("Transaction Error 1", {
          description: `Input not added => index: ${event?.args?.inputIndex} `,
        });
      }
      if (canvas) {
        if (!canvas.isDrawingMode) {
          canvas.isDrawingMode = true;
          canvas.discardActiveObject();
          canvas.renderAll();
        }
      }
    } catch (e: any) {
      const reason = e.hasOwnProperty("reason") ? e.reason : "MetaMask error";
      toast.error("Transaction Error", {
        description: `Input not added => ${reason}`,
      });
      setDappState(DAPP_STATE.txFail);
      setLoading(false);
    }
  };
  const sendMintingInput = async (inputData: {
    address: string;
    data: string;
    amount: any;
  }) => {
    if (!contracts) return;
    toast.info("Sending input to rollups...");

    if (!connectedChain) return;
    const { address, data, amount } = inputData;
    const txOverrides = { value: ethers.utils.parseEther(`${amount}`) };
    // Send the transaction
    try {
      const tx = await contracts.etherPortalContract.depositEther(
        address,
        data,
        txOverrides,
      );
      toast.success("Transaction Sent");
      // Wait for confirmation
      const receipt = await tx.wait(1);

      // Search for the InputAdded event
      const event = receipt.events?.find((e) => e.event === "InputAdded");
      setLoading(false);
      // @TODO handle tx success differently
      if (event?.args?.inputIndex) {
        // clearCanvas(); // manages the dApp state
        toast.success("Transaction Confirmed", {
          description: `Input added => index: ${event?.args?.inputIndex} `,
        });
      } else {
        toast.error("Transaction Error 1", {
          description: `Input not added => index: ${event?.args?.inputIndex} `,
        });
      }
    } catch (e: any) {
      const reason = e.hasOwnProperty("reason") ? e.reason : "MetaMask error";
      toast.error("Transaction Error", {
        description: `Input not added => ${reason}`,
      });
      setDappState(DAPP_STATE.txFail);
      setLoading(false);
    }
  };
  const sendWithdrawInput = async (input: string) => {
    if (!contracts) return;
    toast.info("Sending input to rollups...");
    if (!connectedChain) return;
    const compressedStr = pako.deflate(input);
    // Encode the input
    const inputBytes = ethers.utils.isBytesLike(compressedStr)
      ? compressedStr
      : ethers.utils.toUtf8Bytes(compressedStr);

    // Send the transaction
    try {
      const tx = await contracts.inputContract.addInput(
        config[connectedChain.id].DAppRelayAddress,
        inputBytes,
      );
      toast.success("Transaction Sent");
      // Wait for confirmation
      const receipt = await tx.wait(1);

      // Search for the InputAdded event
      const event = receipt.events?.find((e) => e.event === "InputAdded");
      setLoading(false);
      if (event?.args?.inputIndex) {
        // clearCanvas(); // manages the dApp state
        toast.success("Transaction Confirmed", {
          description: `Input added => index: ${event?.args?.inputIndex} `,
        });
      } else {
        toast.error("Transaction Error 1", {
          description: `Input not added => index: ${event?.args?.inputIndex} `,
        });
      }
    } catch (e: any) {
      const reason = e.hasOwnProperty("reason") ? e.reason : "MetaMask error";
      toast.error("Transaction Error", {
        description: `Input not added => ${reason}`,
      });
      setDappState(DAPP_STATE.txFail);
      setLoading(false);
    }
  };
  const executeVoucher = async (voucher: VoucherExtended) => {
    if (contracts && !!voucher.proof) {
      const newVoucherToExecute = { ...voucher };

      try {
        const tx = await contracts.dappContract.executeVoucher(
          voucher.destination,
          voucher.payload,
          voucher.proof,
        );
        const receipt = await tx.wait();

        newVoucherToExecute.msg = `Minting executed! (tx="${tx.hash}")`;
        if (receipt.events) {
          const event = receipt.events?.find(
            (e) => e.event === "VoucherExecuted",
          );

          if (!event) {
            throw new Error(
              `InputAdded event not found in receipt of transaction ${receipt.transactionHash}`,
            );
          }
          if (receipt.events.length > 1)
            newVoucherToExecute.events = {
              // the smart contrac to mint the nft is not in the receipt anymore
              // since we're using different portal when minting, not the input box
              address: config.connectedChain.ercToMint,
              nft_id: BigInt(receipt.events[1].data).toString(),
            };

          newVoucherToExecute.executed =
            await contracts.dappContract.wasVoucherExecuted(
              BigNumber.from(voucher.input.index),
              BigNumber.from(voucher.index),
            );
        }
        setLoading(false);
      } catch (e: any) {
        const reason = e.hasOwnProperty("reason") ? e.reason : "MetaMask error";
        toast.error("Transaction Error", {
          description: `Could not execute voucher => ${reason}`,
        });
        // full error info
        newVoucherToExecute.msg = `Could not execute voucher: ${JSON.stringify(
          e,
        )}`;
        console.error(`Could not execute voucher: ${JSON.stringify(e)}`);
      }
      return newVoucherToExecute.executed;
    }
  };
  return {
    contracts,
    sendInput,
    sendMintingInput,
    executeVoucher,
    sendWithdrawInput,
  };
};
