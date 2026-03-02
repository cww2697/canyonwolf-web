import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
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
    default: "Canyon Wolf | Software Developer & Gaming Enthusiast",
    template: "%s | Canyon Wolf",
  },
  description: "Canyon Wolf — Personal Portfolio. Showcasing modern software projects including Spark Launcher, COD Stats, OOvify, and TerraVista.",
  keywords: ["Canyon Wolf", "Software Developer", "Gaming", "Spark Launcher", "COD Stats", "OOvify", "TerraVista", "Next.js", "React", "Portfolio"],
  authors: [{ name: "Canyon Wolf" }],
  creator: "Canyon Wolf",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.canyonwolf.net",
    siteName: "Canyon Wolf",
    title: "Canyon Wolf | Software Developer",
    description: "Building modern digital experiences where clean code meets interactive worlds.",
    images: [
      {
        url: "/canyon_wolf.PNG",
        width: 800,
        height: 800,
        alt: "Canyon Wolf",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Canyon Wolf | Software Developer",
    description: "Building modern digital experiences where clean code meets interactive worlds.",
    images: ["/canyon_wolf.PNG"],
  },
  metadataBase: new URL("https://www.canyonwolf.net"),
  robots: {
    index: true,
    follow: true,
  },
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
        <div className="relative min-h-screen">
          <main className="mx-auto max-w-5xl px-4 sm:px-6 pt-24 pb-16">
            <div className="glass rounded-3xl overflow-hidden liquid-glass transition-all duration-500">
              {children}
            </div>
          </main>
          
          <footer className="mx-auto max-w-5xl px-4 sm:px-6 pb-8">
             <div className="glass rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm font-medium opacity-70">
                   © {new Date().getFullYear()} Canyon Wolf. All rights reserved.
                </div>
                <div className="flex items-center gap-6">
                   <a href="https://github.com/cww2697/canyonwolf-web" target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                      GitHub
                   </a>
                   <Link href="/sitemap.xml" className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity">Sitemap</Link>
                </div>
             </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
