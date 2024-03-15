# JavaScript DApp Template

This is a template for JavaScript Cartesi DApps. It uses node to execute the backend application.
The application entrypoint is the `src/index.js` file. It is bundled with [esbuild](https://esbuild.github.io), but any bundler can be used.

# Run the javascript sunodo backend

```shell
yarn
ROLLUP_HTTP_SERVER_URL=http://localhost:8080/host-runner node src/index.js
```
