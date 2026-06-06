import type { CreateCapsuleInput } from "@walruskit/core";
import { createCapsuleDraft, evaluateRecovery } from "@walruskit/core";
import { decryptBytes, decryptText, encryptBytes, encryptText, sha256, type EncryptedBlob } from "@walruskit/crypto";
import {
  approveRecoveryMoveCall,
  cancelRecoveryMoveCall,
  createCapsuleMoveCall,
  getCapsule,
  heartbeatMoveCall,
  requestRecoveryMoveCall,
  type WalrusKitMoveConfig,
} from "@walruskit/sui";
import { createTatumSuiClient, type TatumSuiClientConfig } from "@walruskit/tatum";
import { createWalrusClient, type WalrusClientConfig } from "@walruskit/walrus";

export type WalrusKitConfig = {
  walrus: WalrusClientConfig;
  tatum: TatumSuiClientConfig;
  move?: WalrusKitMoveConfig;
};

export type CapsulePlanInput = Omit<CreateCapsuleInput, "blob"> & {
  blob: CreateCapsuleInput["blob"];
};

export function createWalrusKit(config: WalrusKitConfig) {
  const walrus = createWalrusClient(config.walrus);
  const tatum = createTatumSuiClient(config.tatum);

  return {
    walrus,
    tatum,
    encryptText,
    encryptBytes,
    decryptText,
    decryptBytes,
    hash: sha256,

    async uploadEncryptedBlob(encrypted: EncryptedBlob, contentType?: string) {
      return walrus.uploadEncryptedBlob({
        bytes: encrypted.ciphertext,
        hash: encrypted.hash,
        contentType,
      });
    },

    async downloadEncryptedBlob(blobId: string, expectedHash?: string) {
      const bytes = await walrus.downloadBlob(blobId);
      if (expectedHash) {
        const actualHash = await sha256(bytes);
        if (actualHash !== expectedHash) {
          throw new Error(`Walrus blob hash mismatch: expected ${expectedHash}, got ${actualHash}`);
        }
      }
      return bytes;
    },

    createCapsulePlan(input: CapsulePlanInput) {
      const draft = createCapsuleDraft(input);
      return {
        draft,
        moveCall: config.move ? createCapsuleMoveCall(config.move, input) : undefined,
      };
    },

    heartbeatPlan(capsuleId: string) {
      if (!config.move) throw new Error("Move package config is required for heartbeatPlan.");
      return heartbeatMoveCall(config.move, capsuleId);
    },

    requestRecoveryPlan(capsuleId: string) {
      if (!config.move) throw new Error("Move package config is required for requestRecoveryPlan.");
      return requestRecoveryMoveCall(config.move, capsuleId);
    },

    approveRecoveryPlan(capsuleId: string) {
      if (!config.move) throw new Error("Move package config is required for approveRecoveryPlan.");
      return approveRecoveryMoveCall(config.move, capsuleId);
    },

    cancelRecoveryPlan(capsuleId: string) {
      if (!config.move) throw new Error("Move package config is required for cancelRecoveryPlan.");
      return cancelRecoveryMoveCall(config.move, capsuleId);
    },

    async getCapsule(capsuleId: string) {
      return getCapsule(tatum, capsuleId);
    },

    async getRecoveryStatus(capsuleId: string, now = new Date()) {
      return evaluateRecovery(await getCapsule(tatum, capsuleId), now);
    },
  };
}

export type WalrusKit = ReturnType<typeof createWalrusKit>;
