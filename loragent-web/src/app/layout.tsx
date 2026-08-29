import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Loragent — Universal Multi-Agent Ecosystem",
  description: "224 Autonomous Software Engineering Agents, 20 MCP Servers, and 6 Squad Formations on Hub-and-Spoke Architecture.",
  keywords: ["AI Agents", "MCP", "Multi-Agent System", "Autonomous Coding", "Claude Code", "Cursor", "Antigravity", "Windsurf"],
  openGraph: {
    title: "Loragent — Universal Multi-Agent Ecosystem",
    description: "224 Autonomous Software Engineering Agents, 20 MCP Servers, and 6 Squad Formations on Hub-and-Spoke Architecture.",
    type: "website",
    url: "https://loragent.lorapok.tech",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#050508] text-neutral-200 selection:bg-purple-500/30 selection:text-purple-200">
        {children}
      </body>
    </html>
  );
}
