import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { evaluateRecovery } from "@walruskit/core";
import { createWalrusKit } from "@walruskit/sdk";
import { getCapsule } from "@walruskit/sui";

const clockObjectId = "0x6";
const ownerStillActiveCode = "9";

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

function suiCall(args) {
  const output = execFileSync("sui", ["client", "call", "--json", ...args], {
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 10,
  });
  return parseJsonOutput(output);
}

function findCapsuleId(result, packageId) {
  const capsule = (result.objectChanges ?? []).find((change) => {
    return change.type === "created" && String(change.objectType ?? "").includes(`${packageId}::capsule::Capsule`);
  });
  return capsule?.objectId;
}

function digestOf(result) {
  return result.digest ?? result.effects?.transactionDigest ?? result.effects?.digest;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function printStatus(label, capsule) {
  const status = evaluateRecovery(capsule);
  console.log(label);
  console.log(`- Approvals: ${status.approvalsCollected} of ${status.approvalsRequired}`);
  console.log(`- Owner inactive: ${status.ownerInactive ? "yes" : "no"}`);
  console.log(`- Final delay passed: ${status.finalDelayPassed ? "yes" : "no"}`);
  console.log(`- Recovery ready: ${status.canRecover ? "yes" : "no"}`);
  if (!status.canRecover) console.log(`- Blocker: ${status.blockers[0]}`);
}

async function main() {
  loadDotEnv();

  const packageId = requireEnv("WALRUSKIT_PACKAGE_ID", "Publish the Move package first.");
  const apiKey = requireEnv("TATUM_API_KEY", "Add it to .env from dashboard.tatum.io.");
  const actor = activeAddress();
  const heartbeatMs = Number(process.env.WALRUSKIT_DEMO_HEARTBEAT_MS ?? 5000);
  const finalDelayMs = Number(process.env.WALRUSKIT_DEMO_FINAL_DELAY_MS ?? 5000);

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

  console.log("WalrusKit demo recovery lifecycle");
  console.log("");
  console.log(`- Actor wallet: ${actor}`);
  console.log(`- Heartbeat timeout: ${heartbeatMs} ms`);
  console.log(`- Final delay: ${finalDelayMs} ms`);

  const encrypted = await kit.encryptText(`WalrusKit demo recovery ${new Date().toISOString()}`);
  const blob = await kit.uploadEncryptedBlob(encrypted, "text/plain");

  console.log(`- Walrus blob: ${blob.blobId}`);

  const createResult = suiCall([
    "--package",
    packageId,
    "--module",
    "capsule",
    "--function",
    "create_capsule",
    "--args",
    actor,
    JSON.stringify([actor]),
    "1",
    String(heartbeatMs),
    String(finalDelayMs),
    JSON.stringify(toByteArray(blob.blobId)),
    JSON.stringify(toByteArray(blob.hash)),
    String(blob.size),
    clockObjectId,
    "--gas-budget",
    "100000000",
  ]);

  const capsuleId = findCapsuleId(createResult, packageId);
  if (!capsuleId) throw new Error("Could not find created Capsule object ID.");
  console.log(`- Created capsule: ${capsuleId}`);
  console.log(`- Create tx: ${digestOf(createResult)}`);

  const earlyRequest = suiCall([
    "--package",
    packageId,
    "--module",
    "capsule",
    "--function",
    "request_recovery",
    "--args",
    capsuleId,
    clockObjectId,
    "--dry-run",
    "--gas-budget",
    "100000000",
  ]);
  const earlyError = earlyRequest.effects?.status?.error ?? "";
  if (!earlyError.includes(`}, ${ownerStillActiveCode})`) && !earlyError.includes(` ${ownerStillActiveCode})`)) {
    throw new Error(`Expected early recovery to fail with owner-still-active abort code ${ownerStillActiveCode}, got: ${earlyError}`);
  }
  console.log("- Early recovery request rejected: owner is still active");

  console.log(`- Waiting ${heartbeatMs} ms for owner inactivity window...`);
  await sleep(heartbeatMs + 1500);

  const requestResult = suiCall([
    "--package",
    packageId,
    "--module",
    "capsule",
    "--function",
    "request_recovery",
    "--args",
    capsuleId,
    clockObjectId,
    "--gas-budget",
    "100000000",
  ]);
  console.log(`- Recovery requested tx: ${digestOf(requestResult)}`);

  const approveResult = suiCall([
    "--package",
    packageId,
    "--module",
    "capsule",
    "--function",
    "approve_recovery",
    "--args",
    capsuleId,
    "--gas-budget",
    "100000000",
  ]);
  console.log(`- Guardian approved tx: ${digestOf(approveResult)}`);

  const beforeFinalDelay = await getCapsule(kit.tatum, capsuleId);
  printStatus("Status before final delay", beforeFinalDelay);

  console.log(`- Waiting ${finalDelayMs} ms for final delay...`);
  await sleep(finalDelayMs + 1500);

  const finalCapsule = await getCapsule(kit.tatum, capsuleId);
  printStatus("Final status", finalCapsule);

  upsertEnv({
    WALRUSKIT_DEMO_CAPSULE_ID: capsuleId,
    WALRUSKIT_DEMO_BLOB_ID: blob.blobId,
    WALRUSKIT_DEMO_BLOB_HASH: blob.hash,
    WALRUSKIT_DEMO_CREATE_TX: digestOf(createResult),
    WALRUSKIT_DEMO_REQUEST_TX: digestOf(requestResult),
    WALRUSKIT_DEMO_APPROVE_TX: digestOf(approveResult),
  });

  console.log("");
  console.log("Demo recovery lifecycle complete");
}

main().catch((error) => {
  console.error("");
  console.error("Demo recovery failed");
  console.error(error instanceof Error ? error.message : String(error));
  console.error("");
  console.error("Checklist:");
  console.error("- WALRUSKIT_PACKAGE_ID is set in .env");
  console.error("- TATUM_API_KEY is set in .env");
  console.error("- Active Sui wallet has enough testnet SUI");
  process.exitCode = 1;
});
