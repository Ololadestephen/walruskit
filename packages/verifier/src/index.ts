import type { CapsuleState, WalrusBlobRef } from "@walruskit/core";
import { sha256 } from "@walruskit/crypto";
import type { WalrusClient } from "@walruskit/walrus";

export type BlobVerificationResult = {
  ok: boolean;
  blobIdMatches: boolean;
  hashMatches: boolean;
  sizeMatches: boolean;
  expected: WalrusBlobRef;
  actual: {
    hash: string;
    size: number;
  };
  issues: string[];
};

export async function verifyWalrusBlob(bytes: Uint8Array, expected: WalrusBlobRef): Promise<BlobVerificationResult> {
  const actualHash = await sha256(bytes);
  const actualSize = bytes.byteLength;
  const hashMatches = actualHash === expected.hash;
  const sizeMatches = actualSize === expected.size;
  const issues: string[] = [];

  if (!hashMatches) issues.push("Walrus blob hash does not match the hash anchored on Sui.");
  if (!sizeMatches) issues.push("Walrus blob size does not match the size anchored on Sui.");

  return {
    ok: hashMatches && sizeMatches,
    blobIdMatches: true,
    hashMatches,
    sizeMatches,
    expected,
    actual: {
      hash: actualHash,
      size: actualSize,
    },
    issues,
  };
}

export async function verifyCapsuleBlob(client: WalrusClient, capsule: CapsuleState): Promise<BlobVerificationResult> {
  const bytes = await client.downloadBlob(capsule.blob.blobId);
  return verifyWalrusBlob(bytes, capsule.blob);
}

export function explainVerification(result: BlobVerificationResult) {
  if (result.ok) return "Walrus blob verified against the Sui capsule metadata.";
  return result.issues.join(" ");
}
