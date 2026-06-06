"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const isDocs = pathname.startsWith("/docs");

  return (
    <header className="site-header" aria-label="Primary navigation">
      <Link href="/" className="brand" aria-label="WalrusKit home">
        <span className="brand-mark" aria-hidden="true" style={{ background: 'transparent' }}>
          <Image src="/logo.png" alt="WalrusKit Logo" width={34} height={34} style={{ borderRadius: '8px' }} priority />
        </span>
        <span className="status-dot" aria-hidden="true"></span>
      </Link>

      {isDocs ? (
        <nav className="nav-links" aria-label="Docs pages">
          <Link href="/docs">Docs</Link>
          <Link href="/docs/quickstart">Quickstart</Link>
          <Link href="/docs/components">Components</Link>
          <Link href="/docs/agents">Agent Kit</Link>
          <Link href="/docs/mcp">MCP</Link>
        </nav>
      ) : (
        <span aria-hidden="true"></span>
      )}

      <div className="header-actions">
        <Link href="/docs/quickstart" className="solid-button">
          Get started
        </Link>
      </div>
    </header>
  );
}
