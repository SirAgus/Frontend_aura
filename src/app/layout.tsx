import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AURA_VOICE | Síntesis Neuronal Hiper-Realista",
    template: "%s | AURA_VOICE"
  },
  description: "Síntesis neuronal hiper-realista. Voz indistinguible de la humana. Tecnología de vanguardia para conversacionales infinitas. Generación de audio pixel a pixel.",
  keywords: [
    "síntesis de voz",
    "voz neuronal",
    "inteligencia artificial",
    "audio hiper-realista",
    "generación de voz",
    "voz sintética",
    "AURA VOICE",
    "tecnología de voz",
    "voz humana artificial",
    "síntesis de audio"
  ],
  authors: [{ name: "Aura Intelligence" }],
  creator: "Aura Intelligence",
  publisher: "Aura Intelligence",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://aura-voice.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "AURA_VOICE | Sonic Presence Engine",
    description: "Síntesis neuronal hiper-realista. No distinguible de la voz humana. Diseñada para conversaciones infinitas.",
    url: "https://aura-voice.com",
    siteName: "AURA_VOICE",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "AURA_VOICE - Síntesis Neuronal Hiper-Realista",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AURA_VOICE | Sonic Presence Engine",
    description: "Síntesis neuronal hiper-realista. No distinguible de la voz humana.",
    images: ["/logo.png"],
    creator: "@auraintelligence",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/logo.png", sizes: "64x64", type: "image/png" },
      { url: "/logo.png", sizes: "128x128", type: "image/png" },
      { url: "/logo.png", sizes: "256x256", type: "image/png" },
      { url: "/logo.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: [
      { url: "/logo.png", sizes: "256x256", type: "image/png" },
    ],
    apple: [
      { url: "/logo.png", sizes: "256x256", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="msapplication-TileColor" content="#000000" />
        <link rel="canonical" href="https://aura-voice.com" />
        <link rel="icon" type="image/png" sizes="64x64" href="/logo.png" />
        <link rel="icon" type="image/png" sizes="128x128" href="/logo.png" />
        <link rel="icon" type="image/png" sizes="256x256" href="/logo.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/logo.png" />
        <link rel="shortcut icon" type="image/png" sizes="256x256" href="/logo.png" />
        <link rel="apple-touch-icon" type="image/png" sizes="256x256" href="/logo.png" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
