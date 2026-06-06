#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { evaluateRecovery } from "@walruskit/core";
import {
  approveRecoveryMoveCall,
  cancelRecoveryMoveCall,
  getCapsule,
  heartbeatMoveCall,
  requestRecoveryMoveCall,
} from "@walruskit/sui";
import { createTatumSuiClient } from "@walruskit/tatum";
import { helpText, parseCliCommand, renderPolicyPreset } from "../dist/index.js";

const command = parseCliCommand(process.argv);

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

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required.`);
  return value;
}

function printPlan(name, plan) {
  console.log(`${name}:`);
  console.log(`  target: ${plan.target}`);
  console.log(`  args: ${JSON.stringify(plan.arguments)}`);
}

if (command === "policy") {
  console.log(JSON.stringify(renderPolicyPreset("team"), null, 2));
} else if (command === "mcp") {
  console.log("Run walruskit-mcp to expose Walrus recovery tools to AI agents.");
} else if (command === "capsule:create-plan") {
  loadDotEnv();
  const packageId = requireEnv("WALRUSKIT_PACKAGE_ID");
  const capsuleId = process.env.WALRUSKIT_CAPSULE_ID ?? "0xCAPSULE_OBJECT_ID";
  const move = { packageId };
  printPlan("heartbeat", heartbeatMoveCall(move, capsuleId));
  printPlan("request recovery", requestRecoveryMoveCall(move, capsuleId));
  printPlan("approve recovery", approveRecoveryMoveCall(move, capsuleId));
  printPlan("cancel recovery", cancelRecoveryMoveCall(move, capsuleId));
} else if (command === "capsule:status") {
  loadDotEnv();
  const client = createTatumSuiClient({
    apiKey: requireEnv("TATUM_API_KEY"),
    rpcUrl: process.env.TATUM_SUI_RPC_URL,
    network: "testnet",
  });
  const capsule = await getCapsule(client, requireEnv("WALRUSKIT_CAPSULE_ID"));
  const status = evaluateRecovery(capsule);
  console.log(`Capsule: ${capsule.id}`);
  console.log(`Owner: ${capsule.policy.owner}`);
  console.log(`Beneficiary: ${capsule.policy.beneficiary}`);
  console.log(`Guardians: ${capsule.policy.guardians.join(", ")}`);
  console.log(`Approvals: ${status.approvalsCollected} of ${status.approvalsRequired}`);
  console.log(`Walrus blob: ${capsule.blob.blobId}`);
  console.log(`Recovery ready: ${status.canRecover ? "yes" : "no"}`);
  if (!status.canRecover) console.log(`Blocker: ${status.blockers[0]}`);
} else {
  console.log(helpText());
}
