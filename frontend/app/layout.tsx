import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-bebas", display: "swap" });

export const metadata: Metadata = {
  title: "Preder — Predict Together",
  description: "Community prediction markets for the World Cup, powered by TxLINE on Solana.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${bebas.variable}`}>
      <body className="font-sans bg-background text-foreground min-h-screen">
        <SiteHeader />
        <main className="mx-auto w-full max-w-container px-4 md:px-8 pb-24">{children}</main>
        <footer className="border-t border-border mt-16">
          <div className="mx-auto max-w-container px-4 md:px-8 py-8 text-sm text-foreground/50 flex flex-wrap gap-2 justify-between">
            <span>Preder · devnet · powered by TxLINE</span>
            <span>Not affiliated with FIFA or any tournament organiser.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
