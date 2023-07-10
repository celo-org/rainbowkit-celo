import Package from "./package.json";

export * as CeloWallets from "./wallets/index.js";
export * as CeloChains from "./chains/index.js";

const version = Package.version;
export { version };
