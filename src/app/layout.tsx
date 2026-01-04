import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AURA_VOICE | Sonic Presence Engine",
  description: "Síntesis neuronal hiper-realista e indistinguible de la voz humana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
