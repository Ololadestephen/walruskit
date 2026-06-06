import { longTermArchive, teamVault } from "@walruskit/policies";

export type CliCommand = "init" | "policy" | "plan" | "mcp" | "capsule:create-plan" | "capsule:status";

export function parseCliCommand(argv: string[]): CliCommand {
  const command = argv[2] ?? "plan";
  if (
    command === "init" ||
    command === "policy" ||
    command === "plan" ||
    command === "mcp" ||
    command === "capsule:create-plan" ||
    command === "capsule:status"
  ) {
    return command;
  }
  throw new Error(`Unknown walruskit command: ${command}`);
}

export function renderPolicyPreset(name: "team" | "archive") {
  const sampleOwner = "0x1";
  const sampleBeneficiary = "0x2";
  const sampleGuardians = ["0x3", "0x4", "0x5"] as const;

  return name === "team"
    ? teamVault({
        owner: sampleOwner,
        beneficiary: sampleBeneficiary,
        guardians: [...sampleGuardians],
      })
    : longTermArchive({
        owner: sampleOwner,
        beneficiary: sampleBeneficiary,
        guardians: [...sampleGuardians],
      });
}

export function helpText() {
  return [
    "WalrusKit CLI",
    "",
    "Commands:",
    "  walruskit init      scaffold a Walrus recovery project",
    "  walruskit policy    print a sample recovery policy",
    "  walruskit plan      explain the encrypted blob recovery flow",
    "  walruskit mcp       print MCP server setup notes",
    "  walruskit capsule:create-plan  print Move call plans for a capsule",
    "  walruskit capsule:status       read capsule status through Tatum RPC",
  ].join("\n");
}
