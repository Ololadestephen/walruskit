import { createWalrusKitFromEnv } from "@walruskit/next";

export const walruskit = createWalrusKitFromEnv({
  TATUM_API_KEY: process.env.TATUM_API_KEY,
  TATUM_SUI_RPC_URL: process.env.TATUM_SUI_RPC_URL,
  WALRUS_PUBLISHER_URL: process.env.WALRUS_PUBLISHER_URL,
  WALRUS_AGGREGATOR_URL: process.env.WALRUS_AGGREGATOR_URL,
  WALRUSKIT_PACKAGE_ID: process.env.WALRUSKIT_PACKAGE_ID,
});
