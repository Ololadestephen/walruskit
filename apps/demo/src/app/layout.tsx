import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Header } from "../components/Header";

export const metadata: Metadata = {
  title: "WalrusKit | Programmable Walrus Recovery",
  description:
    "WalrusKit is infrastructure for programmable recovery of encrypted Walrus blobs on Sui, powered by Tatum RPC.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
