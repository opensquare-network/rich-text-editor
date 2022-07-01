import { encodeAddress } from "@polkadot/keyring";
import polkadot from "./settings/polkadot";
import kusama from "./settings/kusama";
import acala from "./settings/acala";
import basilisk from "./settings/basilisk";
import bifrost from "./settings/bifrost";
import calamari from "./settings/calamari";
import crab from "./settings/crab";
import interlay from "./settings/interlay";
import karura from "./settings/karura";
import khala from "./settings/khala";
import kintsugi from "./settings/kintsugi";
import polkadex from "./settings/polkadex";
import turing from "./settings/turing";
import crust from "./settings/crust";
import centrifuge from "./settings/centrifuge";

const settingsMap = {
  polkadot,
  kusama,
  acala,
  basilisk,
  bifrost,
  calamari,
  centrifuge,
  crust,
  crab,
  interlay,
  karura,
  khala,
  kintsugi,
  polkadex,
  turing
};

export default function getChainSettings(chain) {
  const settings = settingsMap[chain];
  if (!settings) {
    throw `can not get chain settings of ${chain}`;
  }

  return settings;
}

export const encodeAddressToChain = (address, chain) => {
  let ss58Prefix;
  const settings = getChainSettings(chain);
  ss58Prefix = settings.ss58Format;

  try {
    return encodeAddress(address, ss58Prefix);
  } catch {
    return "";
  }
};
