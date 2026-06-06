import type { CapsuleState } from "@walruskit/core";
import { createRecoveryViewModel } from "@walruskit/headless";
import {
  approveRecoveryMoveCall,
  cancelRecoveryMoveCall,
  heartbeatMoveCall,
  requestRecoveryMoveCall,
  type WalrusKitMoveConfig,
} from "@walruskit/sui";

export type AgentIntent = "inspect" | "heartbeat" | "request-recovery" | "approve" | "cancel" | "decrypt";

export type AgentDecision = {
  allowed: boolean;
  reason: string;
  requiresWalletSignature: boolean;
  moveCall?: ReturnType<typeof heartbeatMoveCall>;
};

export function decideAgentAction(input: {
  intent: AgentIntent;
  capsule: CapsuleState;
  account?: string;
  move: WalrusKitMoveConfig;
  now?: Date;
}): AgentDecision {
  const view = createRecoveryViewModel(input.capsule, input.account, input.now);

  if (input.intent === "inspect") {
    return {
      allowed: true,
      reason: view.nextStep,
      requiresWalletSignature: false,
    };
  }

  if (input.intent === "decrypt") {
    return {
      allowed: view.actions.decrypt,
      reason: view.actions.decrypt
        ? "Recovery rule passed. The beneficiary may decrypt locally."
        : "Agent cannot decrypt because the recovery rule has not passed.",
      requiresWalletSignature: false,
    };
  }

  const actionAllowed = {
    heartbeat: view.actions.heartbeat,
    "request-recovery": view.actions["request-recovery"],
    approve: view.actions.approve,
    cancel: view.actions.cancel,
  }[input.intent];

  const moveCall =
    input.intent === "heartbeat"
      ? heartbeatMoveCall(input.move, input.capsule.id)
      : input.intent === "request-recovery"
        ? requestRecoveryMoveCall(input.move, input.capsule.id)
        : input.intent === "approve"
          ? approveRecoveryMoveCall(input.move, input.capsule.id)
          : cancelRecoveryMoveCall(input.move, input.capsule.id);

  return {
    allowed: actionAllowed,
    reason: actionAllowed ? "Action is allowed for the connected account." : view.nextStep,
    requiresWalletSignature: true,
    moveCall,
  };
}

export function agentSafetyRules() {
  return [
    "Agents may inspect capsule metadata and recovery readiness.",
    "Agents may prepare wallet-signable Move calls.",
    "Agents must not receive plaintext secrets.",
    "Decryption happens locally only after the beneficiary recovery rule passes.",
  ];
}
