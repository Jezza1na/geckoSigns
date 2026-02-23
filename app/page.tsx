'use client';

import ClientLayout from '@/app/ClientLayout';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <ClientLayout>
      <div style={styles.pageWrapper}>

        {/* Heading + Intro Text below header */}
        <section style={styles.introSection}>
          <h1 style={styles.introHeading}>Welcome to Milestone BANNERS</h1>
          <p style={styles.introText}>
            Explore our premium run-through milestone banners. Custom sizes, premium materials, and designs for every celebration!
          </p>
        </section>

        {/* 8 Product Photos (Animated Slide In) */}
        <section style={styles.gridSection}>
          {[...Array(8)].map((_, idx) => {
            const isLeftColumn = idx % 2 === 0;
            return (
              <motion.div
                key={idx}
                style={styles.imageWrapper}
                initial={{ x: isLeftColumn ? -200 : 200, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                <Image
                  src={`/images/productImg${idx + 1}.jpeg`}
                  alt={`Photo ${idx + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </motion.div>
            );
          })}
        </section>

        {/* Info Section - 2 Columns */}
        <section style={styles.infoSection}>
          <div style={styles.infoGrid}>
            <div style={styles.infoBox}>
              <h1 style={{ color: '#39FF14' }}>Standard size</h1>
              <h3>1.8m x 4m</h3>
              <p>
                Our milestone banners are normally printed at our standard size of 1.8m X 4m. All our run through banners use durable,
                weather-resistant materials designed to last indoors and outdoors.
              </p>
            </div>

            <div style={styles.infoBox}>
              <h1 style={{ color: '#39FF14' }}>Custom Designs Available</h1>
              <h3>1.8m x 1m, 2m, 3m, 5m</h3>
              <p>
                Choose standard size or fully customise your banner
                to suit your special event, sporting milestone, or celebration.
              </p>
            </div>
          </div>
        </section>

        {/* Enquiry Form Centered */}
        <section style={styles.optionsFormSection}>
          <div style={styles.formColumnCentered}>
            <h2 style={styles.sectionHeading}>Enquiry Form</h2>

            <form style={styles.form}>
              <input type="text" placeholder="Name" style={styles.input} required />
              <input type="tel" placeholder="Phone" style={styles.input} />
              <input type="email" placeholder="Email" style={styles.input} required />
              <input type="date" style={styles.input} />
              <input type="number" placeholder="Quantity" style={styles.input} />
              <input type="file" style={styles.input} />
              <textarea placeholder="Comments" style={{ ...styles.input, height: '100px' }} />

              <button type="submit" style={styles.submitButton}>
                Submit
              </button>
            </form>
          </div>
        </section>

      </div>
    </ClientLayout>
  );
}

const styles = {
  pageWrapper: {
    paddingTop: '4rem',
    padding: '0 8rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8rem',
    backgroundColor: '#0B0B0B',
    color: '#ffffff',
  },

  gridSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridTemplateRows: 'repeat(4, 400px)',
    gap: '1rem',
  },

  infoSection: {
    backgroundColor: '#1A1A1A',
    padding: '2rem',
    borderRadius: '12px',
  },

  infoGrid: {
    display: 'flex',
    gap: '2rem',
  },

  infoBox: {
    flex: 1,
    backgroundColor: '#111',
    padding: '1.5rem',
    borderRadius: '10px',
  },

  optionsFormSection: {
    display: 'flex',
    justifyContent: 'center',
    paddingBottom: '4rem',
  },

  sectionHeading: {
    color: '#39FF14',
    textAlign: 'center' as const,
    marginBottom: '1rem',
  },

  formColumnCentered: {
    flex: '0 0 500px', // fixed width
    backgroundColor: '#1A1A1A',
    padding: '1rem',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },

  form: {
    display: 'flex',
    flexDirection: 'column' as const,
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

  imageWrapper: {
    position: 'relative' as const,
    width: '100%',
    height: '100%',
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
    fontSize: '2.5rem',
    margin: '0 0 1rem 0',
    color: '#39FF14',
  },

  introText: {
    fontSize: '1.25rem',
    margin: 0,
    color: '#ffffff',
    maxWidth: '800px',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingTop: '1rem',

  },
};