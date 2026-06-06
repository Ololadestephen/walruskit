import { NetworkCanvas } from "../components/NetworkCanvas";

export default function Home() {
  return (
    <main className="landing-page">
      <NetworkCanvas />
      <section className="hero" id="home">
        <div>
          <p className="eyebrow">WalrusKit</p>
          <h1>
            <span>Programmable recovery</span>
            <em>for encrypted Walrus data.</em>
          </h1>
          <p className="hero-lede">
            The complete developer toolkit for trustless storage, on-chain recovery rules, and AI-agent integrations on Sui.
          </p>
          <div className="hero-tags" aria-label="WalrusKit capabilities">
            <span>Walrus blobs</span>
            <span>Sui policies</span>
            <span>Tatum RPC</span>
            <span>AI agents</span>
          </div>
          <div className="hero-actions">
            <a className="primary-cta" href="/docs/quickstart">
              Get started
            </a>
            <a className="secondary-cta" href="/docs/components">
              View the kit
            </a>
          </div>
        </div>
      </section>

      <section className="proof-strip landing-proof" aria-label="WalrusKit proof points">
        <article>
          <span>Packages</span>
          <strong>19</strong>
        </article>
        <article>
          <span>Storage</span>
          <strong>Walrus</strong>
        </article>
        <article>
          <span>Policy</span>
          <strong>Sui Move</strong>
        </article>
        <article>
          <span>RPC</span>
          <strong>Tatum</strong>
        </article>
      </section>

      <section className="simple-section" aria-label="WalrusKit summary">
        <article>
          <p className="eyebrow">The Challenge</p>
          <h2>Encrypted storage is easy. Recovery is the hard part.</h2>
          <p>
            Teams wire encryption, Walrus upload, Sui policy state, recovery status, and wallet
            transactions from scratch every time.
          </p>
        </article>
        <article>
          <p className="eyebrow">The Solution</p>
          <h2>WalrusKit turns the flow into reusable infrastructure.</h2>
          <p>
            Apps can store encrypted blobs on Walrus, anchor recovery rules on Sui, inspect state
            through Tatum RPC, and expose the flow to users or agents.
          </p>
        </article>
      </section>

      <section className="docs-section" aria-label="How WalrusKit works">
        <div className="section-copy">
          <p className="eyebrow">How it works</p>
          <h2>Encrypt, store, anchor, recover.</h2>
          <p>
            WalrusKit keeps plaintext out of storage, puts encrypted bytes on Walrus, and lets Sui
            decide when recovery is allowed.
          </p>
        </div>
        <div className="docs-list">
          <article>
            <span>01</span>
            <h3>Encrypt locally</h3>
            <p>Notes, files, credentials, or agent memory are encrypted before leaving the app.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Store on Walrus</h3>
            <p>Only ciphertext is uploaded, with hash and size metadata available for verification.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Anchor on Sui</h3>
            <p>A Move capsule stores owner, beneficiary, guardians, heartbeat, and final delay.</p>
          </article>
          <article>
            <span>04</span>
            <h3>Recover by policy</h3>
            <p>Recovery opens only after inactivity, request, guardian approvals, and delay.</p>
          </article>
        </div>
      </section>

      <section className="package-grid" aria-label="WalrusKit package surface">
        <div className="section-heading">
          <p className="eyebrow">Package surface</p>
          <h2>Use the layer you need.</h2>
        </div>
        <article>
          <span>SDK</span>
          <h3>Application API</h3>
          <p>Encryption, Walrus upload, capsule plans, and recovery status in one app-facing layer.</p>
        </article>
        <article>
          <span>Move</span>
          <h3>Sui policy</h3>
          <p>Heartbeat timeout, beneficiary request, guardian approval, cancellation, and final delay.</p>
        </article>
        <article>
          <span>Tatum</span>
          <h3>Sui RPC</h3>
          <p>Read packages, capsules, transactions, and dry-run data through Tatum endpoints.</p>
        </article>
        <article>
          <span>MCP</span>
          <h3>Agent tools</h3>
          <p>Expose recovery status and wallet-call plans to AI agents without exposing plaintext.</p>
        </article>
      </section>

      <section className="terminal-section" aria-label="Proof commands">
        <div className="section-copy">
          <p className="eyebrow">Live proof</p>
          <h2>Built to be verified from the terminal.</h2>
          <p>
            The demo scripts prove Walrus upload and download, Tatum RPC reads, Sui Move policy,
            and the full recovery lifecycle.
          </p>
        </div>
        <div className="terminal-window">
          <div className="terminal-header">
            <span className="terminal-dot close"></span>
            <span className="terminal-dot minimize"></span>
            <span className="terminal-dot maximize"></span>
          </div>
          <pre><code>{`npm run proof:walrus-tatum
npm run move:build
npm run proof:sui
npm run capsule:demo-recovery

Recovery lifecycle:
owner active -> request rejected
timeout passes -> beneficiary requests
guardian approves -> final delay
ready: yes`}</code></pre>
        </div>
      </section>

    </main>
  );
}
