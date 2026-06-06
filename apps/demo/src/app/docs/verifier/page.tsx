import { DocsLayout } from "../../../components/DocsLayout";

export default function VerifierPage() {
  return (
    <DocsLayout
      active="verifier"
      breadcrumb="@walruskit / Core Concepts / Verifier"
      toc={[
        { href: "#why", label: "Why verify" },
        { href: "#checks", label: "Checks" },
        { href: "#usage", label: "Usage" },
      ]}
    >
      <section id="why" className="doc-section intro-section">
        <h1>Verifier</h1>
        <p className="lead">
          The verifier confirms that the encrypted bytes fetched from Walrus match the metadata
          anchored in the Sui capsule before an app tries to decrypt them.
        </p>
      </section>

      <section id="checks" className="doc-section">
        <h2>Checks</h2>
        <div className="flow-grid">
          <article>
            <span>Size</span>
            <strong>Byte length</strong>
            <p>Confirms the downloaded payload size matches the capsule metadata.</p>
          </article>
          <article>
            <span>Hash</span>
            <strong>Digest match</strong>
            <p>Confirms the encrypted payload was not swapped or corrupted.</p>
          </article>
        </div>
      </section>

      <section id="usage" className="doc-section">
        <h2>Usage</h2>
        <pre><code>{`const proof = await verifyWalrusBlob({
  bytes,
  expectedHash: capsule.blobHash,
  expectedSize: capsule.blobSize,
});`}</code></pre>
      </section>
    </DocsLayout>
  );
}
