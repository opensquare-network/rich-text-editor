import polkadot from "./settings/polkadot";
import kusama from "./settings/kusama";
import crab from "./settings/crab";
import karura from "./settings/karura";
import bifrost from "./settings/bifrost";
import acala from "./settings/acala";
import interlay from "./settings/interlay";
import kintsugi from "./settings/kintsugi";
import khala from "./settings/khala";
import turing from "./settings/turing";

export const nodes = [
  polkadot,
  kusama,
  karura,
  acala,
  khala,
  {
    value: "kabocha",
    name: "Kabocha",
    icon: "kabocha.svg",
    hideHeight: true
    // identity: "kabocha",
    // symbol: "",
    // decimals: 0,
    // hasElections: true,
  },
  bifrost,
  // basilisk,
  kintsugi,
  interlay,
  turing,
  crab
  // centrifuge,
];
