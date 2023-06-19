## Building

To build the application, run the following command:

```shell
docker buildx bake -f docker-bake.hcl -f docker-bake.override.hcl --load
```

### Production mode

In this mode, the DApp's back-end logic is executed inside a Cartesi Machine, meaning that its code is compiled to the machine's RISC-V architecture. This ensures that the computation performed by the back-end is _reproducible_ and hence _verifiable_, enabling a truly trustless and decentralized execution.

After building an example as described in the previous section, you can run it in production mode by executing:

```shell
cd <example>
docker compose -f ./docker-compose.yml -f ./docker-compose.override.yml up
```

Allow some time for the infrastructure to be ready.
How much will depend on your system, but eventually the container logs will only show the continuous production of empty blocks in the local blockchain, as displayed below:

```shell
rollups-examples-hardhat-1                      | Mined empty block range #32 to #33
rollups-examples-hardhat-1                      | Mined empty block range #32 to #34
rollups-examples-hardhat-1                      | Mined empty block range #32 to #35
rollups-examples-hardhat-1                      | Mined empty block range #32 to #36
```

The environment can be shut down with the following command:

```shell
docker-compose -f ./docker-compose.yml -f ./docker-compose.override.yml down -v

### Advancing time

When executing an example, it is possible to advance time in order to simulate the passing of epochs. To do that, run:

```shell
curl --data '{"id":1337,"jsonrpc":"2.0","method":"evm_increaseTime","params":[864010]}' http://localhost:8545
```
 
 ### Host mode

The _Cartesi Rollups Host Environment_ provides the very same HTTP API as the regular one, mimicking the behavior of the actual layer-1 and layer-2 components. This way, the Cartesi Rollups infrastructure can make HTTP requests to a back-end that is running natively on localhost. This allows the developer to test and debug the back-end logic using familiar tools, such as an IDE.

The host environment can be executed with the following command:

```shell
docker compose -f ../docker-compose.yml -f ./docker-compose.override.yml -f ../docker-compose-host.yml up
```

## Running the back-end in host mode

When developing an application, it is often important to easily test and debug it. For that matter, it is possible to run the Cartesi Rollups environment in [host mode](../README.md#host-mode), so that the DApp's back-end can be executed directly on the host machine, allowing it to be debugged using regular development tools such as an IDE.

This DApp's back-end is written in Python, so to run it in your machine you need to have `python3` installed.

In order to start the back-end, run the following commands in a dedicated terminal:

```shell
cd drawing-py/
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements-host.txt
ROLLUP_HTTP_SERVER_URL="http://127.0.0.1:5004" python3 drawing.py
```

The final command will effectively run the back-end and send corresponding outputs to port `5004`.
It can optionally be configured in an IDE to allow interactive debugging using features like breakpoints.

## How to automatically restart the back-end

You can also use a tool like [entr](https://eradman.com/entrproject/) to restart the back-end automatically when the code changes. For example:

```shell
ls *.py | ROLLUP_HTTP_SERVER_URL="http://127.0.0.1:5004" entr -r python3 drawing.py
```

After the back-end successfully starts, it should print an output like the following:

```log
INFO:__main__:HTTP rollup_server url is http://127.0.0.1:5004
INFO:__main__:Sending finish
```

After that, you can interact with the application normally [as explained above](#interacting-with-the-application).


#### Querying the wallet state

The state of any account may be queried at any time via [inspect state calls](../frontend-console#inspecting-dapp-state).

##### How to query an account balance

In order to retrieve an account balance, send an inspect request against `balance` passing the account address as part of the URL.
The example below shows how to query the balance of default account `0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266`:

```shell
yarn start inspect \
    --payload  balance/0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
```

    ##### How to mint NFTs to be auctioned

Simply proceed and [mint a CartesiNFT](../common-contracts/README.md#how-to-mint-a-cartesinft) and take note of the `token_id`.
It will be used when [depositing NFTs into a user account](#how-to-deposit-nfts) using the front-end console.

##### How to deposit NFTs

In order to [deposit NFTs](../frontend-console#depositing-erc-721-tokens), they must have been minted beforehand as explained above.

From the front-end console, deposit an NFT whose `token_id` is `1` as follows:

```shell
yarn start erc721 deposit --tokenId 1
 ```