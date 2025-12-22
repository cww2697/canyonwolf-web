import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopNav from "../components/TopNav";

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
    default: "Canyon Wolf",
    template: "%s | Canyon Wolf",
  },
  description: "Canyon Wolf — Personal Site & Projects. Showcasing projects, experiments, and write‑ups including COD Stats, OOvify, and more.",
  metadataBase: new URL("https://www.canyonwolf.net"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TopNav />
        <div className="relative min-h-screen pb-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-16">
            <div className="rounded-2xl bg-white dark:bg-gray-900 ring-1 ring-black/5 dark:ring-white/10 shadow-sm backdrop-blur-0">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
