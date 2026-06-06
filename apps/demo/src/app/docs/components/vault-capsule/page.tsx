import { DocsLayout } from "../../../../components/DocsLayout";

export default function VaultCapsulePage() {
  return (
    <DocsLayout
      active="vault-capsule"
      breadcrumb="@walruskit / Components / VaultCapsule"
      toc={[
        { href: "#overview", label: "Overview" },
        { href: "#fields", label: "Fields" },
        { href: "#when", label: "When to use" },
      ]}
    >
      <section id="overview" className="doc-section intro-section">
        <h1>VaultCapsule</h1>
        <p className="lead">
          VaultCapsule renders the on-chain recovery capsule: who owns it, who can recover it, which
          guardians must approve, and which Walrus blob is attached.
        </p>
        <pre><code>{`<VaultCapsule
  capsuleId={capsuleId}
  owner={owner}
  beneficiary={beneficiary}
  guardians={guardians}
  threshold={2}
/>`}</code></pre>
      </section>

      <section id="fields" className="doc-section">
        <h2>Fields</h2>
        <div className="docs-table">
          <div>
            <span>Identity</span>
            <p>Capsule ID, owner address, beneficiary address, and guardian list.</p>
          </div>
          <div>
            <span>Policy</span>
            <p>Guardian threshold, heartbeat timeout, final delay, request status, and approvals.</p>
          </div>
          <div>
            <span>Storage</span>
            <p>Walrus blob ID, expected hash, and encrypted byte size.</p>
          </div>
        </div>
      </section>

      <section id="when" className="doc-section">
        <h2>When to use</h2>
        <p>
          Use VaultCapsule anywhere a user needs to confirm they are looking at the right recovery
          object before signing a request, approval, heartbeat, or cancellation transaction.
        </p>
      </section>
    </DocsLayout>
  );
}
