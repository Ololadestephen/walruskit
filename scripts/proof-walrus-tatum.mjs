import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createWalrusKit } from "@walruskit/sdk";
import { explainVerification, verifyWalrusBlob } from "@walruskit/verifier";

const defaults = {
  TATUM_SUI_RPC_URL: "https://sui-testnet.gateway.tatum.io",
  WALRUS_PUBLISHER_URL: "https://publisher.walrus-testnet.walrus.space",
  WALRUS_AGGREGATOR_URL: "https://aggregator.walrus-testnet.walrus.space",
};

function loadDotEnv(path = ".env") {
  const absolutePath = resolve(path);
  if (!existsSync(absolutePath)) return;

  const lines = readFileSync(absolutePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

function requireEnv(name, hint) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is missing. ${hint}`);
  }
  return value;
}

function short(value, size = 10) {
  if (!value || value.length <= size * 2) return value;
  return `${value.slice(0, size)}...${value.slice(-size)}`;
}

async function main() {
  loadDotEnv();

  const tatumApiKey = requireEnv("TATUM_API_KEY", "Add it to .env from dashboard.tatum.io.");
  const tatumRpcUrl = process.env.TATUM_SUI_RPC_URL ?? defaults.TATUM_SUI_RPC_URL;
  const publisherUrl = process.env.WALRUS_PUBLISHER_URL ?? defaults.WALRUS_PUBLISHER_URL;
  const aggregatorUrl = process.env.WALRUS_AGGREGATOR_URL ?? defaults.WALRUS_AGGREGATOR_URL;

  const kit = createWalrusKit({
    tatum: {
      rpcUrl: tatumRpcUrl,
      apiKey: tatumApiKey,
      network: "testnet",
    },
    walrus: {
      publisherUrl,
      aggregatorUrl,
    },
  });

  console.log("WalrusKit proof: Walrus + Tatum");
  console.log("");
  console.log("Tatum RPC");
  console.log(`- RPC URL: ${tatumRpcUrl}`);
  console.log(`- API key: ${short(tatumApiKey, 6)}`);

  const chainId = await kit.tatum.request("sui_getChainIdentifier");
  const checkpoint = await kit.tatum.request("sui_getLatestCheckpointSequenceNumber");
  console.log(`- Chain identifier: ${chainId}`);
  console.log(`- Latest checkpoint: ${checkpoint}`);
  console.log("- Status: Tatum Sui RPC read succeeded");

  console.log("");
  console.log("Walrus encrypted blob");
  console.log(`- Publisher: ${publisherUrl}`);
  console.log(`- Aggregator: ${aggregatorUrl}`);

  const plaintext = `WalrusKit proof ${new Date().toISOString()}: encrypted Walrus blob anchored for Sui recovery.`;
  const encrypted = await kit.encryptText(plaintext);
  console.log(`- Plaintext bytes: ${encrypted.plaintextSize}`);
  console.log(`- Ciphertext bytes: ${encrypted.ciphertext.byteLength}`);
  console.log(`- Ciphertext hash: ${encrypted.hash}`);

  const blob = await kit.uploadEncryptedBlob(encrypted, "text/plain");
  console.log(`- Uploaded blob ID: ${blob.blobId}`);
  console.log(`- Blob size anchored: ${blob.size}`);

  const downloadedBytes = await kit.downloadEncryptedBlob(blob.blobId);
  const verification = await verifyWalrusBlob(downloadedBytes, blob);
  console.log(`- Downloaded bytes: ${downloadedBytes.byteLength}`);
  console.log(`- Verification: ${explainVerification(verification)}`);

  const recoveredText = await kit.decryptText({
    ciphertext: downloadedBytes,
    key: encrypted.key,
    iv: encrypted.iv,
  });

  if (recoveredText !== plaintext) {
    throw new Error("Decrypted Walrus payload did not match the original plaintext.");
  }

  console.log("- Decryption: downloaded Walrus ciphertext decrypted back to the original note");
  console.log("");
  console.log("Proof complete");
}

main().catch((error) => {
  console.error("");
  console.error("Proof failed");
  console.error(error instanceof Error ? error.message : String(error));
  console.error("");
  console.error("Checklist:");
  console.error("- TATUM_API_KEY is set in .env");
  console.error("- TATUM_SUI_RPC_URL points to a Sui RPC gateway");
  console.error("- WALRUS_PUBLISHER_URL is reachable");
  console.error("- WALRUS_AGGREGATOR_URL is reachable");
  process.exitCode = 1;
});
