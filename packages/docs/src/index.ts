export type WalrusKitGuide = {
  slug: string;
  title: string;
  summary: string;
};

export const guides: WalrusKitGuide[] = [
  {
    slug: "quickstart",
    title: "Quickstart",
    summary: "Encrypt data, upload to Walrus, and create a Sui recovery capsule.",
  },
  {
    slug: "walrus-verification",
    title: "Walrus Verification",
    summary: "Verify downloaded Walrus blobs against Sui-anchored hash and size metadata.",
  },
  {
    slug: "tatum-rpc",
    title: "Tatum Sui RPC",
    summary: "Use a Tatum API key and Sui RPC gateway for capsule state reads and dry-runs.",
  },
  {
    slug: "mcp-agents",
    title: "MCP Agents",
    summary: "Expose encrypted recovery tools to AI agents without giving them plaintext secrets.",
  },
];

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
