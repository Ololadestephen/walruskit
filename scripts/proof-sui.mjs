import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createCapsuleDraft } from "@walruskit/core";
import { evaluateRecovery } from "@walruskit/core";
import {
  approveRecoveryMoveCall,
  cancelRecoveryMoveCall,
  createCapsuleMoveCall,
  getCapsule,
  getPublishedPackage,
  heartbeatMoveCall,
  requestRecoveryMoveCall,
  SUI_CLOCK_OBJECT_ID,
} from "@walruskit/sui";
import { createTatumSuiClient } from "@walruskit/tatum";

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

function requireEnv(name, hint) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is missing. ${hint}`);
  return value;
}

function printPlan(name, plan) {
  console.log(`- ${name}`);
  console.log(`  target: ${plan.target}`);
  console.log(`  args: ${JSON.stringify(plan.arguments)}`);
}

async function main() {
  loadDotEnv();

  const apiKey = requireEnv("TATUM_API_KEY", "Add it to .env from dashboard.tatum.io.");
  const rpcUrl = process.env.TATUM_SUI_RPC_URL ?? "https://sui-testnet.gateway.tatum.io";
  const packageId = process.env.WALRUSKIT_PACKAGE_ID;
  const capsuleId = process.env.WALRUSKIT_CAPSULE_ID;

  const client = createTatumSuiClient({ apiKey, rpcUrl, network: "testnet" });
  const chainId = await client.request("sui_getChainIdentifier");
  const checkpoint = await client.request("sui_getLatestCheckpointSequenceNumber");

  console.log("WalrusKit proof: Sui Move + Tatum");
  console.log("");
  console.log(`- Chain identifier: ${chainId}`);
  console.log(`- Latest checkpoint: ${checkpoint}`);
  console.log(`- Clock object: ${SUI_CLOCK_OBJECT_ID}`);

  if (packageId) {
    const object = await getPublishedPackage(client, packageId);
    const objectType = object?.data?.type ?? object?.data?.content?.type ?? "package/object";
    console.log(`- Published package/object read through Tatum: ${packageId}`);
    console.log(`- Object type: ${objectType}`);
  } else {
    console.log("- WALRUSKIT_PACKAGE_ID not set, skipping published package lookup.");
  }

  if (capsuleId) {
    const capsule = await getCapsule(client, capsuleId);
    const status = evaluateRecovery(capsule);
    console.log("");
    console.log("Live capsule read through Tatum");
    console.log(`- Capsule ID: ${capsule.id}`);
    console.log(`- Owner: ${capsule.policy.owner}`);
    console.log(`- Beneficiary: ${capsule.policy.beneficiary}`);
    console.log(`- Guardians: ${capsule.policy.guardians.join(", ")}`);
    console.log(`- Threshold: ${status.approvalsRequired}`);
    console.log(`- Approvals: ${status.approvalsCollected} of ${status.approvalsRequired}`);
    console.log(`- Walrus blob ID: ${capsule.blob.blobId}`);
    console.log(`- Walrus hash: ${capsule.blob.hash}`);
    console.log(`- Walrus size: ${capsule.blob.size}`);
    console.log(`- Last heartbeat: ${capsule.lastHeartbeatAt}`);
    console.log(`- Recovery ready: ${status.canRecover ? "yes" : "no"}`);
    if (!status.canRecover) {
      console.log(`- Current blocker: ${status.blockers[0]}`);
    }
  } else {
    console.log("- WALRUSKIT_CAPSULE_ID not set, skipping live capsule lookup.");
  }

  const move = { packageId: packageId ?? "0xWALRUSKIT_PACKAGE_ID" };
  const draft = createCapsuleDraft({
    owner: "0x1",
    beneficiary: "0x2",
    guardians: ["0x3", "0x4", "0x5"],
    threshold: 2,
    heartbeatTimeoutMs: 30 * 24 * 60 * 60 * 1000,
    finalDelayMs: 24 * 60 * 60 * 1000,
    blob: {
      blobId: "walrus-demo-blob",
      hash: "demo-hash",
      size: 128,
      encoding: "aes-gcm",
      createdAt: new Date().toISOString(),
    },
  });

  console.log("");
  console.log("Wallet-ready Move call plans");
  printPlan("create capsule", createCapsuleMoveCall(move, { ...draft.policy, blob: draft.blob }));
  const planCapsuleId = capsuleId ?? "0xCAPSULE_OBJECT_ID";
  printPlan("heartbeat", heartbeatMoveCall(move, planCapsuleId));
  printPlan("request recovery", requestRecoveryMoveCall(move, planCapsuleId));
  printPlan("approve recovery", approveRecoveryMoveCall(move, planCapsuleId));
  printPlan("cancel recovery", cancelRecoveryMoveCall(move, planCapsuleId));

  console.log("");
  console.log("Proof complete");
}

main().catch((error) => {
  console.error("");
  console.error("Sui proof failed");
  console.error(error instanceof Error ? error.message : String(error));
  console.error("");
  console.error("Checklist:");
  console.error("- TATUM_API_KEY is set in .env");
  console.error("- WALRUSKIT_PACKAGE_ID is set after publishing the Move package");
  console.error("- Optional WALRUSKIT_CAPSULE_ID points to a shared capsule object");
  process.exitCode = 1;
});
