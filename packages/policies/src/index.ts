import type { RecoveryPolicy, SuiAddress } from "@walruskit/core";

const hour = 60 * 60 * 1000;
const day = 24 * hour;

export type PolicyPresetInput = {
  owner: SuiAddress;
  beneficiary: SuiAddress;
  guardians: SuiAddress[];
};

export function deadManSwitch(input: PolicyPresetInput): RecoveryPolicy {
  return {
    ...input,
    threshold: Math.min(2, input.guardians.length),
    heartbeatTimeoutMs: 30 * day,
    finalDelayMs: 24 * hour,
  };
}

export function teamVault(input: PolicyPresetInput): RecoveryPolicy {
  return {
    ...input,
    threshold: Math.max(1, Math.ceil(input.guardians.length / 2)),
    heartbeatTimeoutMs: 7 * day,
    finalDelayMs: 12 * hour,
  };
}

export function longTermArchive(input: PolicyPresetInput): RecoveryPolicy {
  return {
    ...input,
    threshold: Math.min(3, input.guardians.length),
    heartbeatTimeoutMs: 365 * day,
    finalDelayMs: 7 * day,
  };
}

export function customPolicy(input: PolicyPresetInput & Partial<Pick<RecoveryPolicy, "threshold" | "heartbeatTimeoutMs" | "finalDelayMs">>): RecoveryPolicy {
  return {
    ...input,
    threshold: input.threshold ?? Math.min(2, input.guardians.length),
    heartbeatTimeoutMs: input.heartbeatTimeoutMs ?? 30 * day,
    finalDelayMs: input.finalDelayMs ?? 24 * hour,
  };
}
