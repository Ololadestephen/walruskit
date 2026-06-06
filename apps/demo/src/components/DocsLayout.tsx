import Link from "next/link";
import type { ReactNode } from "react";

type TocItem = {
  href: string;
  label: string;
};

type DocsLayoutProps = {
  active: string;
  breadcrumb: string;
  children: ReactNode;
  toc?: TocItem[];
};

const navGroups = [
  {
    title: "Getting Started",
    items: [
      { href: "/docs", label: "Introduction", id: "introduction" },
      { href: "/docs/quickstart", label: "Quickstart", id: "quickstart" },
      { href: "/docs/architecture", label: "Architecture", id: "architecture" },
    ],
  },
  {
    title: "Core Concepts",
    items: [
      { href: "/docs/walrus-storage", label: "Walrus storage", id: "walrus-storage" },
      { href: "/docs/sui-policy", label: "Sui policy", id: "sui-policy" },
      { href: "/docs/tatum-rpc", label: "Tatum RPC", id: "tatum-rpc" },
      { href: "/docs/sdk", label: "SDK", id: "sdk" },
      { href: "/docs/verifier", label: "Verifier", id: "verifier" },
    ],
  },
  {
    title: "Components",
    items: [
      { href: "/docs/components", label: "Overview", id: "components" },
      {
        href: "/docs/components/recover-provider",
        label: "RecoverProvider",
        id: "recover-provider",
      },
      { href: "/docs/components/vault-capsule", label: "VaultCapsule", id: "vault-capsule" },
      { href: "/docs/components/walrus-proof", label: "WalrusProof", id: "walrus-proof" },
      {
        href: "/docs/components/recovery-status",
        label: "RecoveryStatus",
        id: "recovery-status",
      },
      { href: "/docs/components/guardian-panel", label: "GuardianPanel", id: "guardian-panel" },
    ],
  },
  {
    title: "Tooling",
    items: [
      { href: "/docs/cli", label: "CLI", id: "cli" },
      { href: "/docs/agents", label: "Agent Kit", id: "agents" },
      { href: "/docs/mcp", label: "MCP server", id: "mcp" },
      { href: "/docs/examples/recovery-flow", label: "Recovery flow", id: "recovery-flow" },
    ],
  },
];

export function DocsLayout({ active, breadcrumb, children, toc = [] }: DocsLayoutProps) {
  return (
    <main className="docs-shell">
      <aside className="docs-sidebar" aria-label="Documentation navigation">
        {navGroups.map((group) => (
          <div className="sidebar-group" key={group.title}>
            <p>{group.title}</p>
            {group.items.map((item) => (
              <Link className={active === item.id ? "active" : undefined} href={item.href} key={item.id}>
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </aside>

      <article className="docs-article">
        <p className="breadcrumb">{breadcrumb}</p>
        {children}
      </article>

      <aside className="toc" aria-label="On this page">
        <p>On this page</p>
        {toc.length > 0 ? (
          toc.map((item) => (
            <a href={item.href} key={item.href}>
              {item.label}
            </a>
          ))
        ) : (
          <a href="#top">Overview</a>
        )}
      </aside>
    </main>
  );
}
