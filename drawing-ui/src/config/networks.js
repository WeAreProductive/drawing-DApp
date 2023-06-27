// compatible networks
export const networks = {
  31337: {
    chainId: 31337,
    name: "localhost",
    explorer: "http://localhost:8545",
    dappAddress: "0xF119CC4Ed90379e5E0CC2e5Dd1c8F8750BAfC812",
    reader: "http://localhost:4000/graphql",
    inspect: "http://localhost:5005/inspect",
    nativeCurrency: { name: "DANK", decimals: 18, symbol: "DANK" },
    rpcUrls: ["http://localhost:8545"],
  },
  //deactivated temporary
  // 5: {
  //   chainId: 5,
  //   name: 'goerli',
  //   explorer: 'https://eth-goerli.g.alchemy.com/v2/D8hYlagOzQ85FiBVWIKUQHNmWcWvhY8y',
  //   dappAddress: '0x2Db61C52B021d6f039a861B7b1d8Fc4C204159c9',
  //   reader: 'http://3.91.234.75:4000/graphql',
  //   inspect: 'http://3.91.234.75:5005/inspect',
  //   nativeCurrency: { name: 'GoerliETH', decimals: 18, symbol: 'GoerliETH' },
  //   rpcUrls: ['https://goerli.infura.io/v3/'],
  // },
  421613: {
    chainId: 421613,
    name: "Arbitrum Goerli",
    explorer:
      "https://arb-goerli.g.alchemy.com/v2/reBTmRjM26yL6LMD2zy4ULuyUfL3qh02",
    dappAddress: "0xD1707107Ff524A85f9c0B1e222e6b1AE60B4060f",
    reader: "https://be.cartesianbattleship.com/graphql",
    inspect: "https://be.cartesianbattleship.com/inspect",
    nativeCurrency: { name: "AGOR", decimals: 18, symbol: "AGOR" },
    rpcUrls: ["https://goerli-rollup.arbitrum.io/rpc"],
  },
};
