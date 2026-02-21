'use client';
{/*Chat GPT help with the developing the cookies, problems with actually getting them to remember the page */}
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

export default function CookieConsent() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = Cookies.get('cookie_consent');
    setShow(consent !== 'true');
  }, [pathname]);

  const acceptCookies = () => {
    Cookies.set('cookie_consent', 'true', { expires: 30 });
    Cookies.set('last_location', window.location.pathname, { expires: 30 });
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        zIndex: 9999,
        background: 'var(--bodyBackground)',
        color: 'var(--textColour)',
        borderTop: '1px solid var(--bodyBackgroundBorder)',
      }}
    >
      <div className="d-flex justify-content-between align-items-center px-3 py-2">
        <span className="ms-2">
          We use a cookie to remember your last location on the site.
        </span>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-success btn-sm"
            onClick={acceptCookies}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
