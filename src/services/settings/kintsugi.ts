const DEFAULT_KINTSUGI_NODES = [
  {
    name: "OnFinality",
    url: "wss://kintsugi.api.onfinality.io/public-ws"
  },
  {
    name: "Kintsugi Labs",
    url: "wss://api-kusama.interlay.io/parachain"
  },
  {
    name: "Dwellir",
    url: "wss://kintsugi-rpc.dwellir.com"
  }
];

const kintsugi = {
  value: "kintsugi",
  name: "Kintsugi",
  icon: "kintsugi.png",
  identity: "kusama",
  symbol: "KINT",
  voteSymbol: "vKINT",
  decimals: 12,
  hasElections: false,
  ss58Format: 2092,
  snsCoverCid: "bafybeifddx4p4ouofy2mj3pt5o62alnpfywbu7w7iedws3shpiu547tszi",
  endpoints: DEFAULT_KINTSUGI_NODES
};

export default kintsugi;
