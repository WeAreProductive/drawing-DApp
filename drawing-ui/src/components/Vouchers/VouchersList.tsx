import { ethers } from "ethers";
import { useSetChain, useWallets } from "@web3-onboard/react";
import { useEffect, useState } from "react";
import { useVouchersQuery } from "../../generated/graphql";
import { MINT_SELECTOR } from "../../shared/constants";
import { VoucherExtended, DataNoticeEdge } from "../../shared/types";
import Voucher from "./Voucher";

const VouchersList = () => {
  const [connectedWallet] = useWallets();
  const [cursor, setCursor] = useState<string | null | undefined | null>(null);
  const [result, reexecuteQuery] = useVouchersQuery({
    variables: { cursor },
    pause: true,
  });
  const [currentAccount, setCurrentAccount] = useState("");
  const [myVouchers, setMyVouchers] = useState<VoucherExtended[]>([]);
  const { data, fetching, error } = result;

  const provider = new ethers.providers.Web3Provider(connectedWallet.provider);

  const signer = async () => {
    setCurrentAccount(await provider.getSigner().getAddress());
  };
  useEffect(() => {
    signer();
  }, []);

  useEffect(() => {
    if (result.fetching) return;
    // Set up to refetch in one second, if the query is idle
    //Retrieve notices every 1000 ms
    const timerId = setTimeout(() => {
      reexecuteQuery({ requestPolicy: "network-only" });
    }, 1000);
    const length = data?.vouchers?.edges?.length;
    if (length) {
      // Update cursor so that next GraphQL poll retrieves only newer data
      setCursor(data.vouchers.pageInfo.endCursor);
    }
    return () => clearTimeout(timerId);
  }, [result.fetching, reexecuteQuery]);

  useEffect(() => {
    const newVouchers = data?.vouchers.edges
      .map((node: { node: VoucherExtended }) => {
        const n = node.node;

        let payload = n?.payload;
        let inputPayload = n?.input.payload;
        let erc721string = null;
        let ownerAddress = null;
        let notices = n?.input.notices;

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
                const decode = decoder.decode(["address", "string"], payload);
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

        const drawings = notices.edges.map(({ node }: DataNoticeEdge) => {
          let payload = node?.payload;
          let drawingData;
          if (payload) {
            try {
              payload = ethers.utils.toUtf8String(payload);
            } catch (e) {
              payload = payload;
            }
          } else {
            payload = "(empty)";
          }
          try {
            drawingData = JSON.parse(payload);
            return drawingData;
          } catch (e) {
            console.log(e);
          }
        });

        return {
          id: `${n?.id}`,
          index: n?.index,
          destination: `${n?.destination ?? ""}`,
          payload: `${payload}`,
          input: n ? { index: n.input.index, payload: inputPayload } : {},
          erc721string: erc721string,
          ownerAddress: ownerAddress,
          drawing: drawings[0].drawing,
          proof: null,
          executed: null,
        };
      })
      .filter((voucher) => voucher.ownerAddress === currentAccount)
      .sort(
        (a, b) => parseInt(b.input.index) - parseInt(a.input.index),
      ) as VoucherExtended[];

    if (newVouchers && newVouchers.length)
      setMyVouchers([...newVouchers, ...myVouchers]);

    if (!newVouchers) return;
  }, [data]);

  return (
    <div>
      {myVouchers && myVouchers.length > 0 ? (
        myVouchers.map((n: VoucherExtended) => (
          <Voucher key={`${n.input.index}-${n.index}`} voucherData={n} />
        ))
      ) : (
        <div className="py-2">Your quequed NFTs will appear here...</div>
      )}
    </div>
  );
};
export default VouchersList;
