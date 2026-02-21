'use client';
{/*Chat GPT help with the developing the dark mode, also helped with the code running better*/}
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './components/navBar.module.css';

export default function NavBar() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try { return localStorage.getItem('dark_mode') === 'true'; } catch { return false; }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty('--header', '60px');
    root.style.setProperty('--tabs', '60px');

    root.style.setProperty('--dropDown',  darkMode ? '#1b1b1b' : '#f9f9f9');
    root.style.setProperty('--dropDownBorder', darkMode ? '#2a2a2a' : '#ccc');

    root.style.setProperty('--bodyBackground',       darkMode ? '#222222' : '#ffffff');
    root.style.setProperty('--textColour',           darkMode ? '#f8f9fa' : '#212529');
    root.style.setProperty('--bodyBackgroundBorder', darkMode ? '#2a2a2a' : '#dee2e6');
    root.style.setProperty('--linkColour',           darkMode ? '#6ab0ff' : '#0d6efd');

    root.style.setProperty('--headerBackground', darkMode ? '#111' : '#222');
    root.style.setProperty('--rows',             darkMode ? '#000' : '#f3f4f6');
    root.style.setProperty('--tabColour',        darkMode ? '#30363d' : '#e5e7eb');
    root.style.setProperty('--tabText',          darkMode ? '#ffffff' : '#111827');

    try { localStorage.setItem('dark_mode', String(darkMode)); } catch {}
  }, [darkMode]);

  const tabs = [
    { label: 'Home',         href: '/' },
    { label: 'Enqueries',  href: '/enqueries' },
    { label: '', href: '/temp1' },
    { label: '',   href: '/temp2' },
    { label: 'About',        href: '/about' },
  ];

  const closeMenu = () => setIsOpen(false);

  return (
    <div>
      <header className={styles.header} role="banner">
        Webpage
        <span className={styles.studentId}>Webpage</span>
      </header>

      <div className={styles.topRow}>
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <Link key={tab.href} href={tab.href} className={styles.tabLink} onClick={closeMenu}>
              <span className={styles.tab}>{tab.label}</span>
            </Link>
          ))}
        </div>

        <div className={styles.container}>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            aria-controls="main-menu"
            className={styles.hamburger}
            onClick={() => setIsOpen(prev => !prev)}
          >
            <span className={isOpen ? styles.barOpen : styles.bar} />
            <span className={isOpen ? styles.barOpen : styles.bar} />
            <span className={isOpen ? styles.barOpen : styles.bar} />
          </button>

          <nav
            id="main-menu"
            className={isOpen ? styles.menuOpen : styles.menu}
            aria-hidden={!isOpen}
            style={isOpen ? { top: 'calc(var(--header) + var(--tabs))' } : undefined}
          >
            <ul className={styles.menuList}>
              {tabs.map((tab) => (
                <li key={tab.href} className={styles.menuItem} onClick={closeMenu}>
                  <Link href={tab.href} className={styles.menuLink}>{tab.label}</Link>
                </li>
              ))}
              <li className={`${styles.menuItem} ${styles.toggleRow}`}>
                <span>Dark Mode</span>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={() => setDarkMode(prev => !prev)}
                    aria-label="Toggle dark mode"
                  />
                  <span className={styles.track} />
                  <span className={styles.thumb} />
                </label>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
