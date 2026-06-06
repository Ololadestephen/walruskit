import Link from "next/link";
import { DocsLayout } from "../../../components/DocsLayout";

const components = [
  {
    href: "/docs/components/recover-provider",
    name: "RecoverProvider",
    label: "Provider",
    body: "Configures SDK clients, Tatum RPC, Walrus endpoints, and app-wide recovery defaults.",
  },
  {
    href: "/docs/components/vault-capsule",
    name: "VaultCapsule",
    label: "Display",
    body: "Shows the Sui capsule, Walrus blob metadata, owner, beneficiary, guardians, and policy.",
  },
  {
    href: "/docs/components/walrus-proof",
    name: "WalrusProof",
    label: "Verifier",
    body: "Displays encrypted blob ID, byte size, hash match, and storage verification status.",
  },
  {
    href: "/docs/components/recovery-status",
    name: "RecoveryStatus",
    label: "Status",
    body: "Explains whether a vault is active, waiting on timeout, collecting approvals, or ready.",
  },
  {
    href: "/docs/components/guardian-panel",
    name: "GuardianPanel",
    label: "Action",
    body: "Helps guardians review a recovery request and prepare the wallet-signable approval call.",
  },
];

export default function Components() {
  return (
    <DocsLayout
      active="components"
      breadcrumb="@walruskit / Components / Overview"
      toc={[
        { href: "#overview", label: "Component model" },
        { href: "#layers", label: "Layers" },
        { href: "#list", label: "Component list" },
      ]}
    >
      <section id="overview" className="doc-section intro-section">
        <h1>Components</h1>
        <p className="lead">
          WalrusKit components are product-ready building blocks for encrypted Walrus recovery
          flows. Use them styled, headless, or as references for your own app UI.
        </p>
      </section>

      <section id="layers" className="doc-section">
        <h2>Layers</h2>
        <div className="flow-grid">
          <article>
            <span>Headless</span>
            <strong>State and copy</strong>
            <p>Use WalrusKit logic without inheriting a visual style.</p>
          </article>
          <article>
            <span>Styled</span>
            <strong>Drop-in screens</strong>
            <p>Use polished defaults for demos, internal tools, and faster product builds.</p>
          </article>
        </div>
      </section>

      <section id="list" className="doc-section">
        <h2>Component list</h2>
        <div className="doc-card-grid">
          {components.map((component) => (
            <Link href={component.href} key={component.name}>
              <span>{component.label}</span>
              <strong>{component.name}</strong>
              <p>{component.body}</p>
            </Link>
          ))}
        </div>
      </section>
    </DocsLayout>
  );
}
