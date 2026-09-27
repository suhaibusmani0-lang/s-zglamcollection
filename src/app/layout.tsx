import type { Metadata } from "next";
import "./globals.css";
import WhatsAppWidget from "@/components/WhatsAppWidget";

export const metadata: Metadata = {
  title: "S&Z GLAM COLLECTION | Royal South Asian Jewelry & Live Giveaways (USA)",
  description: "Premier US boutique for artisanal 22K-24K gold plated Kundan, uncut Polki, American Diamond bridal sets, and daily TikTok live customer giveaways.",
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
      { url: '/logo.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    shortcut: '/icon.png',
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <link rel="icon" href="/icon.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="shortcut icon" href="/icon.png" type="image/png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Google Fonts: Raleway (Headings) and Lato (Body) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700&family=Raleway:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600;1,700&family=Cinzel:wght@600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#faf7f2] text-[#1f1b19]">
        {children}
        <WhatsAppWidget phoneNumber="19296001937" />
      </body>
    </html>
  );
}
