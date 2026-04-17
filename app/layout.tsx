import type { Metadata, Viewport } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

import Navbar from "./components/header";

export const metadata: Metadata = {
  metadataBase: new URL("https://geckosigns.com.au"),
  title: "Milestone Banners | Gecko Signs",
  description:
    "Custom milestone banners for clubs, photographic and cartoon designs. Built for game day with durable materials and vibrant print quality.",
  keywords: [
    "milestone banners",
    "sports banners",
    "club banners",
    "photographic banners",
    "cartoon banners",
    "gecko signs",
  ],
  openGraph: {
    title: "Milestone Banners | Gecko Signs",
    description:
      "Order custom milestone banners with club, photographic or cartoon designs.",
    type: "website",
    url: "https://geckosigns.com.au",
    siteName: "Gecko Signs",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`:root{--header:100px;}`}</style>
      </head>

      <body style={{ margin: 0 }}>
  <Navbar />
  {children}
</body>
    </html>
  );
};

export default RootLayout;