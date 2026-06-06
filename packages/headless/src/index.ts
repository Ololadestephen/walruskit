import type { CapsuleState, RecoveryStatus, SuiAddress } from "@walruskit/core";
import { evaluateRecovery, normalizeAddress } from "@walruskit/core";

export type ActorRole = "owner" | "beneficiary" | "guardian" | "viewer";

export type RecoveryAction =
  | "create"
  | "heartbeat"
  | "request-recovery"
  | "approve"
  | "cancel"
  | "decrypt";

export type RecoveryViewModel = {
  role: ActorRole;
  status: RecoveryStatus;
  actions: Record<RecoveryAction, boolean>;
  nextStep: string;
  approvalProgress: {
    collected: number;
    required: number;
    percent: number;
  };
};

export function getActorRole(state: CapsuleState, account?: string): ActorRole {
  if (!account) return "viewer";
  const normalized = normalizeAddress(account);
  if (normalized === normalizeAddress(state.policy.owner)) return "owner";
  if (normalized === normalizeAddress(state.policy.beneficiary)) return "beneficiary";
  if (state.policy.guardians.some((guardian) => normalizeAddress(guardian) === normalized)) return "guardian";
  return "viewer";
}

export function createRecoveryViewModel(state: CapsuleState, account?: string, now = new Date()): RecoveryViewModel {
  const role = getActorRole(state, account);
  const status = evaluateRecovery(state, now);
  const requested = Boolean(state.recoveryRequestedAt);
  const actions = {
    create: role === "owner",
    heartbeat: role === "owner",
    "request-recovery": role === "beneficiary" && status.ownerInactive && !requested,
    approve: role === "guardian" && requested && !status.canRecover,
    cancel: role === "owner" && requested,
    decrypt: role === "beneficiary" && status.canRecover,
  };

  const nextStep = status.canRecover
    ? "Recovery is ready. The beneficiary can decrypt the Walrus blob."
    : status.blockers[0] ?? "Waiting for the recovery rule to pass.";

  return {
    role,
    status,
    actions,
    nextStep,
    approvalProgress: {
      collected: status.approvalsCollected,
      required: status.approvalsRequired,
      percent:
        status.approvalsRequired === 0
          ? 100
          : Math.min(100, Math.round((status.approvalsCollected / status.approvalsRequired) * 100)),
    },
  };
}
