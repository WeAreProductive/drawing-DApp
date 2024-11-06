import { useEffect, useState } from "react";
import { ethers, BigNumber } from "ethers";
import { toHex } from "viem";
import { useSetChain, useWallets, useWagmiConfig } from "@web3-onboard/react";
import { ConnectedChain } from "@web3-onboard/core";
import { signTypedData } from "@web3-onboard/wagmi";

import {
  InputBox__factory,
  Application__factory,
  ERC721Portal__factory,
  EtherPortal__factory,
} from "@cartesi/rollups";

import { toast } from "sonner";
import pako from "pako";
import {
  DrawingInitialData,
  Network,
  RollupsContracts,
  RollupsInteractions,
  VoucherExtended,
} from "../shared/types";

import { useCanvasContext } from "../context/CanvasContext";

import configFile from "../config/config.json";
import { DAPP_STATE } from "../shared/constants";
import { Account } from "@web3-onboard/core/dist/types";

const config: { [name: string]: Network } = configFile;

export const useRollups = (dAddress: string): RollupsInteractions => {
  const [contracts, setContracts] = useState<RollupsContracts | undefined>();
  const [{ connectedChain }] = useSetChain();
  const [connectedWallet] = useWallets();
  const wagmiConfig = useWagmiConfig();
  const [account, setAccount] = useState<`0x${string}` | undefined>("0x");
  const [cartesiTxId, setCartesiTxId] = useState<string>("");

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

      let DAppAddress = "";
      if (config[chain.id]?.DAppAddress) {
        DAppAddress = config[chain.id].DAppAddress;
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
      const dappContract = Application__factory.connect(dappAddress, signer);
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

  const fetchNonceL2 = async (user: any) => {
    if (!connectedChain) {
      return null;
    }

    const response = await fetch(config[connectedChain.id].nonceAPIURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        msg_sender: user as `0x${string}`,
        app_contract: dappAddress as `0x${string}`,
      }),
    });

    const responseData = await response.json();
    return responseData.nonce;
  };

  const submitTransactionL2 = async (fullBody: any) => {
    if (!connectedChain) {
      return null;
    }

    const body = JSON.stringify(fullBody);
    const response = await fetch(config[connectedChain.id].inputSubmitAPIURL, {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      console.log("submit to L2 failed");
      throw new Error("submit to L2 failed: " + response.text());
    } else {
      return response.json();
    }
  };

  const sendInput = async (
    strInput: string,
    initDrawingData: DrawingInitialData | null,
  ) => {
    if (!contracts || !connectedChain || !account || !wagmiConfig) return;
    toast.info("Sending input to rollups...");

    let typedData = {
      domain: {
        name: "Cartesi",
        version: "0.1.0",
        chainId: BigInt(parseInt(connectedChain.id.substring(2) ?? "0", 16)),
        verifyingContract: config[connectedChain.id]
          .verifyingContract as `0x${string}`,
      } as const,
      types: {
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
          { name: "verifyingContract", type: "address" },
        ],
        CartesiMessage: [
          { name: "app", type: "address" },
          { name: "nonce", type: "uint64" },
          { name: "max_gas_price", type: "uint128" },
          { name: "data", type: "bytes" },
        ],
      } as const,
      primaryType: "CartesiMessage" as const,
      message: {
        app: "0x" as `0x${string}`,
        nonce: BigInt(0),
        data: "0x" as `0x${string}`,
        max_gas_price: BigInt(10),
      },
    };

    const compressedStr = pako.deflate(strInput);

    // Encode the input
    const inputBytes = ethers.utils.isBytesLike(compressedStr)
      ? compressedStr
      : ethers.utils.toUtf8Bytes(compressedStr);

    if (!connectedChain) return;

    // Send the transaction
    try {
      const nonce = await fetchNonceL2(account);

      console.log("Nonde: ", nonce);

      typedData.message = {
        app: dappAddress as `0x${string}`,
        nonce: nonce,
        data: toHex(inputBytes),
        max_gas_price: BigInt(10),
      };

      console.log("TData:", typedData);

      try {
        setCartesiTxId("");

        const signature = await signTypedData(wagmiConfig, {
          account,
          ...typedData,
        });

        const l2data = JSON.parse(
          JSON.stringify(
            {
              typedData,
              account,
              signature,
            },
            (_, value) =>
              typeof value === "bigint" ? parseInt(value.toString()) : value, // return everything else unchanged
          ),
        );

        const res = await submitTransactionL2(l2data);

        setCartesiTxId(res.id);
        toast.success("Transaction Sent");
      } catch (e) {
        console.log(`${e}`);
        toast.error("Transaction Error!", {
          description: `Input not added => ${e}`,
        });
      }

      setLoading(false);

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
        config[connectedChain.id].DAppAddress,
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
        const tx = await contracts.dappContract.executeOutput(
          voucher.payload,
          voucher.proof,
        );
        const receipt = await tx.wait();

        newVoucherToExecute.msg = `Minting executed! (tx="${tx.hash}")`;

        if (receipt.events) {
          const event = receipt.events?.find(
            (e) => e.event === "OutputExecuted",
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
            await contracts.dappContract.wasOutputExecuted(
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

  return {
    contracts,
    sendInput,
    sendMintingInput,
    executeVoucher,
    sendWithdrawInput,
  };
};
