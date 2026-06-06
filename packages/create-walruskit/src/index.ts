export type WalrusKitTemplate = {
  name: string;
  path: string;
  description: string;
};

export const templates: WalrusKitTemplate[] = [
  {
    name: "next-walrus-recovery",
    path: "templates/next-walrus-recovery",
    description: "A Next.js starter for encrypted Walrus blob recovery on Sui.",
  },
  {
    name: "agent-memory",
    path: "templates/agent-memory",
    description: "An MCP-friendly encrypted memory starter for AI agents.",
  },
];

export function listTemplates() {
  return templates;
}
