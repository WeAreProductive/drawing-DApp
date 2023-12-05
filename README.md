## Drawing DApp

Drawing is a customized DApp written in Python, which originally resembles the one provided by the sample [Echo Python DApp](https://github.com/cartesi/rollups-examples/tree/main/echo-python).
Contrary to that example, this DApp does not use shared resources from the `rollups-examples` main directory to be set and run, but instead uses [Sunodo](https://docs.sunodo.io). 
That is why the commands for `building`, `running` and `deploying` differ from the ones given for the [rollups examples](https://github.com/cartesi/rollups-examples/tree/main).

## Requirements

Please refer to [system requirements](https://docs.sunodo.io/guide/introduction/installing#system-requirements) before start building a dApp with Sunodo.

## Epoch

By default the node closes an epoch `once a day`, but this can be controlled by the 
`--epoch-duration <seconds>` command option when executing the run dApp command.

It's an important settings when it comes down to `voucher` execution.

## Building

To build the application, run the following command from the project's root directory  

```shell
cd drawing-py
sunodo build
``` 

## Running

To `start` the application, execute the following command from the project's root directory:
```shell
cd drawing-py
cd smart-contracts yarn deploy && cd drawing-py sunodo run 

```

#### useful command options

To control epoch duration - see [Epoch](#epoch)

To get a more `detailed running log` run:
```shell
sunodo run --verbose
```

To check the `system status` on error run:
```shell
sunodo doctor
```

### Shut down

The application can afterwards be shut down with `CTRL+C`

### Running the back-end in host mode

When developing an application, it is often important to easily test and debug it. 

To `start` the application, execute the following command from the project's root directory:

```shell
sunodo run --no-backend
``` 

This DApp's back-end is written in Python, so to run it in your machine you need to have `python3` installed.
The backend uses hsapely library, so you should install libgeos-c on your host (refer to [geos](https://libgeos.org/usage/install/)).

Then in order to start the back-end, run the following commands in a dedicated terminal:

```shell
cd dapp
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements-host.txt
ROLLUP_HTTP_SERVER_URL="http://localhost:8080/host-runner python3 drawing.py
```

The final command will effectively run the back-end and send corresponding outputs to port `5004`.
It can optionally be configured in an IDE to allow interactive debugging using features like breakpoints.
You can also use a tool like [entr](https://eradman.com/entrproject/) to restart the back-end automatically when the code changes. For example:

```shell
ls *.py | ROLLUP_HTTP_SERVER_URL="http://127.0.0.1:5004" entr -r python3 drawing.py
```

After the back-end successfully starts, it should print an output like the following:

```log
INFO:__main__:HTTP rollup_server url is http://127.0.0.1:5004
INFO:__main__:Sending finish
```

After that, you can interact with the application normally [as explained below](#interacting-with-the-application).

Keep in mind that vouchers cannot be executed when the dApp is running in a development mode.

### For more information on how to work with Sunodo

Check these links:
- https://github.com/sunodo/sunodo
- https://docs.sunodo.io/guide/running/running-application?fbclid=IwAR3OW0tUEVeB42FBnh-cjkYIOgdPDrG262HRT5bObXyaNXX-9fqQtZ0TSog
- https://docs.sunodo.io

### Smart contracts. Building & Deploying.  

This dApp needs a smart contract to be able to mint NSTs from canvas drawings.

##### Building the smart contract and deploying manually
This is a simple contract to perform operations with NFTs (minting a nft). 
You may build the project's `smart contract` as follows. 
From the `project's root` directory execute:

```shell
cd smart-contracts
yarn && yarn build
```

To deploy the smart contract on localhost from the `project's root` directory execute:

```shell
cd smart-contracts
yarn deploy
```
Manual deployment to other supported testnets can be done by executing `yarn deploy:<network>`.

#### Building and deploying the smart contracts when running the application

@TODO  

#### Use the smart contract

To use the smart contract, you must first retrieve the contract address from the deployment data. 
When deploying the contract manually its address is printed in CLI as follows:

```shell
deploying "DrawingNFT" (tx: tx-hash)...: deployed at `smart-contract-address` with amount-of-gas-used gas
```

You can also check the address in 

```shell
smart-contracts/deploymets/smart-contract-name.json, { address: `smart-contract-address`, ...}.
```

The smart `contract's address` is used in the frontend application - (see `drawing-ui/src/shared/constants.ts`) as `ERC721_TO_MINT`.

## Interacting with the application

Use the frontend `drawing-ui` application to interact with the DApp. 

#### Requirements 

1. Vouchers cannot be executed when running the backend in `host mode`.
2. You should have a wallet (MetaMask) installed in the browser and be able to connect to account in that wallet.
3. When restarting the application be sure to `Clear wallet's activity and nonce data` from Settings - Advanced - Clear activity and nonce data
4. Be sure to have small amount of assets in the wallet account for the dApp interactions.
5. If you restart the dApp, be sure to [redeploy](#building-the-smart-contract-and-deploying-manually) the dApp's smart contract if it's been deployed manually 
(`@TODO setup smart-contract build and deploy when starting the dApp; check smart contrat address`)

#### Running the frontend in development mode

To run the frontend application execute from the project `root directory`: 
```shell
cd drawing-ui
yarn dev
```

#### drawing-api server

In order the frontend to work properly, you need to start a server that will convert the `canvas into a base64 string`.
This string format is required for the backend to be able to prepare a suitable tokenURI for the NFT to be minted on voucher execution.

To `start the server` execute the following commands from the project's `root directory` (refer to drawing-api/package.json scripts).

```shell
cd drawing-api
yarn
yarn dev
```

## [Deploying the application](https://docs.sunodo.io/guide/deploying/deploying-application)

## Steps to mint a NFT from a drawing

1. Draw a picture on canvas 
2. Save the canvas

    - Behind the scenes the canvas is being converted to a base64 string. This string is sent as an input to the rollups.
    - The backend retrieves the sent input and if sent with the proper heading and in correct format -
        - processes the bas64 string to produce the NFT tokenURI; 
        
        For detailed string processing information refer to: drawing-py/drawing.py `mint_erc721_with_uri_from_image` method definition.

        - emmits a voucher - containing 
        
            + destination: (the mint NFT smart contract address), 

            + payload: `the Mint Erc721 - tokenURI` and the `owner` of the picture to be minted as a NFT and the NFT itself

        - emmits a notice with information about the emmited voucher `Emmited voucher to mint ERC721 {erc721 string to mint}`

    - The new `voucher` is accessible at DrawingDapp `Vouchers` tab

3. Execute the voucher

    - You can execute the `voucher` once the current epoch is closed.
    - The newly minted NFT can be imoprted in your wallet by using the `smart contract address` and the `id` of the minted NFT.

    > Note: the ids start from 1, and currently there is no way of knowing the newly minted nft's id.

