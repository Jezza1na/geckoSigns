'use client';

import ClientLayout from '@/app/ClientLayout';
import Image from 'next/image';
import { useState } from 'react';

export default function Home() {
  const [selectedOption, setSelectedOption] = useState('1.8m x 1m');

  // Map options to a single placeholder photo number
  const optionPhotos: Record<string, number> = {
    '1.8m x 1m': 1,
    '2m': 2,
    '3m': 3,
    '4m': 4,
  };

  return (
    <ClientLayout>
      <div style={{ padding: '0 4rem', display: 'flex', flexDirection: 'column', gap: '4rem' }}>

        {/* Banner Section */}
        <section style={styles.banner}>
          <h1 style={styles.bannerText}>Your Banner Title Here</h1>
          <p style={styles.bannerText}>Subheading or tagline goes here.</p>
        </section>

        {/* 8 Placeholder Photos in 2x4 grid */}
        <section style={styles.gridSection}>
          {[...Array(8)].map((_, idx) => (
            <div key={idx} style={styles.photoPlaceholder}>
              <span>Photo {idx + 1}</span>
            </div>
          ))}
        </section>

        {/* Info Placeholder */}
        <section style={styles.infoSection}>
          <h2>Information Section</h2>
          <p>
            This is a placeholder for general information about your products or services. You can fill in your text here.
          </p>
        </section>

        {/* 2-column Section: Options + Enquiry Form */}
        <section style={styles.optionsFormSection}>
          {/* Left: Single Option Photo */}
          <div style={styles.optionsColumn}>
            <h2>Select Size</h2>
            <div style={styles.optionButtons}>
              {Object.keys(optionPhotos).map(option => (
                <button
                  key={option}
                  style={{
                    ...styles.optionButton,
                    backgroundColor: selectedOption === option ? '#0d6efd' : '#ddd',
                    color: selectedOption === option ? '#fff' : '#000',
                  }}
                  onClick={() => setSelectedOption(option)}
                >
                  {option}
                </button>
              ))}
            </div>

            <div style={styles.photoPreview}>
              <div style={{ ...styles.photoPlaceholder, width: '100%', height: '100%' }}>
                <span>Photo {optionPhotos[selectedOption]}</span>
              </div>
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
  bannerText: {
    margin: 0,
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: '8px',
  },

  gridSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridTemplateRows: 'repeat(4, 400px)',
    gap: '1rem',
  },
  photoPlaceholder: {
    backgroundColor: '#ddd',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#555',
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
  width: '100%',        // takes full width of the column
  height: '400px',      // adjust height as needed
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
};