import { createWalrusKit } from "@walruskit/sdk";

const walruskit = createWalrusKit({
  walrus: {
    publisherUrl: process.env.WALRUS_PUBLISHER_URL ?? "",
    aggregatorUrl: process.env.WALRUS_AGGREGATOR_URL ?? "",
  },
  tatum: {
    rpcUrl: process.env.TATUM_SUI_RPC_URL ?? "https://sui-testnet.gateway.tatum.io",
    apiKey: process.env.TATUM_API_KEY,
  },
  move: process.env.RECOVERKIT_PACKAGE_ID ? { packageId: process.env.RECOVERKIT_PACKAGE_ID } : undefined,
});

const encrypted = await walruskit.encryptText("vault recovery note", "demo-passphrase");
const blob = await walruskit.uploadEncryptedBlob(encrypted, "text/plain");

const plan = walruskit.createCapsulePlan({
  owner: "0x1",
  beneficiary: "0x2",
  guardians: ["0x3", "0x4", "0x5"],
  threshold: 2,
  heartbeatTimeoutMs: 30 * 24 * 60 * 60 * 1000,
  finalDelayMs: 24 * 60 * 60 * 1000,
  blob,
});

console.log(JSON.stringify(plan, null, 2));
