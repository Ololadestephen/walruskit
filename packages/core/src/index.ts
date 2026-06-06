export type SuiAddress = `0x${string}`;

export type HexString = `0x${string}`;

export type WalrusBlobRef = {
  blobId: string;
  objectId?: string;
  hash: string;
  size: number;
  encoding: "raw" | "aes-gcm";
  contentType?: string;
  createdAt: string;
};

export type RecoveryPolicy = {
  owner: SuiAddress;
  beneficiary: SuiAddress;
  guardians: SuiAddress[];
  threshold: number;
  heartbeatTimeoutMs: number;
  finalDelayMs: number;
};

export type CapsuleState = {
  id: string;
  policy: RecoveryPolicy;
  blob: WalrusBlobRef;
  lastHeartbeatAt: string;
  recoveryRequestedAt?: string;
  cancelledAt?: string;
  approvals: Record<SuiAddress, string>;
};

export type RecoveryStatus = {
  canRecover: boolean;
  blockers: string[];
  approvalsCollected: number;
  approvalsRequired: number;
  ownerInactive: boolean;
  finalDelayPassed: boolean;
};

export type CreateCapsuleInput = RecoveryPolicy & {
  blob: WalrusBlobRef;
};

export class WalrusKitError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "WalrusKitError";
  }
}

export function assertAddress(value: string, label = "address"): asserts value is SuiAddress {
  if (!/^0x[a-fA-F0-9]+$/.test(value)) {
    throw new WalrusKitError(`Invalid ${label}.`, "INVALID_ADDRESS", { value });
  }
}

export function normalizeAddress(value: string): SuiAddress {
  assertAddress(value);
  return value.toLowerCase() as SuiAddress;
}

export function uniqueAddresses(addresses: SuiAddress[]) {
  return Array.from(new Set(addresses.map((address) => normalizeAddress(address))));
}

export function countApprovals(state: CapsuleState) {
  const guardianSet = new Set(state.policy.guardians.map((guardian) => normalizeAddress(guardian)));
  return Object.keys(state.approvals).filter((guardian) => guardianSet.has(normalizeAddress(guardian))).length;
}

export function evaluateRecovery(state: CapsuleState, now = new Date()): RecoveryStatus {
  const blockers: string[] = [];
  const approvalsCollected = countApprovals(state);
  const approvalsRequired = state.policy.threshold;
  const lastHeartbeat = new Date(state.lastHeartbeatAt).getTime();
  const requestedAt = state.recoveryRequestedAt ? new Date(state.recoveryRequestedAt).getTime() : undefined;
  const nowMs = now.getTime();
  const ownerInactive = Number.isFinite(lastHeartbeat) && nowMs >= lastHeartbeat + state.policy.heartbeatTimeoutMs;
  const finalDelayPassed =
    requestedAt !== undefined && Number.isFinite(requestedAt) && nowMs >= requestedAt + state.policy.finalDelayMs;

  if (!state.recoveryRequestedAt) blockers.push("Recovery has not been requested.");
  if (state.cancelledAt) blockers.push("Recovery has been cancelled by the owner.");
  if (!ownerInactive) blockers.push("Owner proof-of-life window is still active.");
  if (approvalsCollected < approvalsRequired) {
    blockers.push(`${approvalsRequired - approvalsCollected} more guardian approval(s) required.`);
  }
  if (!finalDelayPassed) blockers.push("Final delay has not passed.");

  return {
    canRecover: blockers.length === 0,
    blockers,
    approvalsCollected,
    approvalsRequired,
    ownerInactive,
    finalDelayPassed,
  };
}

export function createCapsuleDraft(input: CreateCapsuleInput, id = "draft"): CapsuleState {
  return {
    id,
    policy: {
      owner: normalizeAddress(input.owner),
      beneficiary: normalizeAddress(input.beneficiary),
      guardians: uniqueAddresses(input.guardians),
      threshold: input.threshold,
      heartbeatTimeoutMs: input.heartbeatTimeoutMs,
      finalDelayMs: input.finalDelayMs,
    },
    blob: input.blob,
    lastHeartbeatAt: new Date().toISOString(),
    approvals: {},
  };
}
