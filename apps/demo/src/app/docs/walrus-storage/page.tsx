import { DocsLayout } from "../../../components/DocsLayout";

export default function WalrusStoragePage() {
  return (
    <DocsLayout
      active="walrus-storage"
      breadcrumb="@walruskit / Core Concepts / Walrus storage"
      toc={[
        { href: "#why", label: "Why Walrus" },
        { href: "#metadata", label: "Stored metadata" },
        { href: "#proof", label: "Proof command" },
      ]}
    >
      <section id="why" className="doc-section intro-section">
        <h1>Walrus storage</h1>
        <p className="lead">
          Walrus is where WalrusKit puts encrypted recovery payloads. The app encrypts first, then
          uploads only ciphertext, so the storage layer never receives a readable secret.
        </p>
      </section>

      <section id="metadata" className="doc-section">
        <h2>Stored metadata</h2>
        <p>
          The blob itself lives on Walrus. The Sui capsule stores enough metadata to prove that the
          bytes later downloaded are the bytes originally attached to the recovery policy.
        </p>
        <div className="docs-table">
          <div>
            <span>blobId</span>
            <p>The Walrus identifier used to fetch encrypted bytes.</p>
          </div>
          <div>
            <span>blobHash</span>
            <p>A digest of the encrypted payload, checked before decrypting.</p>
          </div>
          <div>
            <span>blobSize</span>
            <p>The expected byte length, useful for quick integrity checks and UI display.</p>
          </div>
        </div>
      </section>

      <section id="proof" className="doc-section">
        <h2>Proof command</h2>
        <pre><code>{`npm run proof:walrus-tatum`}</code></pre>
        <p>
          This script encrypts data, uploads it to Walrus, reads it back, verifies the bytes, and
          proves the Tatum RPC client can read the related Sui state.
        </p>
      </section>
    </DocsLayout>
  );
}
