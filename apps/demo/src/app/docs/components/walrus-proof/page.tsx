import { DocsLayout } from "../../../../components/DocsLayout";

export default function WalrusProofPage() {
  return (
    <DocsLayout
      active="walrus-proof"
      breadcrumb="@walruskit / Components / WalrusProof"
      toc={[
        { href: "#overview", label: "Overview" },
        { href: "#shows", label: "What it shows" },
        { href: "#verification", label: "Verification" },
      ]}
    >
      <section id="overview" className="doc-section intro-section">
        <h1>WalrusProof</h1>
        <p className="lead">
          WalrusProof gives users a readable verification card for encrypted blob storage. It shows
          the blob ID, byte count, and whether downloaded bytes match the Sui-anchored hash.
        </p>
      </section>

      <section id="shows" className="doc-section">
        <h2>What it shows</h2>
        <div className="flow-grid">
          <article>
            <span>Blob</span>
            <strong>Walrus ID</strong>
            <p>The identifier used to fetch the encrypted payload from Walrus.</p>
          </article>
          <article>
            <span>Integrity</span>
            <strong>Hash and size</strong>
            <p>Whether downloaded bytes match the Sui-anchored hash and expected length.</p>
          </article>
        </div>
      </section>

      <section id="verification" className="doc-section">
        <h2>Verification</h2>
        <pre><code>{`const blob = await walrus.readBlob(blobId);
const proof = await verifier.verifyBlob({
  bytes: blob,
  expectedHash,
  expectedSize,
});`}</code></pre>
        <p>
          Verification happens before decryption. If the blob does not match the capsule metadata,
          the UI can block recovery and explain that the stored ciphertext is not trusted.
        </p>
      </section>
    </DocsLayout>
  );
}
