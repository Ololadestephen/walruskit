import { DocsLayout } from "../../../components/DocsLayout";

export default function SdkPage() {
  return (
    <DocsLayout
      active="sdk"
      breadcrumb="@walruskit / Core Concepts / SDK"
      toc={[
        { href: "#client", label: "Client" },
        { href: "#create", label: "Create capsule" },
        { href: "#status", label: "Read status" },
      ]}
    >
      <section id="client" className="doc-section intro-section">
        <h1>SDK</h1>
        <p className="lead">
          The SDK is the high-level layer. It connects crypto helpers, Walrus storage, Sui call
          planning, verifier checks, and Tatum reads behind a single app-facing interface.
        </p>
        <pre><code>{`const walruskit = createWalrusKit({
  network: "testnet",
  tatumApiKey,
  walrusPublisherUrl,
  walrusAggregatorUrl,
});`}</code></pre>
      </section>

      <section id="create" className="doc-section">
        <h2>Create capsule</h2>
        <pre><code>{`const encrypted = await walruskit.encryptText(secret);
const blob = await walruskit.uploadEncryptedBlob(encrypted);
const plan = walruskit.createCapsulePlan({
  owner,
  beneficiary,
  guardians,
  threshold: 2,
  heartbeatTimeoutMs,
  finalDelayMs,
  blob,
});`}</code></pre>
      </section>

      <section id="status" className="doc-section">
        <h2>Read status</h2>
        <p>
          Apps can read a capsule and show whether it is protected, waiting on owner inactivity,
          waiting on guardians, inside final delay, or ready for recovery.
        </p>
      </section>
    </DocsLayout>
  );
}
