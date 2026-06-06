import { DocsLayout } from "../../../components/DocsLayout";

export default function AgentsPage() {
  return (
    <DocsLayout
      active="agents"
      breadcrumb="@walruskit / Tooling / Agent Kit"
      toc={[
        { href: "#agent-kit", label: "Agent Kit" },
        { href: "#can-do", label: "What agents can do" },
        { href: "#cannot-do", label: "Safety boundaries" },
        { href: "#example", label: "Example flow" },
      ]}
    >
      <section id="agent-kit" className="doc-section intro-section">
        <h1>Agent Kit</h1>
        <p className="lead">
          Agent Kit lets AI assistants work with WalrusKit capsules safely. An agent can inspect
          recovery state, explain what is blocking access, and prepare wallet-signable Sui actions
          without ever seeing plaintext secrets or private keys.
        </p>
        <div className="callout">
          The agent is a recovery assistant, not a custodian. It can reason about capsule state and
          prepare the next action, but the user&apos;s wallet still decides what gets signed.
        </div>
      </section>

      <section id="can-do" className="doc-section">
        <h2>What agents can do</h2>
        <div className="flow-grid">
          <article>
            <span>Status</span>
            <strong>Read capsule state</strong>
            <p>Fetch owner activity, request status, approvals, and final-delay timing through Tatum RPC.</p>
          </article>
          <article>
            <span>Explain</span>
            <strong>Summarize blockers</strong>
            <p>Translate raw policy fields into clear next steps for owners, beneficiaries, and guardians.</p>
          </article>
          <article>
            <span>Prepare</span>
            <strong>Plan wallet actions</strong>
            <p>Create call plans for heartbeat, beneficiary request, guardian approval, and cancel recovery.</p>
          </article>
          <article>
            <span>Monitor</span>
            <strong>Track readiness</strong>
            <p>Tell users whether recovery is protected, pending approvals, inside final delay, or ready.</p>
          </article>
        </div>
      </section>

      <section id="cannot-do" className="doc-section">
        <h2>Safety boundaries</h2>
        <div className="docs-table">
          <div>
            <span>No plaintext</span>
            <p>The agent does not read, decrypt, or store the protected secret.</p>
          </div>
          <div>
            <span>No signing</span>
            <p>The agent prepares actions, but the connected wallet must sign them.</p>
          </div>
          <div>
            <span>No bypass</span>
            <p>The agent cannot skip owner inactivity, guardian threshold, or final delay.</p>
          </div>
        </div>
      </section>

      <section id="example" className="doc-section">
        <h2>Example flow</h2>
        <p>A user asks: “Can this capsule be recovered yet?”</p>
        <pre><code>{`Agent reads capsule:
- owner inactivity window has passed
- recovery requested
- approvals: 1 of 2
- final delay has not started

Agent response:
"Not yet. One more guardian approval is needed before the final delay can begin."`}</code></pre>
      </section>
    </DocsLayout>
  );
}
