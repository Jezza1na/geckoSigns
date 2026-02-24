'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import CookieConsent from './components/CookieConsent';
import Footer from './components/footer'; // Import the new Footer

type Props = { children: React.ReactNode };

export default function ClientLayout({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  // Restore last page ONCE when user opens site
  useEffect(() => {
    const consent = Cookies.get('cookie_consent');
    const last = Cookies.get('last_location');
    const redirected = sessionStorage.getItem('hasRedirected');

    if (consent === 'true' && last && pathname === '/' && last !== '/' && !redirected) {
      sessionStorage.setItem('hasRedirected', 'true');
      router.replace(last);
    }
  }, [router, pathname]);

  // Silently update location while navigating SPA
  useEffect(() => {
    if (Cookies.get('cookie_consent') === 'true') {
      Cookies.set('last_location', pathname, { expires: 30 });
    }
  }, [pathname]);

  return (
    <div className="d-flex flex-column min-vh-100" style={{ background: 'var(--bodyBackground)', color: 'var(--textColour)' }}>
      <main className="flex-grow-1">
        {children}
      </main>

      <Footer /> {/* Footer at bottom */}
      <CookieConsent /> {/* Cookie consent overlay */}
    </div>
  );
}