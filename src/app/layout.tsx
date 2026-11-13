import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/layout/SiteHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "TabiLog | 旅を、ひとつずつ。", template: "%s | TabiLog" },
  description: "旅の予定と、大切な思い出をひとつの場所に。TabiLogは、あなたの旅に寄り添う旅行ノートです。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-10 focus:rounded-lg focus:bg-white focus:p-4">本文へスキップ</a>
        <SiteHeader />
        {children}
        <footer className="page-shell mt-auto pb-7 pt-12">
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6 text-xs text-muted">
            <span className="font-medium tracking-wide">TabiLog</span>
            <p>旅の予定と、大切な思い出をひとつの場所に。</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
