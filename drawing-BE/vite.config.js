import { defineConfig } from "vite";
import { VitePluginNode } from "vite-plugin-node";

export default defineConfig({
  // ...vite configures
  server: {
    // vite server configs, for details see [vite doc](https://vitejs.dev/config/#server-host)
    port: 3000,
  },
  plugins: [
    ...VitePluginNode({
      // tell the plugin where is your project entry
      appPath: "./index.js",
      swcOptions: {},

      adapter({ app, server, req, res, next }) {
        app(res, res);
      },
    }),
  ],
});
