import Chains from "../chains";
const capitalize = (str = "") => str.charAt(0).toUpperCase() + str.slice(1);

const DEFAULT_CRUST_NODES = [
  {
    name: "OnFinality",
    url: "wss://crust.api.onfinality.io/public-ws"
  },
  {
    name: "Crust",
    url: "wss://rpc.crust.network"
  },
  {
    name: "Decoo Technologies",
    url: "wss://rpc-crust-mainnet.decoo.io"
  },
  {
    name: "DCloud Foundation",
    url: "wss://api.decloudf.com"
  }
];

const crust = {
  value: Chains.crust,
  name: capitalize(Chains.crust),
  icon: "crust.svg",
  identity: "crust",
  symbol: "CRU",
  decimals: 12,
  hasElections: false,
  ss58Format: 66,
  blockTime: 6000,
  snsCoverCid: "bafybeicb77dwocjcssmcb75irbsvxly4ep335pky2r7tvwsjnoyzpl3c3y",
  endpoints: DEFAULT_CRUST_NODES
};

export default crust;
