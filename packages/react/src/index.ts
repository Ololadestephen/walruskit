import type { CapsuleState } from "@walruskit/core";
import { createRecoveryViewModel } from "@walruskit/headless";
import type { WalrusKit } from "@walruskit/sdk";

export type WalrusKitController = {
  kit: WalrusKit;
  account?: string;
};

export type CapsuleControllerInput = WalrusKitController & {
  capsule?: CapsuleState;
  now?: Date;
};

export function createCapsuleController(input: CapsuleControllerInput) {
  const view = input.capsule ? createRecoveryViewModel(input.capsule, input.account, input.now) : undefined;
  return {
    view,
    canCreate: Boolean(input.account),
    createHeartbeatPlan: (capsuleId: string) => input.kit.heartbeatPlan(capsuleId),
    createRequestRecoveryPlan: (capsuleId: string) => input.kit.requestRecoveryPlan(capsuleId),
    createApprovePlan: (capsuleId: string) => input.kit.approveRecoveryPlan(capsuleId),
    createCancelPlan: (capsuleId: string) => input.kit.cancelRecoveryPlan(capsuleId),
  };
}

export function createWalrusKitProviderValue(kit: WalrusKit, account?: string): WalrusKitController {
  return { kit, account };
}
