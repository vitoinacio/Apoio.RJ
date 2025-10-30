import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const InterFont = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mapa Apoio RJ",
  description:
    "Tenha acesso a localidades de apoio no iestado do Rio de janeiro, seja sobre saúde, educação, segurança etc.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${InterFont.className} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
