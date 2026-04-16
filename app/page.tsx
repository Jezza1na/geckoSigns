'use client';

import ClientLayout from '@/app/ClientLayout';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';
import type { CSSProperties } from 'react';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const BANNER_TYPE_OPTIONS = ['Club Banner', 'Photographic Banner'] as const;

export default function Home() {
  const [fileName, setFileName] = useState('');
  const [bannerType, setBannerType] = useState<string[]>([]);
  const [bannerTypeError, setBannerTypeError] = useState(false);
  const [activeImage, setActiveImage] = useState<number | 'club' | 'photo' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBannerTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setBannerType((prev) => [...prev, value]);
    } else {
      setBannerType((prev) => prev.filter((v) => v !== value));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      setFileName('');
      return;
    }

    if (!selectedFile.type.startsWith('image/')) {
      alert('Only image files allowed');
      e.target.value = '';
      setFileName('');
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      alert('Max file size 5MB');
      e.target.value = '';
      setFileName('');
      return;
    }

    setFileName(selectedFile.name);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (bannerType.length === 0) {
      setBannerTypeError(true);
      return;
    }

    setBannerTypeError(false);
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    bannerType.forEach((type) => formData.append('bannerType', type));

    try {
      const res = await fetch('/api/enquiry', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.error || 'Something went wrong');
        return;
      }

      alert('Enquiry sent successfully!');
      form.reset();
      setFileName('');
      setBannerType([]);
    } catch {
      alert('Unable to send your enquiry right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ClientLayout>
      <div style={styles.pageWrapper}>

        {/* Heading + Intro */}
        <section style={styles.introSection}>
          <h1 style={styles.introHeading}>Welcome to Milestone BANNERS</h1>
          <p style={styles.introText}>
            Celebrating your sporting achievement is stress-free and easy with our personalised breakthrough banners.
          </p>
          <p style={styles.introText}>
            Each banner is custom designed, so no two banners are ever the same.
          </p>
          <p style={styles.introText}>
            Our banners are made from durable, weather-resistant paper with vibrant colour designs that will withstand even the wettest, windiest day.
          </p>
        </section>

        {/* Product Photos */}
        <section id="first-row" style={styles.gridSection}>
          {[...Array(8)].map((_, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <motion.div
                key={idx}
                style={styles.imageWrapper}
                initial={{ x: isLeft ? -100 : 100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                onClick={() => setActiveImage(idx)}
              >
                <Image
                  src={`/images/productImg${idx + 1}.jpeg`}
                  alt={`Photo ${idx + 1}`}
                  fill
                  style={{ objectFit: 'cover', cursor: 'pointer' }}
                />
              </motion.div>
            );
          })}
        </section>

        {/* Info Section */}
<section style={styles.infoSection}>
  <div style={styles.infoGrid}>

    {/* Club Banner Box */}
    <div style={styles.infoBox}>
      <h1 style={{ color: '#39FF14', marginBottom: '1rem', fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)' }}>Club Banner</h1>

      <div style={styles.photoPriceWrapper}>
        <div
  style={styles.photoContainer}
  onClick={() => setActiveImage('club')}
>
  <Image
    src="/images/textOnly.jpg"
    alt="Club Banner"
    fill
    style={{ objectFit: 'contain', cursor: 'pointer' }}
  />
</div>

        {/* Prices outside, aligned toward the box edge */}
        <div style={styles.priceColumn}>
          <h3 style={styles.priceText}>2m - $120</h3>
          <h3 style={styles.priceText}>4m - $220</h3>
          <h3 style={styles.priceText}>Poles - $25</h3>
        </div>
      </div>

      {/* Features list */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 40px', marginTop: '1rem' }}>
        <div>Club Logo</div>
        <div>Club Colours</div>
        <div>Player Number</div>
        <div>Player Name</div>
        <div>No Limit on Wording</div>
        <div>Comes with Mini Keepsake Banner</div>
      </div>
    </div>

    {/* Photographic Banner Box */}
    <div style={styles.infoBox}>
      <h1 style={{ color: '#39FF14', marginBottom: '1rem', fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)' }}>Photographic Banner</h1>

      <div style={styles.photoPriceWrapper}>
        {/* Photographic Banner Photo */}
<div
  style={styles.photoContainer}
  onClick={() => setActiveImage('photo')}
>
  <Image
    src="/images/photoImg.jpg"
    alt="Photographic Banner"
    fill
    style={{ objectFit: 'contain', cursor: 'pointer' }}
  />
</div>

        {/* Prices outside */}
        <div style={styles.priceColumn}>
          <h3 style={styles.priceText}>2m - $150</h3>
          <h3 style={styles.priceText}>4m - $240</h3>
          <h3 style={styles.priceText}>Poles - $25</h3>
        </div>
      </div>

      {/* Features list */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 40px', marginTop: '1rem' }}>
        <div>One Photoshopped Photo</div>
        <div>Club Logo</div>
        <div>Club Colours</div>
        <div>No Limit on Wording</div>
        <div>Player Name</div>
        <div>Player Number</div>
        <div>Comes with Mini Keepsake Banner</div>
        <div>Extra Photo $20 Each</div>
      </div>
    </div>

  </div>
</section>

        {/* Enquiry Form */}
        <section style={styles.optionsFormSection}>
          <div style={styles.formColumnCentered}>
            <h2 style={styles.sectionHeading}>Enquiry Form</h2>

            <form
              style={styles.form}
              onSubmit={handleSubmit}
            >
              <input type="text" name="name" placeholder="Name" style={styles.input} required />
              <input type="tel" name="phone" placeholder="Phone" style={styles.input} />
              <input type="email" name="email" placeholder="Email" style={styles.input} required />
              <input type="date" name="date" style={styles.input} required />
              <input type="number" name="quantity" placeholder="Quantity" min={1} style={styles.input} />

              {/* Normal / Custom Checkboxes → Club / Photographic */}
<div style={styles.checkboxWrapper}>
  {BANNER_TYPE_OPTIONS.map((type) => (
    <label key={type} style={styles.checkboxLabel}>
      <input
        type="checkbox"
        value={type}
        checked={bannerType.includes(type)}
        onChange={handleBannerTypeChange}
      />
      <span>{type}</span>
    </label>
  ))}

  {/* Type Input box (2-5 words) */}
  <input
    type="text"
    name="bannerTypeText"
    placeholder="Club"
    maxLength={50} // approx 2-5 words
    style={{ ...styles.input, flex: 1 }}
  />
</div>
              {bannerTypeError && <p style={{ color: 'red' }}>Please select at least one option.</p>}

              {/* File input */}
              <input
                type="file"
                name="file"
                accept="image/*"
                style={styles.input}
                onChange={handleFileChange}
              />
              <p style={styles.helperText}>Photo upload is optional.</p>
              {fileName && <p>Selected file: {fileName}</p>}

              <textarea
                name="comments"
                placeholder="Comments"
                style={{ ...styles.input, minHeight: '100px', resize: 'vertical' }}
              />

              <button type="submit" style={styles.submitButton} disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Submit'}
              </button>
            </form>
          </div>
        </section>

        {/* Installation Video Section */}
        <section style={styles.videoSection}>
          <h2 style={styles.videoHeading}>How to install your Banner</h2>

          <div style={styles.videoWrapper}>
            <video controls style={styles.video}>
              <source src="/videos/banner-install.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </section>

        {activeImage !== null && (
  <div style={styles.lightboxOverlay} onClick={() => setActiveImage(null)}>
    <button style={styles.closeButton} onClick={() => setActiveImage(null)}>✕</button>
    <motion.div
      style={styles.lightboxImageWrapper}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={(e) => e.stopPropagation()}
    >
      <Image
        src={
          typeof activeImage === 'number'
            ? `/images/productImg${activeImage + 1}.jpeg`
            : activeImage === 'club'
            ? '/images/textOnly.jpg'
            : '/images/photoImg.jpg'
        }
        alt="Full view"
        fill
        style={{ objectFit: 'contain' }}
      />
    </motion.div>
  </div>
)}
      </div>
    </ClientLayout>
  );
}

// Responsive breakpoint
const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

const styles: { [key: string]: CSSProperties } = {
  pageWrapper: {
    paddingLeft: 'clamp(1rem, 5vw, 8rem)',
    paddingRight: 'clamp(1rem, 5vw, 8rem)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8rem',
    backgroundColor: '#0B0B0B',
    color: '#ffffff',
    overflowX: 'hidden',
  },

  gridSection: {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
    gap: '1rem',
  },

  infoSection: {
    backgroundColor: '#1A1A1A',
    padding: '2rem',
    borderRadius: '12px',
  },

  infoGrid: {
    display: 'flex',
    gap: isMobile ? '1rem' : '2rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
    flexDirection: isMobile ? 'column' : 'row',
  },

  infoBox: {
    flex: isMobile ? '1 1 100%' : '1 1 300px',
    backgroundColor: '#111',
    padding: isMobile ? '1rem' : '1.5rem',
    borderRadius: '10px',
    textAlign: 'center',
  },

  photoPriceRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap',
  },

  mainPhotoSpot: {
    flex: '1 1 60%',
    height: '200px',
    backgroundColor: '#333',
    borderRadius: '8px',
  },
  photoPriceWrapper: {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  flexWrap: 'wrap',
},
photoContainer: {
  position: 'relative',
  flex: '2 1 250px',
  width: '100%',
  aspectRatio: '16 / 9',
  borderRadius: '8px',
  overflow: 'hidden',
},
  priceColumn: {
  flex: '1 1 120px',
  minWidth: '120px',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
},

  priceText: {
  fontSize: 'clamp(1.2rem, 2vw, 2rem)',
  color: '#ffffff',
  fontWeight: 500,
  whiteSpace: 'nowrap',
},

  optionsFormSection: {
    display: 'flex',
    justifyContent: 'center',
    padding: isMobile ? '1rem 0.5rem' : '2rem 1rem',
    backgroundColor: '#0B0B0B',
    width: '100%',
  },

  sectionHeading: {
    color: '#39FF14',
    textAlign: 'center',
    marginBottom: '1rem',
    fontSize: isMobile ? '1.5rem' : undefined,
  },

  formColumnCentered: {
    width: '100%',
    maxWidth: '500px',
    backgroundColor: '#1A1A1A',
    padding: isMobile ? '1rem 1rem' : '1rem 2rem',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    boxSizing: 'border-box',
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },

  input: {
    padding: '0.75rem 1rem',
    borderRadius: '6px',
    border: '1px solid #333',
    backgroundColor: '#111',
    color: '#fff',
    fontSize: '16px',
  },

  submitButton: {
    padding: '0.75rem 1rem',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#39FF14',
    color: '#000',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },

  helperText: {
    margin: '-0.5rem 0 0',
    fontSize: '0.9rem',
    color: '#b3b3b3',
  },

  imageWrapper: {
    position: 'relative',
    width: '100%',
    aspectRatio: '16 / 9',
    borderRadius: '8px',
    overflow: 'hidden',
  },

  introSection: {
    width: '100%',
    padding: '2rem 0',
    textAlign: 'center',
    backgroundColor: '#0B0B0B',
  },

  introHeading: {
    fontSize: isMobile ? '2rem' : '2.5rem',
    margin: '0 0 1rem 0',
    color: '#39FF14',
  },

  introText: {
    fontSize: isMobile ? '1rem' : '1.25rem',
    margin: 0,
    color: '#ffffff',
    maxWidth: isMobile ? '90%' : '800px',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingTop: '1rem',
  },

  videoSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2rem',
    paddingBottom: '4rem',
  },

  videoHeading: {
    color: '#39FF14',
    fontSize: isMobile ? '1.5rem' : '2rem',
    textAlign: 'center',
  },

  videoWrapper: {
    width: '100%',
    maxWidth: isMobile ? '100%' : '900px',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 0 20px rgba(57, 255, 20, 0.2)',
  },

  video: {
    width: '100%',
    height: 'auto',
    display: 'block',
  },

  lightboxOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.9)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },

  lightboxImageWrapper: {
    position: 'relative',
    width: '90vw',
    height: '90vh',
  },

  closeButton: {
    position: 'absolute',
    top: '20px',
    right: '30px',
    fontSize: '2rem',
    background: 'none',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    zIndex: 10000,
  },

  checkboxWrapper: {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
  gap: '0.75rem',
  marginTop: '1rem',
},

checkboxLabel: {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.5rem 0.75rem',
  backgroundColor: '#111',
  border: '1px solid #333',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: 'clamp(0.85rem, 1.2vw, 1rem)',
},
};