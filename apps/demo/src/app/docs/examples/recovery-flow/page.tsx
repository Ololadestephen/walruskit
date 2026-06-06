import { DocsLayout } from "../../../../components/DocsLayout";

export default function RecoveryFlowExamplePage() {
  return (
    <DocsLayout
      active="recovery-flow"
      breadcrumb="@walruskit / Examples / Recovery flow"
      toc={[
        { href: "#timeline", label: "Timeline" },
        { href: "#commands", label: "Commands" },
        { href: "#states", label: "Expected states" },
      ]}
    >
      <section id="timeline" className="doc-section intro-section">
        <h1>Recovery flow</h1>
        <p className="lead">
          This example shows the full policy path: the owner is active, recovery is rejected, the
          inactivity window passes, the beneficiary requests recovery, guardians approve, and the
          final delay expires.
        </p>
        <div className="flow-grid">
          <article>
            <span>Step 1</span>
            <strong>Create capsule</strong>
            <p>Encrypt data, store it on Walrus, and create the Sui capsule.</p>
          </article>
          <article>
            <span>Step 2</span>
            <strong>Owner active</strong>
            <p>Recovery is rejected because the heartbeat window has not expired.</p>
          </article>
          <article>
            <span>Step 3</span>
            <strong>Request and approve</strong>
            <p>The beneficiary requests recovery and guardians reach the threshold.</p>
          </article>
          <article>
            <span>Step 4</span>
            <strong>Final delay</strong>
            <p>After the delay passes, the policy reports that recovery is ready.</p>
          </article>
        </div>
      </section>

      <section id="commands" className="doc-section">
        <h2>Commands</h2>
        <pre><code>{`npm run capsule:demo-recovery`}</code></pre>
      </section>

      <section id="states" className="doc-section">
        <h2>Expected states</h2>
        <div className="docs-table">
          <div>
            <span>Before timeout</span>
            <p>Recovery request fails because the owner is still considered active.</p>
          </div>
          <div>
            <span>After timeout</span>
            <p>The beneficiary can start recovery.</p>
          </div>
          <div>
            <span>After approval</span>
            <p>Guardian threshold is satisfied, but final delay can still block access.</p>
          </div>
          <div>
            <span>After delay</span>
            <p>Recovery is ready and the app can release the encrypted blob flow.</p>
          </div>
        </div>
      </section>
    </DocsLayout>
  );
}
