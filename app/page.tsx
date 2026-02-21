import ClientLayout from '@/app/clientLayout';
import Image from 'next/image';

export default function Home() {
  return (
    <ClientLayout>
      <div style={{ padding: '2rem 4rem' }}>
        {/* Section 1: Move photo slightly right */}
        <section style={styles.section}>
          <div style={styles.textLeft}>
            <h2>Welcome to Our Site</h2>
            <p>
              This is the first section of the homepage. Here you can add a short introduction,
              describe your purpose, or highlight a key feature.
            </p>
          </div>
          <div style={{ ...styles.photoWrap, ...styles.photoRight }}>
            <Image
              src="/images/photo1.png"
              alt="First section image"
              width={500}
              height={300}
              style={styles.image}
            />
          </div>
        </section>

        {/* Section 2: Move photo slightly left */}
        <section style={{ ...styles.section, flexDirection: 'row-reverse' }}>
          <div style={styles.textRight}>
            <h2>What We Offer</h2>
            <p>
              In this section, you can explain what your site or business provides. Keep it short,
              clear, and inviting for visitors to keep scrolling.
            </p>
          </div>
          <div style={{ ...styles.photoWrap, ...styles.photoLeft }}>
            <Image
              src="/images/photo2.png"
              alt="Second section image"
              width={500}
              height={300}
              style={styles.image}
            />
          </div>
        </section>

        {/* Section 3: Move photo slightly right again */}
        <section style={styles.section}>
          <div style={styles.textLeft}>
            <h2>Get in Touch</h2>
            <p>
              Finally, encourage visitors to reach out or explore more. This could include contact
              details, enquiry forms, or links to other sections of your website.
            </p>
          </div>
          <div style={{ ...styles.photoWrap, ...styles.photoRight }}>
            <Image
              src="/images/photo3.png"
              alt="Third section image"
              width={500}
              height={300}
              style={styles.image}
            />
          </div>
        </section>
      </div>
    </ClientLayout>
  );
}

const styles = {
  section: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '3rem',
    marginBottom: '4rem',
  },

  photoWrap: {
    flex: '0 0 auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
    transition: 'margin 0.3s ease',
  },

  image: {
    borderRadius: '12px',
    objectFit: 'cover' as const,
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },

  // ✨ Adjustable photo offsets
  photoLeft: {
    marginLeft: '-10px', // move photo toward left edge (negative = left, positive = right)
  },
  photoRight: {
    marginRight: '-10px', // move photo toward right edge (negative = left, positive = right)
  },

  textLeft: {
    flex: '1',
    textAlign: 'left' as const,
    maxWidth: '900px',
    marginLeft: '50px',
  },

  textRight: {
    flex: '1',
    textAlign: 'left' as const,
    maxWidth: '900px',
    marginRight: '50px',
  },
};
