import { DocsLayout } from "../../../../components/DocsLayout";

export default function RecoverProviderPage() {
  return (
    <DocsLayout
      active="recover-provider"
      breadcrumb="@walruskit / Components / RecoverProvider"
      toc={[
        { href: "#usage", label: "Usage" },
        { href: "#props", label: "Props" },
        { href: "#responsibilities", label: "Responsibilities" },
      ]}
    >
      <section id="usage" className="doc-section intro-section">
        <h1>RecoverProvider</h1>
        <p className="lead">
          RecoverProvider configures the client-side WalrusKit context for SDK calls, Tatum RPC,
          Walrus reads, and wallet transaction planning.
        </p>
        <pre><code>{`<RecoverProvider
  network="testnet"
  tatumRpcUrl={tatumRpcUrl}
  walrusPublisherUrl={publisherUrl}
  walrusAggregatorUrl={aggregatorUrl}
>
  <App />
</RecoverProvider>`}</code></pre>
      </section>

      <section id="props" className="doc-section">
        <h2>Props</h2>
        <div className="docs-table">
          <div>
            <span>network</span>
            <p>Selects the Sui network for object reads and transaction planning.</p>
          </div>
          <div>
            <span>tatumRpcUrl</span>
            <p>Routes capsule and package reads through Tatum&apos;s Sui RPC endpoint.</p>
          </div>
          <div>
            <span>walrusPublisherUrl</span>
            <p>Uploads encrypted blob bytes to Walrus.</p>
          </div>
          <div>
            <span>walrusAggregatorUrl</span>
            <p>Reads encrypted blob bytes back for verification before recovery.</p>
          </div>
        </div>
      </section>

      <section id="responsibilities" className="doc-section">
        <h2>Responsibilities</h2>
        <div className="flow-grid">
          <article>
            <span>Config</span>
            <strong>One client context</strong>
            <p>Keep SDK, Walrus, Tatum, and Move package settings consistent across the app.</p>
          </article>
          <article>
            <span>Safety</span>
            <strong>No secret custody</strong>
            <p>Provider configuration never requires plaintext secrets or private keys.</p>
          </article>
        </div>
      </section>
    </DocsLayout>
  );
}
