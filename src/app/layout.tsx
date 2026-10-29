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
  title: "HAIR LAB. — Ancient Luxury, Handcrafted",
  description:
    "Handcrafted botanical hair care rooted in ancient Indian rituals. Cold-pressed oils, slow infusions, intentional formulas.",
  keywords: [
    "HAIR LAB.",
    "handcrafted hair oil",
    "Ayurvedic hair care",
    "bhringraj oil",
    "botanical hair oil",
    "Indian hair care ritual",
  ],
  authors: [{ name: "HAIR LAB." }],
  openGraph: {
    title: "HAIR LAB. — Ancient Luxury, Handcrafted",
    description:
      "Handcrafted botanical hair care rooted in ancient Indian rituals.",
    siteName: "HAIR LAB.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HAIR LAB. — Ancient Luxury, Handcrafted",
    description:
      "Handcrafted botanical hair care rooted in ancient Indian rituals.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
