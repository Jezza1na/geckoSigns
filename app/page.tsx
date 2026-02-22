'use client';

import ClientLayout from '@/app/ClientLayout';
import Image from 'next/image';
import { useState } from 'react';

export default function Home() {
  const [selectedSize, setSelectedSize] = useState<'normal' | 'custom'>('normal');
  const [customWriting, setCustomWriting] = useState('');

  return (
    <ClientLayout>
      <div style={{ padding: '0 4rem', display: 'flex', flexDirection: 'column', gap: '4rem' }}>

        {/* Banner Section */}
        <section style={styles.banner}>
          <Image
            src="/images/main.jpeg" // Banner image
            alt="Banner"
            fill
            style={{ objectFit: 'cover', borderRadius: '12px' }}
          />
        </section>

        {/* 8 Product Photos in 2x4 grid */}
        <section style={styles.gridSection}>
          {[...Array(8)].map((_, idx) => (
            <div key={idx} style={styles.imageWrapper}>
              <Image
                src={`/images/productImg${idx + 1}.jpeg`} // Product images
                alt={`Photo ${idx + 1}`}
                fill
                style={{ objectFit: 'cover', borderRadius: '8px' }}
              />
            </div>
          ))}
        </section>

        {/* Info Section */}
        <section style={styles.infoSection}>
          <h2>Information Section</h2>
          <p>
            This is a placeholder for general information about your products or services. You can fill in your text here.
          </p>
        </section>

        {/* 2-column Section: Sizes + Enquiry Form */}
        <section style={styles.optionsFormSection}>

          {/* Left: Sizes */}
          <div style={styles.optionsColumn}>
            <h2>Sizes</h2>
            <div style={styles.optionButtons}>
              <button
                style={{
                  ...styles.optionButton,
                  backgroundColor: selectedSize === 'normal' ? '#0d6efd' : '#ddd',
                  color: selectedSize === 'normal' ? '#fff' : '#000',
                }}
                onClick={() => setSelectedSize('normal')}
              >
                Normal
              </button>
              <button
                style={{
                  ...styles.optionButton,
                  backgroundColor: selectedSize === 'custom' ? '#0d6efd' : '#ddd',
                  color: selectedSize === 'custom' ? '#fff' : '#000',
                }}
                onClick={() => setSelectedSize('custom')}
              >
                Custom
              </button>
            </div>

            {/* Photo or Writing Input */}
            <div style={styles.photoPreview}>
              {selectedSize === 'normal' ? (
                <div style={styles.imageWrapper}>
                  <Image
                    src="/images/photo1.png" // Normal size photo
                    alt="Normal Size"
                    fill
                    style={{ objectFit: 'cover', borderRadius: '8px' }}
                  />
                </div>
              ) : (
                <textarea
                  placeholder="Enter your writing"
                  value={customWriting}
                  onChange={(e) => setCustomWriting(e.target.value)}
                  style={{ ...styles.input, height: '150px' }}
                />
              )}
            </div>
          </div>

          {/* Right: Enquiry Form */}
          <div style={styles.formColumn}>
            <h2>Enquiry Form</h2>
            <form style={styles.form}>
              <input type="text" placeholder="Name" style={styles.input} required />
              <input type="tel" placeholder="Phone" style={styles.input} />
              <input type="email" placeholder="Email" style={styles.input} required />
              <input type="date" placeholder="Date Needed" style={styles.input} />
              <input type="number" placeholder="Quantity" style={styles.input} />
              <input type="file" style={styles.input} />
              <textarea placeholder="Comments" style={{ ...styles.input, height: '100px' }} />
              <button type="submit" style={styles.submitButton}>Submit</button>
            </form>
          </div>

        </section>

      </div>
    </ClientLayout>
  );
}

const styles = {
  banner: {
    position: 'relative' as const,
    width: '100%',
    height: '600px',
    backgroundColor: '#ccc',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#000',
    textAlign: 'center' as const,
    borderRadius: '12px',
    marginTop: '1rem',
  },

  gridSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridTemplateRows: 'repeat(4, 400px)',
    gap: '1rem',
  },

  infoSection: {
    backgroundColor: '#f5f5f5',
    padding: '2rem',
    borderRadius: '12px',
  },

  optionsFormSection: {
    display: 'flex',
    gap: '2rem',
  },

  optionsColumn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },

  optionButtons: {
    display: 'flex',
    gap: '1rem',
  },

  optionButton: {
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
  },

  photoPreview: {
    marginTop: '1rem',
    width: '100%',
    height: '400px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  formColumn: {
    flex: 1,
    backgroundColor: '#eee',
    padding: '1rem',
    borderRadius: '12px',
  },

  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },

  input: {
    padding: '0.75rem 1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },

  submitButton: {
    padding: '0.75rem 1rem',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#0d6efd',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
  },

  imageWrapper: {
    position: 'relative' as const,
    width: '100%',
    height: '100%',
    borderRadius: '8px',
    overflow: 'hidden',
  },
};