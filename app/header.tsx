'use client';
import Image from 'next/image';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

export default function Navbar() {
  return (
    <header style={styles.header}>
      {/* Full-width background image */}
      <div style={styles.bannerWrapper}>
        <Image
          src="/images/geckoSignsBanner.jpg" // your full banner/logo image
          alt="GeckoSigns"
          fill
          style={{
            objectFit: 'contain', // <-- ensures the entire image is shown
            objectPosition: 'center',
          }}
          priority
        />

        {/* Icons on top right */}
        <div style={styles.iconsWrapper}>
          <div style={styles.iconBox}><FaFacebookF /></div>
          <div style={styles.iconBox}><FaInstagram /></div>
          <div style={styles.iconBox}><MdEmail /></div>
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    position: 'relative' as const,
    width: '100%',
    height: 'auto', // will follow the image's natural height
  },
  bannerWrapper: {
    position: 'relative' as const,
    width: '100%',
    height: '381px', // you can adjust this depending on image aspect ratio
  },
  iconsWrapper: {
    position: 'absolute' as const,
    top: '10px',
    right: '20px',
    display: 'flex',
    gap: '1rem',
  },
  iconBox: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: '0.5rem',
    borderRadius: '6px',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};