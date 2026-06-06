import { DocsLayout } from "../../../components/DocsLayout";

export default function McpPage() {
  return (
    <DocsLayout
      active="mcp"
      breadcrumb="@walruskit / Tooling / MCP server"
      toc={[
        { href: "#server", label: "Server" },
        { href: "#tools", label: "Tools" },
        { href: "#use-cases", label: "Use cases" },
        { href: "#run", label: "Run locally" },
      ]}
    >
      <section id="server" className="doc-section intro-section">
        <h1>MCP server</h1>
        <p className="lead">
          The MCP package exposes WalrusKit operations to AI coding agents and assistants: inspect
          capsules, verify Walrus blobs, and prepare Sui transaction plans.
        </p>
        <div className="callout">
          MCP is the bridge between WalrusKit and AI developer tools. It gives an agent structured
          recovery tools instead of asking it to scrape terminal output or guess transaction calls.
        </div>
      </section>

      <section id="tools" className="doc-section">
        <h2>Tools</h2>
        <div className="docs-table">
          <div>
            <span>walruskit_encrypt_and_store</span>
            <p>Encrypt a payload locally and store the ciphertext through the Walrus adapter.</p>
          </div>
          <div>
            <span>walruskit_recovery_status</span>
            <p>Read capsule state and return a plain recovery-readiness summary.</p>
          </div>
          <div>
            <span>walruskit_create_move_call</span>
            <p>Prepare wallet-signable Sui Move calls for owner, beneficiary, or guardian actions.</p>
          </div>
        </div>
      </section>

      <section id="use-cases" className="doc-section">
        <h2>Use cases</h2>
        <div className="flow-grid">
          <article>
            <span>Developer</span>
            <strong>Debug a capsule</strong>
            <p>Ask an agent why recovery is blocked and get the exact policy condition that failed.</p>
          </article>
          <article>
            <span>Support</span>
            <strong>Explain next steps</strong>
            <p>Convert raw Sui object state into user-facing guidance for a beneficiary or guardian.</p>
          </article>
          <article>
            <span>Automation</span>
            <strong>Prepare actions</strong>
            <p>Create safe transaction descriptors that still require wallet confirmation.</p>
          </article>
          <article>
            <span>Verification</span>
            <strong>Check Walrus bytes</strong>
            <p>Confirm downloaded encrypted data matches the Sui-anchored blob hash and size.</p>
          </article>
        </div>
      </section>

      <section id="run" className="doc-section">
        <h2>Run locally</h2>
        <pre><code>{`node packages/mcp/bin/walruskit-mcp.js`}</code></pre>
      </section>
    </DocsLayout>
  );
}
