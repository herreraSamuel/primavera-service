import { Geist, Geist_Mono } from "next/font/google";
import Providers from "./providers";
import Sidebar from "@/components/shared/Sidebar";
import Topbar from "@/components/shared/Topbar";
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
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 print:block print:w-full">
            <Topbar />
            <main className="flex-1 overflow-y-auto p-8 print:p-0 print:overflow-visible print:h-auto print:block print:w-full">
              {children}
            </main>
          </div>

        </Providers>
      </body>
    </html>
  );
}