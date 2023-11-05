# drawing DApp

Drawing is a customized DApp written in Python, which originally resembles the one provided by the sample [Echo Python DApp](https://github.com/cartesi/rollups-examples/tree/main/echo-python).
Contrary to that example, this DApp does not use shared resources from the `rollups-examples` main directory, and as such the commands for building, running and deploying it are slightly different.

The documentation below reflects the original application code, and should also be used as a basis for documenting any DApp created with this mechanism.

## Requirements

Please refer to the [rollups-examples requirements](https://github.com/cartesi/rollups-examples/tree/main/README.md#requirements).

## Building

To build the application, run the following command from the project's root directory:
! add --no-cache when in development mode

```shell
cd drawing-py
sunodo build
``` 
## Running

To start the application, execute the following command from the project's root directory:

```shell
cd drawing-py
sunodo run
```
To get a more detailed running log

```shell
sunodo run --verbose
```
To check system status on error 
```shell
sunodo doctor
```

## Epoch

By default the node closes an epoch `once a day`, but this can be controlled by the 

`--epoch-duration <seconds>` command option. 
It's an important settings when it comes down to voucher execution.

The application can afterwards be shut down with `CTRL+C`

## Smart contracts

This dApp needs a smart contract to be able to mint NSTs from canvas drawings.

### Building

You may build the project's `smart contracts` as follows. From the project's root directory execute:

```shell
cd smart-contracts
yarn && yarn build
```

### Building & Deploying 

### The Contracts

#### DrawingNFT

This is a simple contract to perform operations with NFTs (minting an nft).

To use it, you must first retrieve the contract address from the deployment data.
For the local development network, execute the following command:

```shell
ERC_721=$(jq '.address' ./deployments/localhost/DrawingNFT.json | \
    sed "s/[\",]//g")
```

The smart `contract's address` is refered in the FE (drawing-ui/src/config/constants.js) as ERC721_TO_MINT

## Interacting with the application

We can use the frontend drawing-ui [drawing-ui](https://github.com/...) application to interact with the DApp.

1. draw a picture
2. save the canvas

3. ...

In order the FE to work properly, you need to start a server that will convert the canvas into a base64 string needed for the NFT to be minted at the BE.
Execute the following commands from the project's root directory (refer to drawing-api/package.json scripts)

```shell
cd drawing-api
yarn dev
```

## Deploying to a testnet (revise the cli commands!) 

## Running the back-end in host mode

When developing an application, it is often important to easily test and debug it. For that matter, it is possible to run the Cartesi Rollups environment in [host mode](https://github.com/cartesi/rollups-examples/tree/main/README.md#host-mode), so that the DApp's back-end can be executed directly on the host machine, allowing it to be debugged using regular development tools such as an IDE.

To start the application, execute the following command from the project's root directory:

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

After that, you can interact with the application normally [as explained above](#interacting-with-the-application).

## For more information on how to work with Sunodo

Check these links 
- https://github.com/sunodo/sunodo
- https://docs.sunodo.io/guide/running/running-application?fbclid=IwAR3OW0tUEVeB42FBnh-cjkYIOgdPDrG262HRT5bObXyaNXX-9fqQtZ0TSog
- https://docs.sunodo.io