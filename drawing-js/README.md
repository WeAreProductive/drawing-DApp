# JavaScript DApp Template

This is a template for JavaScript Cartesi DApps. It uses node to execute the backend application.
The application entrypoint is the `src/index.js` file. It is bundled with [esbuild](https://esbuild.github.io), but any bundler can be used.

# Run the javascript sunodo backend

```shell
yarn
ROLLUP_HTTP_SERVER_URL=http://localhost:8080/host-runner node src/index.js
```

# ethers.js
in version 6, utils doesn't exist as all the utils methods are now part of the ethers object, also dont forget there are some breaking changes, [check more on the migration page](https://docs.ethers.org/v6/migrating/#migrate-utils)

