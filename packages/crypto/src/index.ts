export type EncryptedBlob = {
  ciphertext: Uint8Array;
  key: JsonWebKey;
  iv: string;
  algorithm: "AES-GCM";
  hash: string;
  plaintextSize: number;
};

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBytes(hex: string) {
  const clean = hex.replace(/^0x/, "");
  return new Uint8Array(clean.match(/.{1,2}/g)?.map((byte) => Number.parseInt(byte, 16)) ?? []);
}

function cryptoApi() {
  if (!globalThis.crypto?.subtle) {
    throw new Error("WalrusKit crypto requires WebCrypto. Use Node 20+ or a browser runtime.");
  }
  return globalThis.crypto;
}

function toArrayBuffer(bytes: Uint8Array | ArrayBuffer): ArrayBuffer {
  if (bytes instanceof ArrayBuffer) return bytes;
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

export async function sha256(bytes: Uint8Array | ArrayBuffer | string) {
  const input = typeof bytes === "string" ? new TextEncoder().encode(bytes) : bytes;
  const digest = await cryptoApi().subtle.digest("SHA-256", toArrayBuffer(input));
  return bytesToHex(new Uint8Array(digest));
}

export async function generateAesKey() {
  return cryptoApi().subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
}

export async function exportAesKey(key: CryptoKey) {
  return cryptoApi().subtle.exportKey("jwk", key);
}

export async function importAesKey(key: JsonWebKey) {
  return cryptoApi().subtle.importKey("jwk", key, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}

export async function encryptBytes(bytes: Uint8Array, key?: CryptoKey): Promise<EncryptedBlob> {
  const aesKey = key ?? (await generateAesKey());
  const iv = cryptoApi().getRandomValues(new Uint8Array(12));
  const ciphertext = new Uint8Array(
    await cryptoApi().subtle.encrypt({ name: "AES-GCM", iv }, aesKey, toArrayBuffer(bytes)),
  );
  return {
    ciphertext,
    key: await exportAesKey(aesKey),
    iv: bytesToHex(iv),
    algorithm: "AES-GCM",
    hash: await sha256(ciphertext),
    plaintextSize: bytes.byteLength,
  };
}

export async function encryptText(text: string, key?: CryptoKey) {
  return encryptBytes(new TextEncoder().encode(text), key);
}

export async function decryptBytes(input: { ciphertext: Uint8Array; key: JsonWebKey; iv: string }) {
  const key = await importAesKey(input.key);
  const plaintext = await cryptoApi().subtle.decrypt(
    { name: "AES-GCM", iv: hexToBytes(input.iv) },
    key,
    toArrayBuffer(input.ciphertext),
  );
  return new Uint8Array(plaintext);
}

export async function decryptText(input: { ciphertext: Uint8Array; key: JsonWebKey; iv: string }) {
  return new TextDecoder().decode(await decryptBytes(input));
}

export function encodeKeyEnvelope(input: EncryptedBlob) {
  return {
    algorithm: input.algorithm,
    key: input.key,
    iv: input.iv,
    hash: input.hash,
    plaintextSize: input.plaintextSize,
  };
}
