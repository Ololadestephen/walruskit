import type { CapsuleState, CreateCapsuleInput, SuiAddress } from "@walruskit/core";
import type { TatumSuiClient } from "@walruskit/tatum";

export const SUI_CLOCK_OBJECT_ID = "0x6";

export type WalrusKitMoveConfig = {
  packageId: string;
  moduleName?: string;
  clockObjectId?: string;
};

export type MoveCallPlan = {
  target: string;
  typeArguments: string[];
  arguments: unknown[];
};

function clockObjectId(config: WalrusKitMoveConfig) {
  return config.clockObjectId ?? SUI_CLOCK_OBJECT_ID;
}

function stringToMoveBytes(value: string) {
  return Array.from(new TextEncoder().encode(value));
}

export function createCapsuleMoveCall(config: WalrusKitMoveConfig, input: CreateCapsuleInput): MoveCallPlan {
  const moduleName = config.moduleName ?? "capsule";
  return {
    target: `${config.packageId}::${moduleName}::create_capsule`,
    typeArguments: [],
    arguments: [
      input.beneficiary,
      input.guardians,
      input.threshold,
      input.heartbeatTimeoutMs,
      input.finalDelayMs,
      stringToMoveBytes(input.blob.blobId),
      stringToMoveBytes(input.blob.hash),
      input.blob.size,
      clockObjectId(config),
    ],
  };
}

export function heartbeatMoveCall(config: WalrusKitMoveConfig, capsuleId: string): MoveCallPlan {
  return {
    target: `${config.packageId}::${config.moduleName ?? "capsule"}::heartbeat`,
    typeArguments: [],
    arguments: [capsuleId, clockObjectId(config)],
  };
}

export function requestRecoveryMoveCall(config: WalrusKitMoveConfig, capsuleId: string): MoveCallPlan {
  return {
    target: `${config.packageId}::${config.moduleName ?? "capsule"}::request_recovery`,
    typeArguments: [],
    arguments: [capsuleId, clockObjectId(config)],
  };
}

export function approveRecoveryMoveCall(config: WalrusKitMoveConfig, capsuleId: string): MoveCallPlan {
  return {
    target: `${config.packageId}::${config.moduleName ?? "capsule"}::approve_recovery`,
    typeArguments: [],
    arguments: [capsuleId],
  };
}

export function cancelRecoveryMoveCall(config: WalrusKitMoveConfig, capsuleId: string): MoveCallPlan {
  return {
    target: `${config.packageId}::${config.moduleName ?? "capsule"}::cancel_recovery`,
    typeArguments: [],
    arguments: [capsuleId],
  };
}

type SuiObjectResponse = {
  data?: {
    objectId?: string;
    content?: {
      fields?: Record<string, unknown>;
    };
  };
};

type MoveFieldValue = {
  fields?: Record<string, unknown>;
};

function asAddress(value: unknown): SuiAddress {
  return String(value) as SuiAddress;
}

function asStringArray(value: unknown): SuiAddress[] {
  return Array.isArray(value) ? value.map((item) => asAddress(item)) : [];
}

function asUtf8String(value: unknown) {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return new TextDecoder().decode(new Uint8Array(value.map(Number)));
  return String(value ?? "");
}

function asTimestamp(value: unknown) {
  const timestamp = Number(value ?? 0);
  return timestamp > 0 ? new Date(timestamp).toISOString() : undefined;
}

function approvalsFromMoveVector(value: unknown): Record<SuiAddress, string> {
  const approvals: Record<SuiAddress, string> = {};
  if (!Array.isArray(value)) return approvals;
  for (const item of value) {
    const address = typeof item === "object" && item !== null ? (item as MoveFieldValue).fields?.value : item;
    approvals[asAddress(address)] = new Date().toISOString();
  }
  return approvals;
}
export function parseCapsuleObject(response: SuiObjectResponse): CapsuleState {
  const fields = response.data?.content?.fields;
  if (!fields || !response.data?.objectId) {
    throw new Error("Sui object is not a WalrusKit capsule object.");
  }

  const lastHeartbeatAt = asTimestamp(fields.last_heartbeat_at_ms) ?? new Date().toISOString();
  const recoveryRequestedAt = asTimestamp(fields.recovery_requested_at_ms);
  return {
    id: response.data.objectId,
    policy: {
      owner: asAddress(fields.owner),
      beneficiary: asAddress(fields.beneficiary),
      guardians: asStringArray(fields.guardians),
      threshold: Number(fields.threshold ?? 0),
      heartbeatTimeoutMs: Number(fields.heartbeat_timeout_ms ?? 0),
      finalDelayMs: Number(fields.final_delay_ms ?? 0),
    },
    blob: {
      blobId: asUtf8String(fields.blob_id),
      hash: asUtf8String(fields.blob_hash),
      size: Number(fields.blob_size ?? 0),
      encoding: "aes-gcm",
      createdAt: asTimestamp(fields.created_at_ms) ?? new Date().toISOString(),
    },
    lastHeartbeatAt,
    recoveryRequestedAt,
    cancelledAt: fields.cancelled ? new Date().toISOString() : undefined,
    approvals: approvalsFromMoveVector(fields.approved_guardians),
  };
}

export async function getPublishedPackage(client: TatumSuiClient, packageId: string) {
  return client.getObject(packageId, {
    showContent: true,
    showType: true,
    showOwner: true,
    showPreviousTransaction: true,
  });
}

export async function getCapsule(client: TatumSuiClient, capsuleId: string) {
  const object = await client.getObject(capsuleId, {
    showContent: true,
    showType: true,
    showOwner: true,
  });
  return parseCapsuleObject(object as SuiObjectResponse);
}
