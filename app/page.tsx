'use client';

import ClientLayout from '@/app/ClientLayout';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const BANNER_TYPE_OPTIONS = ['Club', 'Photographic', 'Cartoon'] as const;

export default function Home() {
  const [fileName, setFileName] = useState('');
  const [bannerType, setBannerType] = useState<string[]>([]);
  const [bannerTypeError, setBannerTypeError] = useState(false);
  const [activeImage, setActiveImage] = useState<number | 'club' | 'photo' | 'cartoon' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const requiresPhoto = bannerType.includes('Photographic') || bannerType.includes('Cartoon');

  useEffect(() => {
    if (activeImage === null) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveImage(null);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [activeImage]);

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
    const form = e.currentTarget;

    if (bannerType.length === 0) {
      setBannerTypeError(true);
      return;
    }

    const fileInput = form.elements.namedItem('file') as HTMLInputElement | null;
    const selectedFile = fileInput?.files?.[0];
    if (requiresPhoto && !selectedFile) {
      alert('Please upload a photo for Photographic or Cartoon banners.');
      return;
    }

    setBannerTypeError(false);
    setIsSubmitting(true);

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
      <main style={styles.pageWrapper}>

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
              <motion.button
                type="button"
                key={idx}
                style={{ ...styles.imageWrapper, ...styles.previewButton }}
                initial={prefersReducedMotion ? false : { x: isLeft ? -100 : 100, opacity: 0 }}
                whileInView={prefersReducedMotion ? {} : { x: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                onClick={() => setActiveImage(idx)}
                aria-label={`Open product photo ${idx + 1}`}
              >
                <Image
                  src={`/images/productImg${idx + 1}.jpeg`}
                  alt={`Photo ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover', cursor: 'pointer' }}
                />
              </motion.button>
            );
          })}
        </section>

        {/* Info Section */}
<section style={styles.infoSection}>
  <div style={styles.infoGrid}>

    {/* Club Banner Box */}
    <div style={styles.infoBox}>
      <h1 style={styles.bannerCardHeading}>Club Banner</h1>

      <div style={styles.photoPriceWrapper}>
        <button
  type="button"
  aria-label="Open club banner preview"
  style={{ ...styles.photoContainer, ...styles.previewButton }}
  onClick={() => setActiveImage('club')}
>
  <Image
    src="/images/textOnly.jpg"
    alt="Club Banner"
    fill
    sizes="(max-width: 1024px) 100vw, 70vw"
    style={{ objectFit: 'contain', cursor: 'pointer' }}
  />
</button>

        {/* Prices outside, aligned toward the box edge */}
        <div style={styles.priceColumn}>
          <h3 style={styles.priceText}>2m - $120</h3>
          <h3 style={styles.priceText}>4m - $220</h3>
          <h3 style={styles.priceText}>Poles - $25</h3>
        </div>
      </div>

      {/* Features list */}
      <div style={styles.featureList}>
        <div style={styles.featureItem}>Club Logo</div>
        <div style={styles.featureItem}>Club Colours</div>
        <div style={styles.featureItem}>Player Number</div>
        <div style={styles.featureItem}>Player Name</div>
        <div style={styles.featureItem}>No Limit on Wording</div>
        <div style={styles.featureItem}>Comes with Mini Keepsake Banner</div>
      </div>
    </div>

    {/* Photographic Banner Box */}
    <div style={styles.infoBox}>
      <h1 style={styles.bannerCardHeading}>Photographic Banner</h1>

      <div style={styles.photoPriceWrapper}>
        {/* Photographic Banner Photo */}
<button
  type="button"
  aria-label="Open photographic banner preview"
  style={{ ...styles.photoContainer, ...styles.previewButton }}
  onClick={() => setActiveImage('photo')}
>
  <Image
    src="/images/photoImg.jpg"
    alt="Photographic Banner"
    fill
    sizes="(max-width: 1024px) 100vw, 70vw"
    style={{ objectFit: 'contain', cursor: 'pointer' }}
  />
</button>

        {/* Prices outside */}
        <div style={styles.priceColumn}>
          <h3 style={styles.priceText}>2m - $150</h3>
          <h3 style={styles.priceText}>4m - $240</h3>
          <h3 style={styles.priceText}>Poles - $25</h3>
        </div>
      </div>

      {/* Features list */}
      <div style={styles.featureList}>
        <div style={styles.featureItem}>One Photoshopped Photo</div>
        <div style={styles.featureItem}>Club Logo</div>
        <div style={styles.featureItem}>Club Colours</div>
        <div style={styles.featureItem}>No Limit on Wording</div>
        <div style={styles.featureItem}>Player Name</div>
        <div style={styles.featureItem}>Player Number</div>
        <div style={styles.featureItem}>Comes with Mini Keepsake Banner</div>
        <div style={styles.featureItem}>Extra Photo $20 Each</div>
      </div>
    </div>

    {/* Cartoon Banner Box */}
    <div style={styles.infoBox}>
      <h1 style={styles.bannerCardHeading}>Cartoon Banner</h1>

      <div style={styles.photoPriceWrapper}>
        <button
          type="button"
          aria-label="Open cartoon banner preview"
          style={{ ...styles.photoContainer, ...styles.previewButton }}
          onClick={() => setActiveImage('cartoon')}
        >
          <Image
            src="/images/photoImg.jpg"
            alt="Cartoon Banner"
            fill
            sizes="(max-width: 1024px) 100vw, 70vw"
            style={{ objectFit: 'contain', cursor: 'pointer' }}
          />
        </button>

        <div style={styles.priceColumn}>
          <h3 style={styles.priceText}>2m - $150</h3>
          <h3 style={styles.priceText}>4m - $240</h3>
          <h3 style={styles.priceText}>Poles - $25</h3>
        </div>
      </div>

      <div style={styles.featureList}>
        <div style={styles.featureItem}>Cartoon Style Artwork</div>
        <div style={styles.featureItem}>Club Logo</div>
        <div style={styles.featureItem}>Club Colours</div>
        <div style={styles.featureItem}>No Limit on Wording</div>
        <div style={styles.featureItem}>Player Name</div>
        <div style={styles.featureItem}>Player Number</div>
        <div style={styles.featureItem}>Comes with Mini Keepsake Banner</div>
        <div style={styles.featureItem}>Extra Character $20 Each</div>
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
              <input type="text" name="name" placeholder="Name" aria-label="Name" autoComplete="name" style={styles.input} required />
              <input type="tel" name="phone" placeholder="Phone" aria-label="Phone" autoComplete="tel" style={styles.input} />
              <input type="email" name="email" placeholder="Email" aria-label="Email" autoComplete="email" style={styles.input} required />
              <input type="date" name="date" aria-label="Required by date" className="enquiryDateInput" style={styles.input} required />
              <input type="number" name="quantity" placeholder="Quantity" aria-label="Quantity" min={1} style={styles.input} />
              <div style={styles.formOptionGroup}>
                <p style={styles.optionGroupLabel}>Banner Size</p>
                <div style={styles.sizeOptionsRow}>
                  <label style={styles.checkboxLabel}>
                    <input type="radio" name="bannerSize" value="2m" required />
                    <span>2m</span>
                  </label>
                  <label style={styles.checkboxLabel}>
                    <input type="radio" name="bannerSize" value="4m" />
                    <span>4m</span>
                  </label>
                </div>
                <label style={styles.checkboxLabel}>
                  <input type="checkbox" name="poles" value="yes" />
                  <span>Add poles (+$25)</span>
                </label>
              </div>

              {/* Banner type options */}
<div style={styles.checkboxWrapper}>
  {BANNER_TYPE_OPTIONS.map((type) => (
    <label key={type} style={styles.checkboxLabel}>
      <input
        type="checkbox"
        name="bannerTypeSelection"
        value={type}
        checked={bannerType.includes(type)}
        onChange={handleBannerTypeChange}
      />
      <span>{type}</span>
    </label>
  ))}

  {/* Club name input */}
  <input
    type="text"
    name="bannerTypeText"
    placeholder="Club Name"
    aria-label="Club Name"
    maxLength={50} // approx 2-5 words
    style={{ ...styles.input, flex: 1 }}
  />
</div>
              {bannerTypeError && <p style={{ color: 'red' }}>Please select at least one option.</p>}

              {/* File input */}
              <input
                ref={fileInputRef}
                type="file"
                name="file"
                accept="image/*"
                onChange={handleFileChange}
                required={requiresPhoto}
                style={styles.hiddenFileInput}
              />
              <button
                type="button"
                style={styles.fileSelectButton}
                onClick={() => fileInputRef.current?.click()}
                aria-label={fileName ? 'Change photo file' : 'Select photo file'}
              >
                {fileName ? 'Change Photo' : 'Select Photo'}
              </button>
              <p style={styles.helperText}>
                {requiresPhoto
                  ? 'Photo is required for Photographic and Cartoon banners.'
                  : 'Photo upload is not needed for Club banners.'}
              </p>
              {fileName && <p>Selected file: {fileName}</p>}

              <textarea
                name="comments"
                placeholder="Comments or any extras?"
                aria-label="Comments"
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
    <button type="button" aria-label="Close image preview" style={styles.closeButton} onClick={() => setActiveImage(null)}>✕</button>
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
            : activeImage === 'photo'
            ? '/images/photoImg.jpg'
            : '/images/photoImg.jpg'
        }
        alt="Full view"
        fill
        sizes="100vw"
        style={{ objectFit: 'contain' }}
      />
    </motion.div>
  </div>
)}
      </main>
    </ClientLayout>
  );
}

// Responsive breakpoint
const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
const isTabletOrSmaller = typeof window !== 'undefined' && window.innerWidth <= 1024;

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
    display: 'grid',
    gap: '1rem',
    gridTemplateColumns: '1fr',
    justifyItems: 'stretch',
  },

  infoBox: {
    backgroundColor: '#111',
    padding: isTabletOrSmaller ? '1rem' : '1.5rem',
    borderRadius: '10px',
    textAlign: 'center',
  },
  bannerCardHeading: {
    color: '#39FF14',
    marginBottom: '1rem',
    fontSize: 'clamp(1.2rem, 3.4vw, 2rem)',
    lineHeight: 1.25,
    wordBreak: 'break-word',
    overflowWrap: 'anywhere',
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
  alignItems: isTabletOrSmaller ? 'stretch' : 'center',
  flexDirection: isTabletOrSmaller ? 'column' : 'row',
  gap: '1rem',
  flexWrap: 'wrap',
},
photoContainer: {
  position: 'relative',
  flex: isTabletOrSmaller ? '1 1 100%' : '2 1 250px',
  width: '100%',
  aspectRatio: isTabletOrSmaller ? '4 / 3' : '16 / 9',
  borderRadius: '8px',
  overflow: 'hidden',
},
  priceColumn: {
  flex: isTabletOrSmaller ? '1 1 100%' : '1 1 120px',
  minWidth: isTabletOrSmaller ? '100%' : '120px',
  display: 'flex',
  alignItems: isTabletOrSmaller ? 'center' : 'flex-start',
  flexDirection: 'column',
  gap: '0.5rem',
},

  priceText: {
  fontSize: 'clamp(1rem, 2.8vw, 1.6rem)',
  color: '#ffffff',
  fontWeight: 500,
  whiteSpace: 'normal',
  wordBreak: 'break-word',
  overflowWrap: 'anywhere',
  textAlign: 'center',
},
  featureList: {
    display: 'grid',
    gridTemplateColumns: isTabletOrSmaller ? '1fr' : '1fr 1fr',
    gap: isTabletOrSmaller ? '0.45rem' : '8px 24px',
    marginTop: '1rem',
    textAlign: 'left',
  },
  featureItem: {
    fontSize: 'clamp(0.9rem, 2.2vw, 1rem)',
    lineHeight: 1.35,
    wordBreak: 'break-word',
    overflowWrap: 'anywhere',
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
  hiddenFileInput: {
    display: 'none',
  },
  fileSelectButton: {
    padding: '0.75rem 1rem',
    borderRadius: '6px',
    border: '1px solid #2c2c2c',
    backgroundColor: '#111',
    color: '#39FF14',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 600,
  },
  formOptionGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.65rem',
    padding: '0.85rem',
    border: '1px solid #2e2e2e',
    borderRadius: '8px',
    backgroundColor: '#101010',
  },
  optionGroupLabel: {
    margin: 0,
    fontSize: '0.95rem',
    color: '#39FF14',
    fontWeight: 600,
  },
  sizeOptionsRow: {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
    gap: '0.65rem',
  },

  imageWrapper: {
    position: 'relative',
    width: '100%',
    aspectRatio: '16 / 9',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  previewButton: {
    border: 'none',
    margin: 0,
    padding: 0,
    background: 'transparent',
    display: 'block',
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