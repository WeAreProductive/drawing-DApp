import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import {
  useVouchersQuery,
  useVoucherQuery,
  Voucher,
} from "../generated/graphql";
import { useRollups } from "../hooks/useRollups";
import { DAPP_ADDRESS } from "../shared/constants";
import { VoucherExtended } from "../shared/types";
import { Button } from "@chakra-ui/react";

const VouchersList = () => {
  const [result, reexecuteQuery] = useVouchersQuery();
  const [voucherToFetch, setVoucherToFetch] = useState([0, 0]);
  const [voucherResult, reexecuteVoucherQuery] = useVoucherQuery({
    variables: {
      voucherIndex: voucherToFetch[0],
      inputIndex: voucherToFetch[1],
    }, //, pause: !!voucherIdToFetch
  });
  const [voucherToExecute, setVoucherToExecute] = useState<VoucherExtended>();
  const { data, fetching, error } = result;
  const rollups = useRollups(DAPP_ADDRESS);
  const getProof = async (voucher: VoucherExtended) => {
    setVoucherToFetch([voucher.index, voucher.input.index]);
    reexecuteVoucherQuery({ requestPolicy: "network-only" });
  };
  const executeVoucher = async (voucher: VoucherExtended) => {
    if (rollups && !!voucher.proof) {
      const newVoucherToExecute = { ...voucher };
      try {
        const tx = await rollups.dappContract.executeVoucher(
          voucher.destination,
          voucher.payload,
          voucher.proof
        );
        const receipt = await tx.wait();
        newVoucherToExecute.msg = `voucher executed! (tx="${tx.hash}")`;
        if (receipt.events) {
          newVoucherToExecute.msg = `${
            newVoucherToExecute.msg
          } - resulting events: ${JSON.stringify(receipt.events)}`;
          newVoucherToExecute.executed =
            await rollups.dappContract.wasVoucherExecuted(
              BigNumber.from(voucher.input.index),
              BigNumber.from(voucher.index)
            );
        }
      } catch (e) {
        newVoucherToExecute.msg = `COULD NOT EXECUTE VOUCHER: ${JSON.stringify(
          e
        )}`;
        console.log(`COULD NOT EXECUTE VOUCHER: ${JSON.stringify(e)}`);
      }
      setVoucherToExecute(newVoucherToExecute);
    }
  };
  useEffect(() => {
    const setVoucher = async (voucher: VoucherExtended) => {
      if (rollups) {
        voucher.executed = await rollups.dappContract.wasVoucherExecuted(
          BigNumber.from(voucher.input.index),
          BigNumber.from(voucher.index)
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
            case "0xd0def521": {
              //erc721 mint;
              const decode = decoder.decode(["address", "string"], payload);
              payload = `Mint Erc721 - String: ${decode[1]} - Address: ${decode[0]}`;
              break;
            }
            case "0x755edd17": {
              //erc721 mintTo; ?
              const decode = decoder.decode(["address"], payload);
              payload = `Mint Erc721 - Address: ${decode[0]}`;
              break;
            }
            case "0x6a627842": {
              //erc721 mint; ?
              const decode = decoder.decode(["address"], payload);
              payload = `Mint Erc721 - Address: ${decode[0]}`;
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
        proof: null,
        executed: null,
      };
    })
    .sort((b, a) => {
      if (a.input.index === b.input.index) {
        return b.index - a.index;
      } else {
        return b.input.index - a.input.index;
      }
    });

  // const forceUpdate = useForceUpdate();
  return (
    <div>
      <p>Voucher to execute</p>
      {voucherToExecute ? (
        <table>
          <thead>
            <tr>
              <th>Input Index</th>
              <th>Voucher Index</th>
              <th>Destination</th>
              <th>Action</th>
              <th>Input Payload</th>
              <th>Msg</th>
            </tr>
          </thead>
          <tbody>
            <tr
              key={`${voucherToExecute.input.index}-${voucherToExecute.index}`}>
              <td>{voucherToExecute.input.index}</td>
              <td>{voucherToExecute.index}</td>
              <td>{voucherToExecute.destination}</td>
              <td>
                {!voucherToExecute.proof || voucherToExecute.executed ? (
                  <Button disabled className="disabled">
                    {voucherToExecute.executed
                      ? "Voucher executed"
                      : "No proof yet"}
                  </Button>
                ) : (
                  <Button
                    onClick={() => executeVoucher(voucherToExecute)}
                    className="voucher-action">
                    Execute voucher
                  </Button>
                )}
              </td>
              <td>{voucherToExecute.input.payload}</td>
              <td>{voucherToExecute.msg}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>Nothing yet</p>
      )}
      <button onClick={() => reexecuteQuery({ requestPolicy: "network-only" })}>
        Reload
      </button>
      <table>
        <thead>
          <tr>
            <th>Input Index</th>
            <th>Voucher Index</th>
            <th>Destination</th>
            <th>Action</th>
            <th>Payload</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.length === 0 && (
            <tr>
              <td colSpan={4}>no vouchers</td>
            </tr>
          )}
          {vouchers.map((n: VoucherExtended) => {
            return (
              <tr key={`${n.input.index}-${n.index}`}>
                <td>{n.input.index}</td>
                <td>{n.index}</td>
                <td>{n.destination}</td>
                <td>
                  <button onClick={() => getProof(n)}>Get Proof</button>
                </td>
                <td>{n.payload}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
export default VouchersList;
