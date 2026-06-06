import { DocsLayout } from "../../../components/DocsLayout";

export default function Quickstart() {
  return (
    <DocsLayout
      active="quickstart"
      breadcrumb="@walruskit / Getting started / Quickstart"
      toc={[
        { href: "#install", label: "Install" },
        { href: "#proof", label: "Run the proof" },
        { href: "#env", label: "Environment" },
      ]}
    >
      <section id="install" className="doc-section intro-section">
        <h1>Quickstart</h1>
        <p className="lead">
          Run WalrusKit locally to prove encrypted Walrus storage, Tatum Sui RPC reads, Move policy
          calls, and the recovery lifecycle.
        </p>
        <div className="command-list">
          <code>npm install</code>
          <code>npm run build</code>
        </div>
      </section>

      <section id="proof" className="doc-section">
        <h2>Run the proof commands</h2>
        <pre><code>{`npm run proof:walrus-tatum
npm run move:build
npm run proof:sui
npm run capsule:demo-recovery`}</code></pre>
        <p>
          The final command creates a short-window capsule, rejects early recovery while the owner
          is active, waits for timeout, requests recovery, records guardian approval, waits final
          delay, and confirms recovery is ready.
        </p>
      </section>

      <section id="env" className="doc-section">
        <h2>Environment</h2>
        <p>WalrusKit expects a Tatum API key and Sui account material for live proof scripts.</p>
        <pre><code>{`TATUM_API_KEY=...
SUI_PACKAGE_ID=...
SUI_PRIVATE_KEY=...`}</code></pre>
      </section>
    </DocsLayout>
  );
}
