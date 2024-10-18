<!-- markdownlint-disable MD013 -->

# Building

You may build the `smart-contracts` project as follows:

```shell
cd smart-contracts
yarn && yarn build
```

## Deploying

The DApp will specify their deployment within their corresponding `docker-compose.override.yml` file.

Additionally, the project can be deployed manually on the local development network by running `yarn deploy`. Manual deployment to other supported testnets can be done by executing `yarn deploy:<network>`.

## The Contracts

### DrawingCanvasNFT

This is a simple contract to perform operations with NFTs.

To use it, you must first retrieve the contract address from the deployment data.
For the local development network, execute the following command:

```shell
ERC_721=$(jq '.address' ./deployments/localhost/DrawingCanvasNFT.json | \
    sed "s/[\",]//g")
```

refer each chain's smart contract address in drawing-ui/src/config/config.json `ercToMint`

## Additional notes

When in development one can forget to deploy the smart contracts, then check voucher status can produce strange results - for example

-   all vouchers are already executed, though only one or none is
-   the response after executing a voucher is missing NFT id and other parameters.

ERC1155 localhost address 0xb73bDcde8C529A289956B5C9726ecDC4b29309CA
