import { DocsLayout } from "../../../components/DocsLayout";

export default function CliPage() {
  return (
    <DocsLayout
      active="cli"
      breadcrumb="@walruskit / Tooling / CLI"
      toc={[
        { href: "#purpose", label: "Purpose" },
        { href: "#commands", label: "Commands" },
        { href: "#demo", label: "Demo recovery" },
        { href: "#outputs", label: "Outputs" },
      ]}
    >
      <section id="purpose" className="doc-section intro-section">
        <h1>CLI</h1>
        <p className="lead">
          The WalrusKit CLI gives judges and developers a direct way to verify Walrus, Tatum, Sui,
          and capsule recovery flows without opening a frontend.
        </p>
        <div className="callout">
          The CLI is the fastest way to prove the backend works: it exercises encryption, Walrus
          upload/download, Tatum reads, Move call planning, and recovery lifecycle state.
        </div>
      </section>

      <section id="commands" className="doc-section">
        <h2>Commands</h2>
        <div className="command-list">
          <code>node packages/cli/bin/walruskit.js capsule:create-plan</code>
          <code>node packages/cli/bin/walruskit.js capsule:status</code>
        </div>
      </section>

      <section id="demo" className="doc-section">
        <h2>Demo recovery</h2>
        <pre><code>{`npm run capsule:demo-recovery`}</code></pre>
        <p>
          The demo creates a short-window capsule, proves early recovery is rejected, waits for the
          heartbeat timeout, requests recovery, approves as guardian, waits final delay, and reads
          the final state through Tatum RPC.
        </p>
      </section>

      <section id="outputs" className="doc-section">
        <h2>Outputs</h2>
        <div className="docs-table">
          <div>
            <span>Plans</span>
            <p>Wallet-ready Move call descriptors for create, request, approve, heartbeat, or cancel.</p>
          </div>
          <div>
            <span>Status</span>
            <p>Readable capsule state: owner activity, recovery request, approvals, and blockers.</p>
          </div>
          <div>
            <span>Proof</span>
            <p>Terminal evidence that Walrus, Tatum, Sui policy, and verifier logic work together.</p>
          </div>
        </div>
      </section>
    </DocsLayout>
  );
}
