import type { MoveCallPlan } from "@walruskit/sui";

export type WalletTransactionDescriptor = {
  kind: "move-call";
  target: string;
  typeArguments: string[];
  arguments: unknown[];
  summary: string;
};

export type WalletAdapterLike = {
  signAndExecuteTransaction?: (input: { transaction: unknown }) => Promise<unknown>;
  signAndExecuteTransactionBlock?: (input: { transactionBlock: unknown }) => Promise<unknown>;
};

export function toWalletTransactionDescriptor(plan: MoveCallPlan, summary = "WalrusKit Move call"): WalletTransactionDescriptor {
  return {
    kind: "move-call",
    target: plan.target,
    typeArguments: plan.typeArguments,
    arguments: plan.arguments,
    summary,
  };
}

export function assertWalletCanSign(wallet: WalletAdapterLike) {
  if (!wallet.signAndExecuteTransaction && !wallet.signAndExecuteTransactionBlock) {
    throw new Error("Connected Sui wallet does not expose a sign-and-execute method.");
  }
}

export async function signWalrusKitTransaction(wallet: WalletAdapterLike, transaction: unknown) {
  assertWalletCanSign(wallet);
  if (wallet.signAndExecuteTransaction) return wallet.signAndExecuteTransaction({ transaction });
  return wallet.signAndExecuteTransactionBlock?.({ transactionBlock: transaction });
}
