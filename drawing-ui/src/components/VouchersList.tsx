import { BigNumber, ethers } from "ethers";
import { useSetChain, useWallets } from "@web3-onboard/react";
import { useEffect, useState } from "react";
import { useVouchersQuery, useVoucherQuery } from "../generated/graphql";
import { useRollups } from "../hooks/useRollups";
import { DAPP_ADDRESS, MINT_SELECTOR } from "../shared/constants";
import { VoucherExtended } from "../shared/types";
import { Button } from "./ui/button";

const VouchersList = () => {
  const [connectedWallet] = useWallets();
  const [result, reexecuteQuery] = useVouchersQuery();
  const [voucherToFetch, setVoucherToFetch] = useState([0, 0]);
  const [currentAccount, setCurrentAccount] = useState('');
  
  const [voucherResult, reexecuteVoucherQuery] = useVoucherQuery({
    variables: {
      voucherIndex: voucherToFetch[0],
      inputIndex: voucherToFetch[1]
    },
  });
  
  const [voucherToExecute, setVoucherToExecute] = useState<VoucherExtended>();
  const { data, fetching, error } = result;
  const [loading, setLoading] = useState(false);
  const rollups = useRollups(DAPP_ADDRESS);
  

  const provider = new ethers.providers.Web3Provider(
    connectedWallet.provider,
  );

  const signer = async () => {
     setCurrentAccount(await provider.getSigner().getAddress());
  }
  useEffect(() => {
    signer();
  },[]);

  const getProof = async (voucher: VoucherExtended) => {
    setVoucherToFetch([voucher.index, voucher.input.index]);
    reexecuteVoucherQuery({ requestPolicy: "network-only" });
  };
  
  const executeVoucher = async (voucher: VoucherExtended) => {
    if (rollups && !!voucher.proof) {
      setLoading(true);
      const newVoucherToExecute = { ...voucher };
      
      try {
        const tx = await rollups.dappContract.executeVoucher(
          voucher.destination,
          voucher.payload,
          voucher.proof,
        );
        const receipt = await tx.wait();

        newVoucherToExecute.msg = `voucher executed! (tx="${tx.hash}")`;
        if (receipt.events) {
          const event = receipt.events?.find(
            (e) => e.event === "VoucherExecuted",
          );

          if (!event) {
            throw new Error(
              `InputAdded event not found in receipt of transaction ${receipt.transactionHash}`,
            );
          }
          newVoucherToExecute.msg = `${
            newVoucherToExecute.msg
          } - resulting events: ${JSON.stringify(receipt.events)}`;
          
          newVoucherToExecute.executed =
            await rollups.dappContract.wasVoucherExecuted(
              BigNumber.from(voucher.input.index),
              BigNumber.from(voucher.index),
            );
        }
        setLoading(false);

      } catch (e) {
        newVoucherToExecute.msg = `COULD NOT EXECUTE VOUCHER: ${JSON.stringify(
          e,
        )}`;
        console.log(`COULD NOT EXECUTE VOUCHER: ${JSON.stringify(e)}`);
      }

      setVoucherToExecute(newVoucherToExecute);
      setLoading(false);

    }
  };

  useEffect(() => {
    const setVoucher = async (voucher: VoucherExtended) => {
      if (rollups) {
        voucher.executed = await rollups.dappContract.wasVoucherExecuted(
          BigNumber.from(voucher.input.index),
          BigNumber.from(voucher.index),
        );
      }
      setVoucherToExecute(voucher);
    };

    if (!voucherResult.fetching && voucherResult.data) {
      setVoucher(voucherResult.data.voucher);
    }
  }, [voucherResult, rollups]);

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;
  if (!data || !data.vouchers) return <p>No vouchers</p>;

  const vouchers = data.vouchers.edges
    .map((node: { node: VoucherExtended }) => {
      const n = node.node;
      
      let payload = n?.payload;
      let inputPayload = n?.input.payload;
      let erc721string = null;
      let ownerAddress = null;

      if (inputPayload) {
        try {
          inputPayload = ethers.utils.toUtf8String(inputPayload);
        } catch (e) {
          inputPayload = inputPayload + " (hex)";
        }
      } else {
        inputPayload = "(empty)";
      }
      if (payload) {
        const decoder = new ethers.utils.AbiCoder();
        const selector = decoder.decode(["bytes4"], payload)[0];
        payload = ethers.utils.hexDataSlice(payload, 4);
        try {
          switch (selector) {
            case MINT_SELECTOR: {
              const decode = decoder.decode(
                ["address", "string"], 
                payload
              );
              payload = `Mint Erc721 - String: ${decode[1]} - Address: ${decode[0]}`;
              erc721string = decode[1];
              ownerAddress = decode[0];
              break;
            }
            default: {
              break;
            }
          }
        } catch (e) {
          console.log(e);
        }
      } else {
        payload = "(empty)";
      }
      return {
        id: `${n?.id}`,
        index: n?.index,
        destination: `${n?.destination ?? ""}`,
        payload: `${payload}`,
        input: n ? { index: n.input.index, payload: inputPayload } : {},
        erc721string: erc721string,
        ownerAddress: ownerAddress,
        proof: null,
        executed: null,
      };
    })
    .filter(voucher => voucher.ownerAddress === currentAccount)
    .sort((b, a) => {
      if (a.input.index === b.input.index) {
        return b.index - a.index;
      } else {
        return b.input.index - a.input.index;
      }
    });

  return (
    <div>
      <h3 className="text-xl font-bold">NFT to mint</h3>
      {voucherToExecute ? (
        <div
          key={`${voucherToExecute.input.index}-${voucherToExecute.index}`}
          className="my-4 pb-4 border-b-2"
        >
          <dl className="mb-2">
            <dt className="font-semibold">Input Index</dt>
            <dd>{voucherToExecute.input.index}</dd>
          </dl>

          <dl className="mb-2">
            <dt className="font-semibold">Input Payload</dt>
            <dd>{voucherToExecute.input.payload}</dd>
          </dl>
          
          {!voucherToExecute.proof || voucherToExecute.executed ? (
            <Button disabled className="disabled text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
              {voucherToExecute.executed
                ? "NFT minted"
                : "Pending"}
            </Button>
          ) : loading ? (
            <Button disabled className="disabled text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
              Mint NFT
            </Button>
          ) : (
            <Button
              onClick={() => executeVoucher(voucherToExecute)}
              className="voucher-action text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Mint NFT
            </Button>
          )}
          
          <p>{loading ? <span>...</span> : voucherToExecute.msg}</p>
        </div>
      ) : (
        <p className="p-4 my-4 bg-gray-100">Nothing yet</p>
      )}
        <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={() => reexecuteQuery({ requestPolicy: "network-only" })}>
          Reload
        </button>
          
        {vouchers.length === 0 && (
          <p>No NFTs to mint</p>
        )}

        {vouchers.map((n: VoucherExtended) => {
          return (
            <div key={`${n.input.index}-${n.index}`} className="my-4 pb-4 border-b-2">
              <dl className="mb-2">
                <dt className="font-semibold">Input Index</dt>
                <dd>{n.input.index}</dd>
              </dl>

              <dl className="mb-2">
                <dt className="font-semibold">ERC721 String</dt>
                <dd>{n.erc721string}</dd>
              </dl>
              
              <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={() => getProof(n)}>Check status</button>
            </div>
          );
        })}
    </div>
  );
};
export default VouchersList;
