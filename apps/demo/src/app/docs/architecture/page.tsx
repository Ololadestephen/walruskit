import { DocsLayout } from "../../../components/DocsLayout";

export default function ArchitecturePage() {
  return (
    <DocsLayout
      active="architecture"
      breadcrumb="@walruskit / Getting started / Architecture"
      toc={[
        { href: "#flow", label: "System flow" },
        { href: "#packages", label: "Package roles" },
        { href: "#trust", label: "Trust boundaries" },
      ]}
    >
      <section id="flow" className="doc-section intro-section">
        <h1>Architecture</h1>
        <p className="lead">
          WalrusKit splits recovery into four layers: encrypt locally, store encrypted bytes on
          Walrus, anchor recovery rules on Sui, and read state through Tatum RPC.
        </p>
        <div className="flow-grid">
          <article>
            <span>01</span>
            <strong>App runtime</strong>
            <p>Plaintext exists only in the app while encryption or decryption is happening.</p>
          </article>
          <article>
            <span>02</span>
            <strong>Walrus</strong>
            <p>Stores ciphertext blobs. The blob ID, size, and hash are tracked for verification.</p>
          </article>
          <article>
            <span>03</span>
            <strong>Sui Move</strong>
            <p>Stores owner, beneficiary, guardians, threshold, heartbeat timeout, and final delay.</p>
          </article>
          <article>
            <span>04</span>
            <strong>Tatum RPC</strong>
            <p>Reads Sui objects and transactions through Tatum&apos;s Sui endpoints.</p>
          </article>
        </div>
      </section>

      <section id="packages" className="doc-section">
        <h2>Package roles</h2>
        <div className="docs-table">
          <div>
            <span>@walruskit/sdk</span>
            <p>High-level app API for creating capsules and checking recovery state.</p>
          </div>
          <div>
            <span>@walruskit/walrus</span>
            <p>Upload and download encrypted blob bytes from Walrus.</p>
          </div>
          <div>
            <span>@walruskit/sui</span>
            <p>Build wallet-ready Move call plans and parse capsule objects.</p>
          </div>
          <div>
            <span>@walruskit/verifier</span>
            <p>Verify downloaded Walrus bytes against Sui-anchored metadata.</p>
          </div>
        </div>
      </section>

      <section id="trust" className="doc-section">
        <h2>Trust boundaries</h2>
        <div className="callout">
          WalrusKit does not ask apps to trust a centralized recovery server. Walrus holds
          encrypted bytes, Sui holds recovery policy, and the client verifies blob integrity before
          attempting to decrypt.
        </div>
      </section>
    </DocsLayout>
  );
}
