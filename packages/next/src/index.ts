import { createWalrusKit, type WalrusKitConfig } from "@walruskit/sdk";

export type WalrusKitEnv = {
  TATUM_API_KEY?: string;
  TATUM_SUI_RPC_URL?: string;
  WALRUS_PUBLISHER_URL?: string;
  WALRUS_AGGREGATOR_URL?: string;
  WALRUSKIT_PACKAGE_ID?: string;
};

export function configFromEnv(env: WalrusKitEnv): WalrusKitConfig {
  if (!env.WALRUS_PUBLISHER_URL || !env.WALRUS_AGGREGATOR_URL) {
    throw new Error("Walrus publisher and aggregator URLs are required.");
  }

  return {
    tatum: {
      apiKey: env.TATUM_API_KEY,
      rpcUrl: env.TATUM_SUI_RPC_URL,
      network: "testnet",
    },
    walrus: {
      publisherUrl: env.WALRUS_PUBLISHER_URL,
      aggregatorUrl: env.WALRUS_AGGREGATOR_URL,
    },
    move: env.WALRUSKIT_PACKAGE_ID ? { packageId: env.WALRUSKIT_PACKAGE_ID } : undefined,
  };
}

export function createWalrusKitFromEnv(env: WalrusKitEnv) {
  return createWalrusKit(configFromEnv(env));
}
