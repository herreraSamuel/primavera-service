import { Geist, Geist_Mono } from "next/font/google";
import Providers from "./providers";
import AppShell from "@/components/shared/AppShell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 antialiased font-sans print:h-auto print:overflow-visible print:bg-white print:block">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}