import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import { Inter, DM_Sans, JetBrains_Mono } from "next/font/google";
import { AuthProvider } from "@/components/auth/AuthProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Branex x Go to Marketing",
  description: "Plataforma multi-tenant de dashboards empresariales.",
};

export const dynamic = "force-dynamic";

const rootStyle: CSSProperties = {
  margin: 0,
  minHeight: "100vh",
  background: "#060B18",
  color: "#FFFFFF",
  fontFamily: "var(--font-dm-sans), sans-serif",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${dmSans.variable} ${jetBrainsMono.variable}`} style={rootStyle}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
