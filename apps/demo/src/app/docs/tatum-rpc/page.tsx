import { DocsLayout } from "../../../components/DocsLayout";

export default function TatumRpcPage() {
  return (
    <DocsLayout
      active="tatum-rpc"
      breadcrumb="@walruskit / Core Concepts / Tatum RPC"
      toc={[
        { href: "#role", label: "Role in WalrusKit" },
        { href: "#reads", label: "What it reads" },
        { href: "#config", label: "Configuration" },
      ]}
    >
      <section id="role" className="doc-section intro-section">
        <h1>Tatum RPC</h1>
        <p className="lead">
          WalrusKit uses Tatum&apos;s Sui RPC endpoints to read on-chain capsule state, transaction
          results, object fields, and package data.
        </p>
      </section>

      <section id="reads" className="doc-section">
        <h2>What it reads</h2>
        <div className="docs-table">
          <div>
            <span>Capsules</span>
            <p>Owner, beneficiary, guardians, threshold, heartbeat, and recovery state.</p>
          </div>
          <div>
            <span>Transactions</span>
            <p>Digest status for create, heartbeat, request, approval, and cancel flows.</p>
          </div>
          <div>
            <span>Package data</span>
            <p>Published Move package IDs and object type information for app verification.</p>
          </div>
        </div>
      </section>

      <section id="config" className="doc-section">
        <h2>Configuration</h2>
        <pre><code>{`TATUM_API_KEY=...
SUI_RPC_URL=https://sui-testnet.gateway.tatum.io`}</code></pre>
      </section>
    </DocsLayout>
  );
}
