import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/sonner";

// Display face — Bricolage Grotesque. Industrial grotesque, used on headings.
const bricolage = localFont({
  src: [
    { path: "./fonts/Bricolage-700.woff2", weight: "700", style: "normal" },
    { path: "./fonts/Bricolage-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-bricolage",
  display: "swap",
});

// Body / UI face — IBM Plex Sans. Readable at small sizes (forms, catalogue).
const plexSans = localFont({
  src: [
    { path: "./fonts/PlexSans-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/PlexSans-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/PlexSans-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-plex-sans",
  display: "swap",
});

// Data face — IBM Plex Mono. For refs matériel, dates, quantités.
const plexMono = localFont({
  src: [{ path: "./fonts/PlexMono-400.woff2", weight: "400", style: "normal" }],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CESI Rush Resa",
  description: "Application de réservation",
  icons: {
    icon: '/square-logo.png'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${bricolage.variable} ${plexSans.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <NextTopLoader showSpinner={false} height={4} color="#f26a1b" />
        <Toaster richColors position="top-right" />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
