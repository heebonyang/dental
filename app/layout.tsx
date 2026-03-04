import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "DentChart Pro — Dental Charting System",
  description: "AI 기반 치과 차팅 시스템",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={inter.className}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
