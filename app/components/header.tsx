'use client';
import Image from 'next/image';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const [eyesClosed, setEyesClosed] = useState(false);
  const [eyesOpenStrike, setEyesOpenStrike] = useState(false);
  const [tongue, setTongue] = useState<{ x1: number; y1: number; x2: number; y2: number; visible: boolean }>({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    visible: false,
  });

  const bannerRef = useRef<HTMLDivElement>(null);

  // Constants for fixed tongue start point relative to the banner
  const TONGUE_START_X = 1700; // px from left of banner
  const TONGUE_START_Y = 161;  // px from top of banner

  // Automatic blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setEyesClosed(true);
      setTimeout(() => setEyesClosed(false), 175); // blink duration
    }, 2000); // blink every 4 seconds
    return () => clearInterval(blinkInterval);
  }, []);

  // Left mouse click: strike eyes + tongue
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0 || !bannerRef.current) return;

      // Show strike eyes for 2s
      setEyesOpenStrike(true);
      setTimeout(() => setEyesOpenStrike(false), 2000);

      // Get banner position
      const rect = bannerRef.current.getBoundingClientRect();
      const startX = rect.left + TONGUE_START_X;
      const startY = rect.top + TONGUE_START_Y;

      const endX = e.clientX;
      const endY = e.clientY;

      // Animate tongue outward
      setTongue({ x1: startX, y1: startY, x2: startX, y2: startY, visible: true });

      let progress = 0;
      const steps = 20;
      const deltaX = (endX - startX) / steps;
      const deltaY = (endY - startY) / steps;

      const interval = setInterval(() => {
        progress++;
        setTongue((t) => ({ ...t, x2: startX + deltaX * progress, y2: startY + deltaY * progress }));
        if (progress >= steps) {
          clearInterval(interval);

          // Retract tongue after 500ms
          setTimeout(() => {
            let retractProgress = 0;
            const retractInterval = setInterval(() => {
              retractProgress++;
              setTongue((t) => ({
                ...t,
                x2: startX + deltaX * (steps - retractProgress),
                y2: startY + deltaY * (steps - retractProgress),
              }));
              if (retractProgress >= steps) {
                clearInterval(retractInterval);
                setTongue((t) => ({ ...t, visible: false }));
              }
            }, 10);
          }, 500);
        }
      }, 10);
    };

    window.addEventListener('mousedown', handleMouseDown);
    return () => window.removeEventListener('mousedown', handleMouseDown);
  }, []);

  return (
    <header style={styles.header}>
      <div ref={bannerRef} style={styles.bannerWrapper}>
        <Image
          src="/images/geckoSignsBanner.png"
          alt="GeckoSigns"
          fill
          style={{
            objectFit: 'contain',
            objectPosition: 'center',
          }}
          priority
        />

        {/* Eye Overlay */}
        {(eyesClosed || eyesOpenStrike) && (
          <Image
            src={eyesOpenStrike ? '/images/geckoEyesOpen.png' : '/images/geckoEyesClosed.png'}
            alt="Eyes Overlay"
            fill
            style={{
              objectFit: 'contain',
              objectPosition: 'center',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Tongue */}
        {tongue.visible && (
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              pointerEvents: 'none',
            }}
          >
            <line
              x1={tongue.x1}
              y1={tongue.y1}
              x2={tongue.x2}
              y2={tongue.y2}
              stroke="#ff3f00"
              strokeWidth={8}
              strokeLinecap="round"
            />
          </svg>
        )}

        <div style={styles.iconsWrapper}>
          <GlowIcon href="https://www.facebook.com/geckosignslilydale">
            <FaFacebookF style={iconStyle} />
          </GlowIcon>
          <GlowIcon href="https://www.instagram.com/gecko_signs/">
            <FaInstagram style={iconStyle} />
          </GlowIcon>
          <GlowIcon href="mailto:sam@geckosigns.net.au?subject=Banner Enquiry">
            <MdEmail style={iconStyle} />
          </GlowIcon>
        </div>
      </div>
    </header>
  );
}

function GlowIcon({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        ...styles.iconBox,
        transform: hovered ? 'scale(1.1)' : 'scale(1)',
        boxShadow: hovered
          ? '0 0 12px #39FF14, 0 0 20px #39FF14'
          : '0 0 5px rgba(57,255,20,0.3)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </a>
  );
}

/* ========================= */
/* Styles */
/* ========================= */

const iconStyle = {
  color: '#39FF14',
  fontSize: '28px',
};

const styles = {
  header: {
    position: 'relative' as const,
    width: '100%',
    height: 'auto',
  },
  bannerWrapper: {
    position: 'relative' as const,
    width: '100%',
    height: '381px',
  },
  iconsWrapper: {
    position: 'absolute' as const,
    top: '15px',
    right: '25px',
    display: 'flex',
    gap: '1rem',
  },
  iconBox: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: '0.7rem',
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.25s ease',
  },
};