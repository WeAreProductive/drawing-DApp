<!-- Additional information -->

# Cartesi Rollups Examples

This repository includes an example of decentralized application implemented using [Cartesi Rollups](https://github.com/cartesi/rollups).

## Introduction

From a developer’s point of view, each decentralized application or _DApp_ is composed of two main parts: a **front-end** and a **back-end**.

The **front-end** corresponds to the user-facing interface.

On the other hand, the **back-end** contains the business logic of the application, similar to what traditional systems would run inside a server. Its basic goal is to store and update the application state as user input is received, producing corresponding outputs. These outputs can come in the form of **vouchers** (transactions that can be carried out on layer-1, such as a transfer of assets) and **notices** (informational statements that can be verified on layer-1, such as the resulting score of a game). In addition to that, the back-end can also issue **reports**, which correspond to general information that does not need to be verifiable by third-parties, such as application logs.

When compared to traditional software development, the main difference of a Cartesi DApp is that the back-end is deployed to a decentralized network of layer-2 nodes, who continuously verify the correctness of all processing results. As a consequence, the front-end and back-end do not communicate directly with each other. Rather, the front-end sends inputs to the Cartesi Rollups framework, who in turn makes them available to the back-end instances running inside each node. After the inputs are processed by the back-end logic, the corresponding outputs are then informed back to the Rollups framework, which enforces their correctness and makes them available to the front-end and any other interested parties.

## HTTP API

As discussed above, the front-end and back-end parts of a Cartesi DApp communicate with each other through the Rollups framework.
This is accomplished in practice by using a set of HTTP interfaces, which are specified in [Cartesi's OpenAPI Interfaces repository](https://github.com/cartesi/openapi-interfaces/).

### Back-end

The DApp's back-end interacts with the Cartesi Rollups framework by retrieving processing requests and then submitting corresponding outputs.

### Front-end

The front-end part of the DApp needs to access the Cartesi Rollups framework to submit user inputs and retrieve the corresponding vouchers, notices and reports produced by the back-end. 

## Requirements

Docker version `20.10.14` with [Docker Buildkit](https://github.com/moby/buildkit) enabled is required for building the environment and executing the example dApp.
We recommend using [Docker Desktop](https://www.docker.com/products/docker-desktop/), which already enables Buildkit by default.
Alternatively, an environment variable with value `DOCKER_BUILDKIT=1` can also be set.

The below instructions have been tested in systems running both Linux (Ubuntu), MacOS, and Windows (using [WSL](https://docs.microsoft.com/en-us/windows/wsl/install), which is highly recommended for Windows users).

## Building 
## Running 
### Production mode

In this mode, the DApp's back-end logic is executed inside a Cartesi Machine, meaning that its code is compiled to the machine's RISC-V architecture. This ensures that the computation performed by the back-end is _reproducible_ and hence _verifiable_, enabling a truly trustless and decentralized execution.

After building an example as described in the previous section, you can run it in production mode by executing:

```shell
cd <example>
docker compose -f ../docker-compose.yml -f ./docker-compose.override.yml up
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
docker-compose -f ../docker-compose.yml -f ./docker-compose.override.yml down -v
```

### Host mode

The _Cartesi Rollups Host Environment_ provides the very same HTTP API as the regular one, mimicking the behavior of the actual layer-1 and layer-2 components. This way, the Cartesi Rollups infrastructure can make HTTP requests to a back-end that is running natively on localhost. This allows the developer to test and debug the back-end logic using familiar tools, such as an IDE.

The host environment can be executed with the following command:

```shell
docker compose -f ../docker-compose.yml -f ./docker-compose.override.yml -f ../docker-compose-host.yml up
```

_Note_: In production mode, rejected inputs are guaranteed to have no effect on the back-end, since in that case the Cartesi Machine is completely rolled back to its previous state. However, in host mode there is no such guarantee and it is possible for changes to persist, for instance if the DApp allows an invalid input to change a global variable or produce a database write before it is rejected.

_Note_: When running in host mode, localhost port `5004` will be used by default to allow the DApp's back-end to communicate with the Cartesi Rollups framework.

### Logging configuration

Whether in production mode or in host mode, it is possible to configure the level of logging information printed by the environment components.
The main [docker-compose.yml](./docker-compose.yml) file specifies the environment services and their configurations, and these include environment variables that can be used to control the level of logging detail for each service.

For most services, the variable `RUST_LOG` defines the log level. The possible values for it are the following: `trace`, `debug`, `info`, `warn`, and `error`.

In production mode, the `server_manager` service has two different variables to control logging levels. `SERVER_MANAGER_LOG_LEVEL` controls the level of detail for the service itself, while `REMOTE_CARTESI_MACHINE_LOG_LEVEL` controls it for the Cartesi Machine in which the back-end is executing. The possible values for these variables are slightly different: `trace`, `debug`, `info`, `warning`, `error`, and `fatal`. Note that these definitions do not affect the output printed by the back-end code itself, which has independent control of its logging level.

### Interactive console

It is possible to start an interactive console for the Cartesi Machine containing the application's back-end logic.
This allows you to experiment with the back-end's software stacks within its production environment, allowing you to evaluate performance and explore the most adequate technology choices for its implementation.

After the [Building](#building) step above is executed, a corresponding console Docker image is made available for that purpose. To run it and start your interactive console, type the following command:

```shell
docker run --rm -it cartesi/dapp:<example>-devel-console
```

The example's specific resources can generally be found within the `/mnt/dapp` directory.

To run the console as the `root` user, type the following command:

```shell
docker run --rm -it cartesi/dapp:<example>-devel-console run-machine-console.sh --run-as-root
```

### Advancing time

When executing an example, it is possible to advance time in order to simulate the passing of epochs. To do that, run:

```shell
curl --data '{"id":1337,"jsonrpc":"2.0","method":"evm_increaseTime","params":[864010]}' http://localhost:8545
```

## Using testnets

<!-- markdownlint-disable MD024 -->

### Interacting with deployed DApps

### Deploying DApps

Deploying a new Cartesi DApp to a blockchain requires creating a smart contract on that network, as well as running a validator node for the DApp.

The first step is to build the DApp's back-end machine, which will produce a hash that serves as a unique identifier.

```shell
cd <example>
docker buildx bake machine --load
```

Once the machine docker image is ready, we can use it to deploy a corresponding Rollups smart contract.
This requires you to specify the account and RPC gateway to use when submitting the deploy transaction on the target network, which can be done by defining the following environment variables:

```shell
export MNEMONIC=<user sequence of twelve words>
export RPC_URL=<https://your.rpc.gateway>
```

For example, to deploy to the Goerli testnet using an Alchemy RPC node, you could execute:

```shell
export MNEMONIC=<user sequence of twelve words>
export RPC_URL=https://eth-goerli.alchemyapi.io/v2/<USER_KEY>
```

With that in place, you can submit a deploy transaction to the Cartesi DApp Factory contract on the target network by executing the following command:

```shell
DAPP_NAME=<example> docker compose --env-file ../env.<network> -f ../deploy-testnet.yml up
```

Here, `env.<network>` specifies general parameters for the target network, like its name and chain ID. In the case of Goerli, the command would be:

```shell
DAPP_NAME=<example> docker compose --env-file ../env.goerli -f ../deploy-testnet.yml up
```

This will create a file at `../deployments/<network>/<example>.json` with the deployed contract's address.
Once the command finishes, it is advisable to stop the docker compose and remove the volumes created when executing it.

```shell
DAPP_NAME=<example> docker compose --env-file ../env.<network> -f ../deploy-testnet.yml down -v
```

After that, a corresponding Cartesi Validator Node must also be instantiated in order to interact with the deployed smart contract on the target network and handle the back-end logic of the DApp.
Aside from the environment variables defined before, the node will also need a secure websocket endpoint for the RPC gateway (WSS URL).

For example, for Goerli and Alchemy, you would set the following additional variable:

```shell
export WSS_URL=wss://eth-goerli.alchemyapi.io/v2/<USER_KEY>
```

Then, the node itself can be started by running a docker compose as follows:

```shell
DAPP_NAME=<example> docker compose --env-file ../env.<network> -f ../docker-compose-testnet.yml -f ./docker-compose.override.yml up
```

Alternatively, you can also run the node on host mode by executing:

```shell
DAPP_NAME=<example> docker compose --env-file ../env.<network> -f ../docker-compose-testnet.yml -f ./docker-compose.override.yml -f ../docker-compose-host-testnet.yml up
```

## Creating DApps

The fundamental step of creating a new DApp is to implement a back-end, which is equivalent to writing a smart contract for traditional blockchains. Front-end clients are also usually desirable (e.g., to provide a UI for the DApp), but in some cases generic clients such as the [frontend-console](./frontend-console/) application may be sufficient from the DApp developer's point of view.

### Quick-start template

The [custom-dapps](./custom-dapps/) directory contains a simple template to quickly create a new DApp, based on the [Echo Python DApp](./echo-python/) example.

### Build strategies

Digging a little deeper, creating a back-end basically consists of building an appropriate Cartesi Machine. In this repository, Cartesi Machines always boot a Linux kernel, with each DApp defining its root file-system and optionally additional drives with DApp resources.

This repository contains two different strategies or "build systems" for easily assembling Cartesi Machines with arbitrary user-provided code, as described below.

#### `std-rootfs`: using a standard root file-system

In this system, the DApp uses a standard root file-system that is downloaded from Cartesi's [image-rootfs Github repository](https://github.com/cartesi/image-rootfs/).

DApp-specific content is defined using a Dockerfile that places files inside a directory called `/opt/cartesi/dapp`. This content is then further filtered by specifying files of interest in a `dapp.json` configuration file.
By default, the DApp starts by executing a file called `entrypoint.sh`, which should be inside the `/opt/cartesi/dapp` directory and included in the `dapp.json` list of files of interest.
All of these files will be made available to the Cartesi Machine in a drive labeled "dapp", which is mounted separately from the main root file-system drive.

In this build system, the developer needs to ensure that contents are compatible with the Cartesi Machine's RISC-V architecture. This means that binaries must be generated with the `riscv64` platform as target, which can be done using the cross-compiler from the [cartesi/toolchain](https://hub.docker.com/r/cartesi/toolchain) Docker image. This is the case for code written in C++ or Rust, and is also recommended for Python DApps since Python dependencies sometimes need to be compiled natively.

In summary, for this strategy the DApp needs to provide the following:

- A Dockerfile producing content in `/opt/cartesi/dapp`. The Dockerfile should use [cartesi/toolchain](https://hub.docker.com/r/cartesi/toolchain) as its base image if it needs to cross-compile code to RISC-V
- A `dapp.json` file specifying a list of files of interest from the `/opt/cartesi/dapp` directory, which should include `entrypoint.sh`

This strategy makes sense if the DApp does not have many special requirements, and can mostly run using the resources already bundled in the standard root file-system. This is the case for the simple [Echo Python DApp](./echo-python/), for example.
Using this system also makes sense if the developer is familiar with cross-compilation, because it is faster than the other more general-purpose [docker-riscv](#docker-riscv-using-risc-v-base-docker-images) strategy described below.

#### `docker-riscv`: using RISC-V base Docker images

In this system, the entire build process is done using standard RISC-V Docker images.
As such, the DApp developer is free to use regular Linux distributions as a base image, and then transparently add _any_ dependency without having to perform any cross-compilation.

**Note:** at the moment, only images based on the Ubuntu RISC-V distribution are effectively supported.
Examples include [riscv64/ubuntu](https://hub.docker.com/r/riscv64/ubuntu) itself and [cartesi/python](https://hub.docker.com/r/cartesi/python), which extends it to add Python support.
It is strongly recommended to use slim images, so as to keep the Cartesi Machine size as small as possible.
Moreover, it is also important to avoid including in the final images any resources that are only needed when building the DApp. To that end, it is recommended to define an intermediate "build stage" in your Dockerfile, and only copy to the final image the resources required for DApp execution.

With this strategy, you can use any package manager to download dependencies needed for your DApp, as you would normally do in any Linux environment. Commands like `apt-get install` and `pip install` can simply download RISC-V binaries already available in remote repositories. Additionally, any source code that needs to be compiled is also transparently targeted to the RISC-V platform.

To make it possible to use RISC-V images in a regular x86 or ARM computer, you must enable QEMU emulation support in Docker.
Again, we recommend using [Docker Desktop](https://www.docker.com/products/docker-desktop/), which already provides QEMU support.
If not using Docker Desktop, emulator support can be added by running a special Docker image such as [linuxkit/binfmt](https://hub.docker.com/r/linuxkit/binfmt) or [tonistiigi/binfmt](https://hub.docker.com/r/tonistiigi/binfmt). For example:

```shell
docker run --privileged --rm  linuxkit/binfmt:bebbae0c1100ebf7bf2ad4dfb9dfd719cf0ef132
```

For this build system, the entire content produced by the Dockerfile will be made available to the Cartesi Machine as its root file-system drive.
The only requirement is that there must be an executable `entrypoint.sh` file within the `/opt/cartesi/dapp` directory.

DApp files and resources can be added normally by copying them inside the Dockerfile.
You may use `.dockerignore` to easily filter which files to add (e.g., to include everything in the local host directory but ignore the `.venv` directory along with bake and docker-compose files).

In summary, in this system the DApp needs to provide the following:

- A Dockerfile based on an Ubuntu RISC-V image, whose final contents must include an executable file called `/opt/cartesi/dapp/entrypoint.sh`
- Any necessary resources can be added inside the Dockerfile as desired. Package managers such as `apt-get` or `pip` can also be used to install dependencies

This strategy is the best option for adding any arbitrary dependency to your DApp.
However, keep in mind that performing build operations such as compiling binaries inside an emulated RISC-V image is slower than executing them on your host machine. As such, in specific situations it may still be useful to generate RISC-V binaries via cross-compilation and then add them to the final image, as in the [std-rootfs](#std-rootfs-using-a-standard-root-file-system) build system.


### Notes

// Standard configuration for local development environment
INPUTBOX_ADDRESS = "0x59b22D57D4f067708AB0c00552767405926dc768"; 
