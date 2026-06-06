import Link from "next/link";
import { DocsLayout } from "../../components/DocsLayout";

export default function Docs() {
  return (
    <DocsLayout
      active="introduction"
      breadcrumb="@walruskit / Getting started / Introduction"
      toc={[
        { href: "#top", label: "What WalrusKit is" },
        { href: "#kit", label: "What's in the kit" },
        { href: "#live-proof", label: "Live proof" },
      ]}
    >
      <section id="top" className="doc-section intro-section">
        <h1>Introduction</h1>
        <p className="lead">
          WalrusKit is the developer toolkit for programmable recovery of encrypted Walrus blobs
          on Sui. It gives apps a reusable path for local encryption, Walrus storage, Sui recovery
          policy, Tatum RPC reads, CLI proofs, React components, and AI-agent tooling.
        </p>
      </section>

      <section id="kit" className="doc-section">
        <h2>What&apos;s in the kit</h2>
        <p>
          WalrusKit ships as a 19-package workspace. Builders can use the full stack or adopt one
          layer at a time.
        </p>
        <ul className="package-list">
          <li>
            <code>@walruskit/sdk</code> combines encryption, Walrus upload, Sui call plans, and
            capsule reads.
          </li>
          <li>
            <code>@walruskit/walrus</code> stores encrypted bytes and reads them back from Walrus.
          </li>
          <li>
            <code>@walruskit/tatum</code> reads Sui state through Tatum&apos;s Sui RPC endpoints.
          </li>
          <li>
            <code>@walruskit/move</code> contains the capsule policy module for heartbeat,
            guardian approval, and final delay.
          </li>
          <li>
            <code>@walruskit/mcp</code> exposes the recovery flow to AI agents.
          </li>
        </ul>
      </section>

      <section id="live-proof" className="doc-section">
        <h2>Live proof</h2>
        <div className="proof-table">
          <div>
            <span>Sui package</span>
            <strong>0xfeaae2...0c08e1</strong>
          </div>
          <div>
            <span>Live capsule</span>
            <strong>0xe99b68...2bf74a</strong>
          </div>
          <div>
            <span>Demo capsule</span>
            <strong>0x19a947...6c483a</strong>
          </div>
          <div>
            <span>Recovery lifecycle</span>
            <strong>Ready: yes</strong>
          </div>
        </div>
      </section>

      <section className="doc-section">
        <h2>Where to go next</h2>
        <div className="doc-card-grid">
          <Link href="/docs/quickstart">
            <span>Start here</span>
            <strong>Quickstart</strong>
            <p>Run the Walrus, Tatum, Sui, and recovery lifecycle proofs.</p>
          </Link>
          <Link href="/docs/architecture">
            <span>Understand</span>
            <strong>Architecture</strong>
            <p>See how encryption, Walrus, Sui policy, and Tatum RPC fit together.</p>
          </Link>
          <Link href="/docs/walrus-storage">
            <span>Storage</span>
            <strong>Walrus storage</strong>
            <p>Learn what WalrusKit uploads, tracks, and verifies for encrypted blobs.</p>
          </Link>
          <Link href="/docs/sui-policy">
            <span>Policy</span>
            <strong>Sui policy</strong>
            <p>Review heartbeat, beneficiary request, guardian approval, and final delay.</p>
          </Link>
          <Link href="/docs/components">
            <span>Build UI</span>
            <strong>Components</strong>
            <p>Use WalrusKit primitives for vault, proof, and recovery screens.</p>
          </Link>
          <Link href="/docs/examples/recovery-flow">
            <span>Example</span>
            <strong>Recovery flow</strong>
            <p>Follow the complete lifecycle from active owner to recoverable capsule.</p>
          </Link>
        </div>
      </section>
    </DocsLayout>
  );
}
