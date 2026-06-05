import type { Metadata } from "next";
import { Black_Ops_One, Bebas_Neue, Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";

const blackOpsOne = Black_Ops_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-black-ops-one",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
});

const barlow = Barlow({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-barlow",
});

const barlowCondensed = Barlow_Condensed({
  weight: ["700", "800"],
  subsets: ["latin"],
  variable: "--font-barlow-condensed",
});

export const metadata: Metadata = {
  title: "Phaneroo Port Harcourt — Register",
  description: "Secure your seat for Manifestation & Glory",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${blackOpsOne.variable} ${bebasNeue.variable} ${barlow.variable} ${barlowCondensed.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          h1, .submit-btn, .success-inner h2, .theme-label, .success-inner .sub-heading, .eyebrow, .divider span, .field-group label, .toggle-btn, .detail-card .card-title, .detail-row .label, .step-box .step-title, .share-btn, .countdown-label, .countdown-unit { font-family: var(--font-bebas-neue), cursive; }
          h1 { font-weight: 400; }
        `}} />
      </head>
      <body
        style={{
          fontFamily: "var(--font-barlow), sans-serif",
          margin: 0,
          padding: 0,
        }}
      >
        {children}
      </body>
    </html>
  );
}
