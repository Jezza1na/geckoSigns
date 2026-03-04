import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

import Navbar from "./components/header";

export const metadata: Metadata = {
  title: "Milestone BANNERS",
  viewport: "width=device-width, initial-scale=1",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`:root{--header:100px;}`}</style>
      </head>

      <body>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">{children}</main>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;