'use client';

import { useEffect, useState } from 'react';
import { FaInstagram, FaFacebook, FaEnvelope, FaPhone } from 'react-icons/fa';
import styles from './components/navBar.module.css';

export default function NavBar() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try { return localStorage.getItem('dark_mode') === 'true'; }
    catch { return false; }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--header', '150px');
    root.style.setProperty('--bodyBackground',       darkMode ? '#222222' : '#ffffff');
    root.style.setProperty('--textColour',           darkMode ? '#f8f9fa' : '#212529');
    root.style.setProperty('--bodyBackgroundBorder', darkMode ? '#2a2a2a' : '#dee2e6');
    root.style.setProperty('--linkColour',           darkMode ? '#6ab0ff' : '#0d6efd');
    root.style.setProperty('--headerBackground', darkMode ? '#111' : '#222');

    try { localStorage.setItem('dark_mode', String(darkMode)); }
    catch {}
  }, [darkMode]);

  return (
    <header className={styles.header}>
      {/* Right side: toggle + icons */}
      <div className={styles.rightContainer}>
        <div className={styles.toggleContainer}>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(prev => !prev)}
            />
            <span className={styles.track}></span>
            <span className={styles.thumb}></span>
          </label>
        </div>
        <div className={styles.iconGrid}>
          <div className={styles.iconBox}><FaInstagram size={20} color="#E1306C" /></div>
          <div className={styles.iconBox}><FaFacebook size={20} color="#1877F2" /></div>
          <div className={styles.iconBox}><FaEnvelope size={20} color="#555" /></div>
          <div className={styles.iconBox}><FaPhone size={20} color="#555" /></div>
        </div>
      </div>

      {/* Centered site name */}
      <div className={styles.siteName}>Milestone Banners by GeckoSigns</div>
    </header>
  );
}