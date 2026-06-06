import { DocsLayout } from "../../../../components/DocsLayout";

export default function RecoveryStatusPage() {
  return (
    <DocsLayout
      active="recovery-status"
      breadcrumb="@walruskit / Components / RecoveryStatus"
      toc={[
        { href: "#states", label: "States" },
        { href: "#copy", label: "User copy" },
        { href: "#example", label: "Example messages" },
      ]}
    >
      <section id="states" className="doc-section intro-section">
        <h1>RecoveryStatus</h1>
        <p className="lead">
          RecoveryStatus translates raw capsule fields into user-facing states: protected, owner
          inactive, recovery requested, waiting for guardians, final delay, or ready.
        </p>
        <div className="proof-table">
          <div>
            <span>Protected</span>
            <strong>Owner active</strong>
          </div>
          <div>
            <span>Requested</span>
            <strong>Beneficiary started</strong>
          </div>
          <div>
            <span>Approving</span>
            <strong>Guardians needed</strong>
          </div>
          <div>
            <span>Ready</span>
            <strong>Policy passed</strong>
          </div>
        </div>
      </section>

      <section id="copy" className="doc-section">
        <h2>User copy</h2>
        <p>
          The component avoids raw transaction errors and explains what the user can do next in
          plain language.
        </p>
        <div className="docs-table">
          <div>
            <span>Owner active</span>
            <p>Recovery cannot start yet because the owner has checked in recently.</p>
          </div>
          <div>
            <span>Approval needed</span>
            <p>One or more guardians still need to approve the request.</p>
          </div>
          <div>
            <span>Final delay</span>
            <p>The guardian threshold is met, but the owner still has time to cancel.</p>
          </div>
        </div>
      </section>

      <section id="example" className="doc-section">
        <h2>Example messages</h2>
        <pre><code>{`Protected:
"The owner is still active. Recovery can start after the heartbeat window passes."

Waiting for guardians:
"Recovery has started. 1 of 2 guardians has approved."

Ready:
"All recovery conditions passed. The beneficiary can continue."`}</code></pre>
      </section>
    </DocsLayout>
  );
}
