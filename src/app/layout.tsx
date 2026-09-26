import type { Metadata } from "next";
import "./globals.css";
import WhatsAppWidget from "@/components/WhatsAppWidget";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://szglamcollection.com"),
  title: {
    default: "S&Z Glam Collection | Handcrafted South Asian & Bridal Jewelry USA | Sumera Usmani",
    template: "%s | S&Z Glam Collection"
  },
  description:
    "Curated by Sumera Usmani. Premier US boutique for handcrafted South Asian bridal jewelry, 24K gold-dipped Kundan chokers, uncut Polki sets, Basra pearls, and American Diamond suites. Daily TikTok live drops & fast 2-3 day USPS Priority shipping nationwide.",
  keywords: [
    "Sumera Usmani",
    "S&Z Glam Collection",
    "South Asian bridal jewelry USA",
    "Kundan choker sets USA",
    "Polki bridal necklace",
    "Indian jewelry online USA",
    "Pakistani bridal jewelry New York",
    "American Diamond jewelry",
    "TikTok live jewelry giveaway",
    "Basra pearl haar",
    "bridal jhumkas maang tikka",
    "handcrafted gold dipped jewelry",
    "USPS Priority jewelry delivery"
  ],
  authors: [{ name: "Sumera Usmani", url: "https://szglamcollection.com" }],
  creator: "Sumera Usmani",
  publisher: "S&Z Glam Collection LLC",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "S&Z Glam Collection | Royal South Asian Bridal Jewelry • Curated by Sumera Usmani",
    description:
      "Artisanal Kundan, Polki & American Diamond bridal jewelry. Join daily TikTok Live drops with fast 2-3 day USPS Priority delivery across the United States.",
    url: "https://szglamcollection.com",
    siteName: "S&Z Glam Collection",
    images: [
      {
        url: "/logo.jpg",
        width: 800,
        height: 800,
        alt: "S&Z Glam Collection - Curated by Sumera Usmani"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "S&Z Glam Collection | Luxury South Asian Jewelry USA",
    description:
      "Curated by Sumera Usmani. 24K gold dipped Kundan chokers, uncut Polki, and daily live giveaways.",
    images: ["/logo.jpg"],
    creator: "@snzglam"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  other: {
    "geo.region": "US-NY",
    "geo.placename": "New York, United States",
    "geo.position": "40.7128;-74.0060",
    "ICBM": "40.7128, -74.0060"
  }
};

const jsonLdGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["JewelryStore", "LocalBusiness", "OnlineStore"],
      "@id": "https://szglamcollection.com/#store",
      "name": "S&Z Glam Collection",
      "alternateName": "S&Z Glam",
      "description":
        "Premier US boutique curated by Sumera Usmani for handcrafted South Asian bridal jewelry, royal Kundan chokers, uncut Polki sets, Basra pearls, and American Diamond collections.",
      "url": "https://szglamcollection.com",
      "logo": "https://szglamcollection.com/logo.jpg",
      "image": "https://szglamcollection.com/logo.jpg",
      "telephone": "+1-929-600-1937",
      "email": "orders@szglamcollection.com",
      "priceRange": "$$",
      "currenciesAccepted": "USD",
      "paymentAccepted": "Zelle, Venmo, Cash App, PayPal, Apple Pay",
      "founder": {
        "@type": "Person",
        "name": "Sumera Usmani",
        "jobTitle": "Founder & Creative Director",
        "description": "Founder and head curator of S&Z Glam Collection, curating high-end South Asian haute joaillerie in the USA."
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "New York",
        "addressRegion": "NY",
        "postalCode": "10001",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 40.7128,
        "longitude": -74.0060
      },
      "areaServed": {
        "@type": "Country",
        "name": "United States"
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "09:00",
        "closes": "23:00"
      },
      "sameAs": [
        "https://www.instagram.com/snzglam/",
        "https://www.tiktok.com/@snzglam",
        "https://wa.me/19296001937"
      ]
    },
    {
      "@type": "BroadcastEvent",
      "@id": "https://szglamcollection.com/#live-broadcast",
      "name": "S&Z Glam TikTok Live Jewelry Drop & Giveaway",
      "description": "Daily interactive live jewelry drop with a 30-minute verifiable payment window and provably fair customer giveaway.",
      "isLiveBroadcast": true,
      "videoFormat": "HD",
      "organizer": {
        "@id": "https://szglamcollection.com/#store"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://szglamcollection.com/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Who is the founder of S&Z Glam Collection?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "S&Z Glam Collection was founded by Sumera Usmani, who curates and designs handcrafted South Asian bridal jewelry, royal Kundan chokers, and uncut Polki pieces for clients across the United States."
          }
        },
        {
          "@type": "Question",
          "name": "How do the TikTok Live jewelry giveaways work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "During each live show on TikTok (@snzglam), a 30-minute payment countdown timer is activated. Customers who claim pieces make their payment and submit the verification form at szglamcollection.com/live to receive an official Lucky Ticket number (#SZ-XXXX). A winner is drawn live using a cryptographically provably fair random selector."
          }
        },
        {
          "@type": "Question",
          "name": "What payment methods are accepted in the USA?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "S&Z Glam Collection accepts official verified US payment options: Zelle (929-600-1937), Venmo (@snzglam), Cash App ($SZGlamLive), and PayPal (paypal.me/snzglam)."
          }
        },
        {
          "@type": "Question",
          "name": "How fast is delivery within the United States?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "All orders are securely packaged and dispatched via USPS 2-3 Day Priority Mail insured delivery with full tracking to all 50 US states."
          }
        },
        {
          "@type": "Question",
          "name": "Is the jewelry handcrafted and authentic?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, every bridal choker, haar, and earring set is handcrafted using 22K-24K gold dipped copper brass alloy, genuine uncut polki kundan stones, and cultured Basra pearls. All pieces are nickel-free and hypoallergenic."
          }
        }
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Google Fonts: Raleway (Headings) and Lato (Body) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700&family=Raleway:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600;1,700&family=Cinzel:wght@600;700;800;900&display=swap"
          rel="stylesheet"
        />
        {/* Rich Structured Data (JSON-LD) for SEO, GEO, and AIO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#fcfbf9] text-[#1f1b19]">
        {children}
        <WhatsAppWidget phoneNumber="19296001937" />
      </body>
    </html>
  );
}
