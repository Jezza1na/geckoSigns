'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';

export default function Navbar() {
  const [eyesClosed, setEyesClosed] = useState(false);
  const [eyesOpenStrike, setEyesOpenStrike] = useState(false);
  const [tongue, setTongue] = useState({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    visible: false,
  });

  const tongueAnimatingRef = useRef(false);
  const headerRef = useRef<HTMLDivElement>(null);

  // Blink tracking
  const blinkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const blinkTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Tongue start point
  const TONGUE_START_X_RATIO = 0.89;
  const TONGUE_START_Y_RATIO = 0.43;
  const MAX_TONGUE_LENGTH = 1800;

  /* ============================= */
  /* Blink Logic                   */
  /* ============================= */
  const startBlinking = () => {
    if (blinkIntervalRef.current) clearInterval(blinkIntervalRef.current);
    if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current);

    blinkIntervalRef.current = setInterval(() => {
      setEyesClosed(true);
      blinkTimeoutRef.current = setTimeout(() => setEyesClosed(false), 175);
    }, 2000);
  };

  useEffect(() => {
    startBlinking();
    return () => {
      if (blinkIntervalRef.current) clearInterval(blinkIntervalRef.current);
      if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current);
    };
  }, []);

  /* ============================= */
  /* Tongue Logic                  */
  /* ============================= */
  const fireTongue = (clientX: number, clientY: number) => {
    if (!headerRef.current) return;
    if (tongueAnimatingRef.current) return;

    tongueAnimatingRef.current = true;

    // Eyes strike
    setEyesOpenStrike(true);
    setTimeout(() => setEyesOpenStrike(false), 1000);

    const rect = headerRef.current.getBoundingClientRect();
    const startX = rect.left + rect.width * TONGUE_START_X_RATIO;
    const startY = rect.top + rect.height * TONGUE_START_Y_RATIO;

    let dx = clientX - startX;
    let dy = clientY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > MAX_TONGUE_LENGTH) {
      const scale = MAX_TONGUE_LENGTH / distance;
      dx *= scale;
      dy *= scale;
    }

    const endX = startX + dx;
    const endY = startY + dy;

    setTongue({ x1: startX, y1: startY, x2: startX, y2: startY, visible: true });

    let progress = 0;
    const steps = 20;
    const deltaX = (endX - startX) / steps;
    const deltaY = (endY - startY) / steps;

    const interval = setInterval(() => {
      progress++;
      setTongue((t) => ({
        ...t,
        x2: startX + deltaX * progress,
        y2: startY + deltaY * progress,
      }));

      if (progress >= steps) {
        clearInterval(interval);
        setTimeout(() => {
          let retract = 0;
          const retractInterval = setInterval(() => {
            retract++;
            setTongue((t) => ({
              ...t,
              x2: startX + deltaX * (steps - retract),
              y2: startY + deltaY * (steps - retract),
            }));
            if (retract >= steps) {
              clearInterval(retractInterval);
              setTongue((t) => ({ ...t, visible: false }));
              tongueAnimatingRef.current = false;
            }
          }, 10);
        }, 500);
      }
    }, 10);
  };

  /* ============================= */
  /* Mouse + Touch Events          */
  /* ============================= */
  useEffect(() => {
    let touchStartY: number | null = null;
    let touchMoved = false;

    const handleMouseDown = (e: MouseEvent) => fireTongue(e.clientX, e.clientY);

    const handleTouchStart = (e: TouchEvent) => {
      touchMoved = false;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touchStartY !== null && Math.abs(touch.clientY - touchStartY) > 10) {
        touchMoved = true; // scroll detected
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchMoved && touchStartY !== null) {
        const touch = e.changedTouches[0];
        fireTongue(touch.clientX, touch.clientY);
      }
      touchStartY = null;
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <header ref={headerRef} style={styles.header}>
      <Image
        src="/images/geckoSignsBanner.jpg"
        alt="Milestone Banners by Gecko Signs"
        width={1920}
        height={381}
        priority
        style={styles.bannerImage}
      />

      {(eyesClosed || eyesOpenStrike) && (
        <Image
          src={eyesOpenStrike ? '/images/geckoEyesOpen.png' : '/images/geckoEyesClosed.png'}
          alt="Eyes Overlay"
          width={1920}
          height={381}
          style={styles.overlayImage}
        />
      )}

      {tongue.visible && (
        <svg style={styles.tongueSvg}>
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
    </header>
  );
}

const styles: { [key: string]: CSSProperties } = {
  header: {
    width: '100%',
    position: 'relative',
    backgroundColor: '#0B0B0B',
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
  overlayImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    pointerEvents: 'none',
  },
  tongueSvg: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 9999,
  },
};