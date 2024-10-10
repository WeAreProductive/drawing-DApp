import { useEffect, useState } from "react";
import { ethers, BigNumber } from "ethers";
import { useSetChain, useWallets } from "@web3-onboard/react";
import { ConnectedChain } from "@web3-onboard/core";
import { replace } from "react-router-dom";

import {
  InputBox__factory,
  DAppAddressRelay__factory,
  CartesiDApp__factory,
  ERC721Portal__factory,
} from "@cartesi/rollups";

import { toast } from "sonner";
import pako from "pako";
import {
  Network,
  RollupsContracts,
  RollupsInteractions,
  VoucherExtended,
} from "../shared/types";

import { useCanvasContext } from "../context/CanvasContext";

import configFile from "../config/config.json";
import { DAPP_STATE } from "../shared/constants";

const config: { [name: string]: Network } = configFile;

export const useRollups = (dAddress: string): RollupsInteractions => {
  const [contracts, setContracts] = useState<RollupsContracts | undefined>();
  const [{ connectedChain }] = useSetChain();
  const [connectedWallet] = useWallets();
  const account = connectedWallet.accounts[0].address;
  const [dappAddress] = useState<string>(dAddress);

  const {
    setDappState,
    canvas,
    setLoading,
    currentDrawingData,
    currentDrawingLayer,
    setCurrentDrawingData,
    tempDrawingData,
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

      return {
        dappContract,
        signer,
        relayContract,
        inputContract,
        erc721PortalContract,
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
  const sendInput = async (strInput: string, tempDrawingData: any = null) => {
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
          const newLogItem = [JSON.stringify(currentDrawingLayer), account];
          if (currentDrawingData?.update_log) {
            const log = [...currentDrawingData?.update_log, newLogItem];

            setCurrentDrawingData({
              ...currentDrawingData,
              update_log: log,
            });
          }
        } else {
          // init currentDrawingData, @TODO observe
          setCurrentDrawingData(tempDrawingData);
          window.history.replaceState(
            null,
            "Page Title",
            `/drawing/${tempDrawingData.uuid}`,
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

          if (receipt.events.length > 2)
            newVoucherToExecute.events = {
              address: receipt.events[1].address,
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
        console.log(`Could not execute voucher: ${JSON.stringify(e)}`);
      }
      return newVoucherToExecute;
    }
  };
  return { contracts, sendInput, executeVoucher };
};
