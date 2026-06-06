import type { RecoveryViewModel } from "@walruskit/headless";

export const recoverKitTheme = {
  colors: {
    background: "#061421",
    panel: "#091827",
    border: "#243446",
    text: "#f7efe0",
    muted: "#9fb0c2",
    accent: "#fff1d6",
    success: "#63d297",
    warning: "#f5bf61",
    danger: "#ef6b73",
  },
  radius: {
    panel: 8,
    control: 6,
  },
};

export function formatRecoverySummary(view: RecoveryViewModel) {
  if (view.status.canRecover) return "Ready to decrypt";
  if (view.role === "owner" && view.actions.cancel) return "Recovery active. Owner can cancel.";
  if (view.role === "guardian" && view.actions.approve) return "Guardian approval needed.";
  if (view.role === "beneficiary" && view.actions["request-recovery"]) return "Owner is inactive. Request recovery.";
  return view.nextStep;
}

export function recoveryChecklist(view: RecoveryViewModel) {
  return [
    {
      label: "Owner inactive",
      complete: view.status.ownerInactive,
    },
    {
      label: `${view.approvalProgress.collected} of ${view.approvalProgress.required} approvals`,
      complete: view.approvalProgress.collected >= view.approvalProgress.required,
    },
    {
      label: "Final delay passed",
      complete: view.status.finalDelayPassed,
    },
  ];
}
