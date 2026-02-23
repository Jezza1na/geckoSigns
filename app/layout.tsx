import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

import Navbar from "./header";


export const metadata: Metadata = {
  title: "GeckoSigns",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const currentDate = new Date().toLocaleDateString();
  const currentYear = new Date().getFullYear();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`:root{--header:100px;}`}</style> 
        <style>{`
          html, body {
            background-color: var(--bodyBackground, #0B0B0B);
            color: var(--textColour, #212529);
          }
          * { border-color: var(--bodyBackgroundBorder, #0B0B0B); }
          a { color: var(--linkColour, #0d6efd); }
        `}</style>

        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
              var saved=localStorage.getItem('dark_mode');
              if(saved==='true'){
                var root=document.documentElement;
                root.style.setProperty('--dropDown','#1b1b1b');
                root.style.setProperty('--dropDownBorder','#2a2a2a');

                root.style.setProperty('--bodyBackground','#222222');
                root.style.setProperty('--textColour','#f8f9fa');
                root.style.setProperty('--bodyBackgroundBorder','#2a2a2a');
                root.style.setProperty('--linkColour','#6ab0ff');

                root.style.setProperty('--headerBackground','#111');
                root.style.setProperty('--rows','#000');
                root.style.setProperty('--tabColour','#30363d');
                root.style.setProperty('--tabText','#ffffff');
              }
            }catch(e){}})();`,
          }}
        />
      </head>

      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Navbar />

          <main>
            {children}
          </main>

          <footer
            style={{
              marginTop: "auto",
              borderTop: "1px solid var(--bodyBackgroundBorder)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <span>GeckoSigns</span>
              <span>&copy; {currentYear}</span>
              <span suppressHydrationWarning>{currentDate}</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
