# drawing DApp

drawing is a customized DApp written in Python, which originally resembles the one provided by the sample [Echo Python DApp](https://github.com/cartesi/rollups-examples/tree/main/echo-python).
Contrary to that example, this DApp does not use shared resources from the `rollups-examples` main directory, and as such the commands for building, running and deploying it are slightly different.

The documentation below reflects the original application code, and should also be used as a basis for documenting any DApp created with this mechanism.

## Requirements

Please refer to the [rollups-examples requirements](https://github.com/cartesi/rollups-examples/tree/main/README.md#requirements).

## Building

To build the application, run the following command:

```shell
docker buildx bake -f docker-bake.hcl -f docker-bake.override.hcl --load
```

## Running ( in production mode? )

To start the application, execute the following command:

```shell
docker compose up
```

The application can afterwards be shut down with the following command:

```shell
docker compose down -v
```

## Interacting with the application

```shell
cd ..
yarn 
yarn dev
``` 

## Deploying to a testnet

Deploying the application to a blockchain requires creating a smart contract on that network, as well as running a validator node for the DApp.

The first step is to build the DApp's back-end machine, which will produce a hash that serves as a unique identifier.

```shell
docker buildx bake -f docker-bake.hcl -f docker-bake.override.hcl machine --load
```

Once the machine docker image is ready, we can use it to deploy a corresponding Rollups smart contract. This requires you to define a few environment variables to specify which network you are deploying to, which account to use, and which RPC gateway to use when submitting the deploy transaction.

```shell
export NETWORK=<network>
export MNEMONIC=<user sequence of twelve words>
export RPC_URL=<https://your.rpc.gateway>
```

For example, to deploy to the Goerli testnet using an Alchemy RPC node, you could execute:

```shell
export NETWORK=goerli
export MNEMONIC=<user sequence of twelve words>
export RPC_URL=https://eth-goerli.alchemyapi.io/v2/<USER_KEY>
```

With that in place, you can submit a deploy transaction to the Cartesi DApp Factory contract on the target network by executing the following command:

```shell
DAPP_NAME=drawing docker compose -f ./deploy-testnet.yml up
```

This will create a file at `./deployments/<network>/drawing.json` with the deployed contract's address.
Once the command finishes, it is advisable to stop the docker compose and remove the volumes created when executing it.

```shell
DAPP_NAME=drawing docker compose -f ./deploy-testnet.yml down -v
```

After that, a corresponding Cartesi Validator Node must also be instantiated in order to interact with the deployed smart contract on the target network and handle the back-end logic of the DApp.
Aside from the environment variables defined above, the node will also need a secure websocket endpoint for the RPC gateway (WSS URL) and the chain ID of the target network.

For example, for Goerli and Alchemy, you would set the following additional variables:

```shell
export WSS_URL=wss://eth-goerli.alchemyapi.io/v2/<USER_KEY>
export CHAIN_ID=5
```

Then, the node itself can be started by running a docker compose as follows:

```shell
DAPP_NAME=mydapp docker compose -f ./docker-compose-testnet.yml -f ./docker-compose.override.yml up
```

## Interacting with the deployed application

With the node running, you can interact with the deployed DApp using the [frontend-console](https://github.com/cartesi/rollups-examples/tree/main/frontend-console), as described [previously](#interacting-with-the-application).
This time, however, you need to specify the appropriate connectivity configurations.

First of all, in the separate terminal for the frontend-console, define the `MNEMONIC` and `RPC_URL` variables as before:

```shell
export MNEMONIC=<user sequence of twelve words>
export RPC_URL=<https://your.rpc.gateway>
```

Then, inputs can be sent by specifying the DApp contract's address, as follows:

```shell
yarn start input send --payload "Hello there" --addressFile path/to/drawing/deployments/<network>/drawing.json
```

Resulting notices can then be retrieved by querying the local Cartesi Node, as before:

```shell
yarn start notice list
```

## Running the back-end in host mode

When developing an application, it is often important to easily test and debug it. For that matter, it is possible to run the Cartesi Rollups environment in [host mode](https://github.com/cartesi/rollups-examples/tree/main/README.md#host-mode), so that the DApp's back-end can be executed directly on the host machine, allowing it to be debugged using regular development tools such as an IDE.

The host environment can be executed with the following command:

```shell
docker compose -f docker-compose.yml -f docker-compose.override.yml -f docker-compose-host.yml up
```

This DApp's back-end is written in JavaScript using [txiki](https://github.com/saghul/txiki.js) runtime, and it is thus executed in your machine using a Docker container with the txiki interpreter.

In order to start the back-end, run the following commands in a dedicated terminal:

```shell
cd drawing
yarn start
```
After that, you can interact with the application normally [as explained above](#interacting-with-the-application).
The final command will effectively run the back-end and send corresponding outputs to port `5004`.
It can optionally be configured in an IDE to allow interactive debugging using features like breakpoints.

You can also use a tool like [entr](https://eradman.com/entrproject/) to restart the back-end automatically when the code changes. For example:

```shell
ls *.js | entr -r yarn start
```

After the back-end successfully starts, it should print an output like the following:

```log
HTTP rollup_server url is http://127.0.0.1:5004
Sending finish
```

After that, you can interact with the application normally [as explained above](#interacting-with-the-application).

## commands
# runs the DApp BE in host mode 

docker compose -f docker-compose.yml -f docker-compose.override.yml -f docker-compose-host.yml up

# stops and resets the epoch and index

 docker compose -f docker-compose.yml -f docker-compose.override.yml -f docker-compose-host.yml down 

## next steps


-  use vite instead of webpack as a building tool - problem loading ethers 

- write and retrieve images to/from external source - can it be the address of the FE app? see twiki https://github.com/saghul/txiki.js
- list of available image - load fabric canvas from svg? string
- test the module to reload BE server on changes
- remove obsolete files

- deploy - use production mode with docker ? localhost ? testnet ?

- update the README file

