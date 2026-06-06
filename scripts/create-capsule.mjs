import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createWalrusKit } from "@walruskit/sdk";

const clockObjectId = "0x6";

function loadDotEnv(path = ".env") {
  const absolutePath = resolve(path);
  if (!existsSync(absolutePath)) return;
  for (const line of readFileSync(absolutePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;
    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

function upsertEnv(values, path = ".env") {
  const absolutePath = resolve(path);
  const existing = existsSync(absolutePath) ? readFileSync(absolutePath, "utf8") : "";
  const lines = existing.split(/\r?\n/).filter(Boolean);
  const seen = new Set();
  const next = lines.map((line) => {
    const key = line.split("=")[0];
    if (Object.prototype.hasOwnProperty.call(values, key)) {
      seen.add(key);
      return `${key}=${values[key]}`;
    }
    return line;
  });

  for (const [key, value] of Object.entries(values)) {
    if (!seen.has(key)) next.push(`${key}=${value}`);
  }

  writeFileSync(absolutePath, `${next.join("\n")}\n`);
}

function requireEnv(name, hint) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is missing. ${hint}`);
  return value;
}

function activeAddress() {
  return execFileSync("sui", ["client", "active-address"], { encoding: "utf8" }).trim();
}

function toByteArray(value) {
  return Array.from(new TextEncoder().encode(value));
}

function parseJsonOutput(output) {
  const jsonStart = output.indexOf("{");
  if (jsonStart === -1) throw new Error(`Sui CLI did not return JSON:\n${output}`);
  return JSON.parse(output.slice(jsonStart));
}

function findCapsuleId(result, packageId) {
  const changes = result.objectChanges ?? [];
  const capsule = changes.find((change) => {
    return change.type === "created" && String(change.objectType ?? "").includes(`${packageId}::capsule::Capsule`);
  });
  return capsule?.objectId;
}

async function main() {
  loadDotEnv();

  const packageId = requireEnv("RECOVERKIT_PACKAGE_ID", "Publish the Move package first.");
  const apiKey = requireEnv("TATUM_API_KEY", "Add it to .env from dashboard.tatum.io.");
  const owner = activeAddress();
  const beneficiary = process.env.RECOVERKIT_BENEFICIARY ?? owner;
  const guardians = (process.env.RECOVERKIT_GUARDIANS ?? owner)
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
  const threshold = Number(process.env.RECOVERKIT_THRESHOLD ?? 1);
  const heartbeatMs = Number(process.env.RECOVERKIT_HEARTBEAT_MS ?? 24 * 60 * 60 * 1000);
  const finalDelayMs = Number(process.env.RECOVERKIT_FINAL_DELAY_MS ?? 60 * 60 * 1000);

  if (threshold < 1 || threshold > guardians.length) {
    throw new Error(`RECOVERKIT_THRESHOLD must be between 1 and guardian count (${guardians.length}).`);
  }

  const kit = createWalrusKit({
    tatum: {
      apiKey,
      rpcUrl: process.env.TATUM_SUI_RPC_URL ?? "https://sui-testnet.gateway.tatum.io",
      network: "testnet",
    },
    walrus: {
      publisherUrl: process.env.WALRUS_PUBLISHER_URL ?? "https://publisher.walrus-testnet.walrus.space",
      aggregatorUrl: process.env.WALRUS_AGGREGATOR_URL ?? "https://aggregator.walrus-testnet.walrus.space",
    },
    move: { packageId },
  });

  console.log("Creating WalrusKit capsule");
  console.log(`- Owner: ${owner}`);
  console.log(`- Beneficiary: ${beneficiary}`);
  console.log(`- Guardians: ${guardians.join(", ")}`);
  console.log(`- Threshold: ${threshold} of ${guardians.length}`);

  const plaintext = `WalrusKit live capsule ${new Date().toISOString()}`;
  const encrypted = await kit.encryptText(plaintext);
  const blob = await kit.uploadEncryptedBlob(encrypted, "text/plain");

  console.log(`- Walrus blob ID: ${blob.blobId}`);
  console.log(`- Walrus hash: ${blob.hash}`);
  console.log(`- Walrus size: ${blob.size}`);

  const args = [
    "client",
    "call",
    "--json",
    "--package",
    packageId,
    "--module",
    "capsule",
    "--function",
    "create_capsule",
    "--args",
    beneficiary,
    JSON.stringify(guardians),
    String(threshold),
    String(heartbeatMs),
    String(finalDelayMs),
    JSON.stringify(toByteArray(blob.blobId)),
    JSON.stringify(toByteArray(blob.hash)),
    String(blob.size),
    clockObjectId,
    "--gas-budget",
    "100000000",
  ];

  const output = execFileSync("sui", args, { encoding: "utf8", maxBuffer: 1024 * 1024 * 10 });
  const result = parseJsonOutput(output);
  const digest = result.digest ?? result.effects?.transactionDigest ?? result.effects?.digest;
  const capsuleId = findCapsuleId(result, packageId);

  if (!capsuleId) {
    throw new Error(`Capsule transaction succeeded, but no Capsule object ID was found.\n${output}`);
  }

  upsertEnv({
    RECOVERKIT_CAPSULE_ID: capsuleId,
    RECOVERKIT_LAST_BLOB_ID: blob.blobId,
    RECOVERKIT_LAST_BLOB_HASH: blob.hash,
    RECOVERKIT_LAST_BLOB_SIZE: String(blob.size),
    RECOVERKIT_LAST_CAPSULE_TX: digest,
  });

  console.log(`- Transaction digest: ${digest}`);
  console.log(`- Capsule object ID: ${capsuleId}`);
  console.log("");
  console.log("Capsule created and saved to .env");
}

main().catch((error) => {
  console.error("");
  console.error("Capsule creation failed");
  console.error(error instanceof Error ? error.message : String(error));
  console.error("");
  console.error("Checklist:");
  console.error("- RECOVERKIT_PACKAGE_ID is set in .env");
  console.error("- TATUM_API_KEY is set in .env");
  console.error("- Active Sui wallet has testnet gas");
  console.error("- Optional guardian env values are valid Sui addresses");
  process.exitCode = 1;
});
