export type McpToolDefinition = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
};

export const recoverKitMcpTools: McpToolDefinition[] = [
  {
    name: "walruskit_encrypt_and_store",
    description: "Encrypt bytes locally, upload the ciphertext to Walrus, and return a blob reference.",
    inputSchema: {
      type: "object",
      properties: {
        text: { type: "string" },
        contentType: { type: "string" },
      },
      required: ["text"],
    },
  },
  {
    name: "walruskit_recovery_status",
    description: "Read a Sui capsule through Tatum RPC and explain whether recovery can proceed.",
    inputSchema: {
      type: "object",
      properties: {
        capsuleId: { type: "string" },
        account: { type: "string" },
      },
      required: ["capsuleId"],
    },
  },
  {
    name: "walruskit_create_move_call",
    description: "Create a wallet-ready Move call plan for heartbeat, request, approve, or cancel.",
    inputSchema: {
      type: "object",
      properties: {
        action: { enum: ["heartbeat", "request", "approve", "cancel"] },
        capsuleId: { type: "string" },
      },
      required: ["action", "capsuleId"],
    },
  },
];

export function createMcpManifest() {
  return {
    name: "walruskit-mcp",
    version: "0.1.0",
    tools: recoverKitMcpTools,
  };
}
