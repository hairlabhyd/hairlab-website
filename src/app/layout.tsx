import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { IntroAnimation } from "@/components/intro-animation";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hairlab.one"),
  title: {
    default: "HAIR LAB. — Ancient Luxury, Handcrafted",
    template: "%s · HAIR LAB.",
  },
  description:
    "Handcrafted, plant-derived hair care rooted in Indian ritual. Cold-pressed botanicals, slow infusions, intentional formulas. Shop Mane, Neelam, Ojas & Kāru. Free shipping above ₹799. COD available pan-India.",
  keywords: [
    "HAIR LAB.",
    "hair oil",
    "handcrafted hair oil",
    "bhringraj oil",
    "botanical hair oil",
    "Indian hair care ritual",
    "hair care India",
    "natural hair oil",
    "Ayurvedic hair oil",
    "hair porosity",
    "bhringraj hair oil",
    "amla hair oil",
    "hibiscus hair oil",
    "neem wood comb",
    "hair mask powder",
    "buy hair oil online India",
    "Hyderabad hair care",
    "cruelty-free hair care",
    "plant-derived hair care",
  ],
  authors: [{ name: "Sruwa Kesiraju", url: "https://hairlab.one" }],
  creator: "Sruwa Kesiraju",
  publisher: "HAIR LAB.",
  openGraph: {
    title: "HAIR LAB. — Ancient Luxury, Handcrafted",
    description:
      "Handcrafted, plant-derived hair care rooted in Indian ritual. Cold-pressed botanicals, slow infusions, intentional formulas.",
    url: "https://hairlab.one",
    siteName: "HAIR LAB.",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "https://hairlab.one/hairlab-logo-green.png",
        width: 1200,
        height: 400,
        alt: "HAIR LAB. — Ancient Luxury, Handcrafted",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HAIR LAB. — Ancient Luxury, Handcrafted",
    description:
      "Handcrafted, plant-derived hair care rooted in Indian ritual. Cold-pressed botanicals, slow infusions, intentional formulas.",
    images: ["https://hairlab.one/hairlab-logo-green.png"],
  },
  alternates: {
    canonical: "https://hairlab.one",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "HAIR LAB.",
  alternateName: "Hair Lab",
  url: "https://hairlab.one",
  logo: "https://hairlab.one/hairlab-logo-green.png",
  description:
    "Handcrafted, plant-derived hair care rooted in Indian ritual.",
  founder: {
    "@type": "Person",
    name: "Sruwa Kesiraju",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Hyderabad",
    addressRegion: "Telangana",
    postalCode: "500029",
    addressCountry: "IN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-9502194263",
    email: "hairlabhyd@gmail.com",
    contactType: "customer service",
    availableLanguage: ["en", "hi", "te"],
  },
  sameAs: [
    "https://www.instagram.com/yourhairourlab/",
    "https://yourhairourlab.substack.com/",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body
        className={`${playfair.variable} ${inter.variable} antialiased bg-[#F4ECD8] text-[#2C2416]`}
      >
        <IntroAnimation />
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#2C2416",
              color: "#F4ECD8",
              border: "1px solid rgba(244, 236, 216, 0.1)",
              fontFamily: "var(--font-inter)",
            },
          }}
        />
      </body>
    </html>
  );
}
