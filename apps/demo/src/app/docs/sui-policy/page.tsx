import { DocsLayout } from "../../../components/DocsLayout";

export default function SuiPolicyPage() {
  return (
    <DocsLayout
      active="sui-policy"
      breadcrumb="@walruskit / Core Concepts / Sui policy"
      toc={[
        { href: "#capsule", label: "Capsule state" },
        { href: "#conditions", label: "Recovery conditions" },
        { href: "#calls", label: "Move calls" },
      ]}
    >
      <section id="capsule" className="doc-section intro-section">
        <h1>Sui policy</h1>
        <p className="lead">
          WalrusKit uses a Move capsule to hold the recovery policy for a Walrus blob. The capsule
          is the source of truth for who can start recovery and when access is ready.
        </p>
      </section>

      <section id="conditions" className="doc-section">
        <h2>Recovery conditions</h2>
        <div className="flow-grid">
          <article>
            <span>Owner</span>
            <strong>Heartbeat</strong>
            <p>The owner can refresh activity. Recovery is blocked while the owner is active.</p>
          </article>
          <article>
            <span>Beneficiary</span>
            <strong>Request</strong>
            <p>The beneficiary starts recovery after the inactivity window has passed.</p>
          </article>
          <article>
            <span>Guardians</span>
            <strong>Approval</strong>
            <p>Guardians approve recovery until the configured threshold is reached.</p>
          </article>
          <article>
            <span>Delay</span>
            <strong>Final wait</strong>
            <p>A final delay gives the owner time to cancel if the request is wrong.</p>
          </article>
        </div>
      </section>

      <section id="calls" className="doc-section">
        <h2>Move calls</h2>
        <ul className="package-list">
          <li>
            <code>create_capsule</code> creates the recovery object and anchors Walrus metadata.
          </li>
          <li>
            <code>heartbeat</code> refreshes owner activity.
          </li>
          <li>
            <code>request_recovery</code> starts the recovery flow after inactivity.
          </li>
          <li>
            <code>approve_recovery</code> records guardian approval.
          </li>
          <li>
            <code>can_recover</code> checks whether policy has fully passed.
          </li>
        </ul>
      </section>
    </DocsLayout>
  );
}
