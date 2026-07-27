import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";

import { SiteFooter } from "@/src/shared/presentation/SiteFooter";
import { SiteHeader } from "@/src/shared/presentation/SiteHeader";

import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "よこはま支援さがし",
    template: "%s | よこはま支援さがし",
  },
  description:
    "横浜市内の子ども・家庭向け支援情報を、3問から探して比較できるOSSプロジェクトです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="ja"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a className="skip-link" href="#main-content">本文へ移動</a>
        <SiteHeader />
        <Providers>
          <main id="main-content" className="flex flex-1 flex-col">{children}</main>
        </Providers>
        <SiteFooter />
      </body>
    </html>
  );
}
