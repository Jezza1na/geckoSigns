'use client';
import Image from 'next/image';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { useState } from 'react';

export default function Navbar() {
  return (
    <header style={styles.header}>
      <div style={styles.bannerWrapper}>
        <Image
          src="/images/geckoSignsBanner.jpg"
          alt="GeckoSigns"
          fill
          style={{
            objectFit: 'contain',
            objectPosition: 'center',
          }}
          priority
        />

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