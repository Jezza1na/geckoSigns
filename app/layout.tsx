import type { Metadata, Viewport } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

import Navbar from "./components/header";

export const metadata: Metadata = {
  title: "Milestone BANNERS",
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