import { Geist, Geist_Mono } from "next/font/google";
import Providers from "./providers";
import Sidebar from "@/components/shared/Sidebar";
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
      <body className="flex min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
        <Providers>
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}