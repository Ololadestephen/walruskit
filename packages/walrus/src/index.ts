import type { WalrusBlobRef } from "@walruskit/core";

export type WalrusClientConfig = {
  publisherUrl: string;
  aggregatorUrl: string;
  fetch?: typeof fetch;
};

export type UploadEncryptedBlobInput = {
  bytes: Uint8Array;
  hash: string;
  contentType?: string;
};

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

type WalrusStoreResponse = {
  newlyCreated?: {
    blobObject?: {
      id?: string;
      blobId?: string;
    };
  };
  alreadyCertified?: {
    blobId?: string;
    event?: {
      txDigest?: string;
    };
  };
  blobId?: string;
};

function joinUrl(base: string, path: string) {
  return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

function extractBlobId(body: WalrusStoreResponse) {
  return body.newlyCreated?.blobObject?.blobId ?? body.alreadyCertified?.blobId ?? body.blobId;
}

export class WalrusClient {
  private readonly fetchImpl: typeof fetch;

  constructor(private readonly config: WalrusClientConfig) {
    this.fetchImpl = config.fetch ?? fetch;
  }

  async uploadEncryptedBlob(input: UploadEncryptedBlobInput): Promise<WalrusBlobRef> {
    const response = await this.fetchImpl(joinUrl(this.config.publisherUrl, "/v1/blobs"), {
      method: "PUT",
      headers: {
        "content-type": input.contentType ?? "application/octet-stream",
        "x-walruskit-hash": input.hash,
      },
      body: toArrayBuffer(input.bytes),
    });

    const body = (await response.json().catch(() => ({}))) as WalrusStoreResponse;
    if (!response.ok) {
      throw new Error(`Walrus upload failed: ${JSON.stringify(body)}`);
    }

    const blobId = extractBlobId(body);
    if (!blobId) {
      throw new Error("Walrus upload succeeded but did not return a blob ID.");
    }

    return {
      blobId,
      objectId: body.newlyCreated?.blobObject?.id,
      hash: input.hash,
      size: input.bytes.byteLength,
      encoding: "aes-gcm",
      contentType: input.contentType ?? "application/octet-stream",
      createdAt: new Date().toISOString(),
    };
  }

  async downloadBlob(blobId: string) {
    const response = await this.fetchImpl(joinUrl(this.config.aggregatorUrl, `/v1/blobs/${blobId}`));
    if (!response.ok) {
      throw new Error(`Walrus download failed: ${response.status} ${response.statusText}`);
    }
    return new Uint8Array(await response.arrayBuffer());
  }

  async getBlobUrl(blobId: string) {
    return joinUrl(this.config.aggregatorUrl, `/v1/blobs/${blobId}`);
  }
}

export function createWalrusClient(config: WalrusClientConfig) {
  return new WalrusClient(config);
}
