// components/Footer.tsx
import React from "react";
import Image from "next/image";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="mt-auto" style={{ borderTop: '1px solid var(--bodyBackgroundBorder)', backgroundColor: '#0B0B0B', color: '#fff' }}>
      <div className="container py-4 d-flex flex-column flex-md-row justify-content-between gap-4">

        {/* Section 1: Logo + Social Icons */}
        <div className="d-flex flex-column align-items-start">
          <div className="mb-2">
            <a
                href="https://geckosigns.com.au/"
                target="_blank"
                rel="noopener noreferrer"
                >
                <Image
                  src="/images/GeckoSigns.jpg"
                  alt="Logo"
                  width={180}
                  height={60}
                  style={{ height: '60px', width: 'auto' }}
                />
              </a>
          </div>
          <div className="d-flex gap-2">
            <a aria-label="Milestone Banners on Facebook" href="https://www.facebook.com/Milestonebannersbygecko/" target="_blank" rel="noopener noreferrer" style={{ color: '#39FF14' }}>
              <FaFacebookF size={24} />
            </a>
            <a aria-label="Gecko Signs on Instagram" href="https://www.instagram.com/gecko_signs/" target="_blank" rel="noopener noreferrer" style={{ color: '#39FF14' }}>
              <FaInstagram size={24} />
            </a>
            <a aria-label="Email Gecko Signs" href="mailto:sam@geckosigns.net.au?subject=Banner Enquiry" style={{ color: '#39FF14' }}>
              <MdEmail size={24} />
            </a>
          </div>
        </div>

        {/* Section 2: Contact Info */}
        <div className="d-flex flex-column">
          <h5 style={{ color: '#39FF14' }}>Contact Us</h5>
          <span className="d-flex align-items-center gap-2">
            <MdPhone /> 0419 414 270
          </span>
          <span>sam@geckosigns.net.au</span>
          <span>6/91-99 Beresford Rd, Lilydale VIC 3140</span>
        </div>

        {/* Section 3: Opening Hours */}
        <div className="d-flex flex-column">
          <h5 style={{ color: '#39FF14' }}>Opening Hours</h5>
          <span>Mon – Fri: 9:00 AM – 5:00 PM</span>
          <span>Sat: Closed</span>
          <span>Sun: Closed</span>
        </div>

      </div>

      {/* Bottom Copyright */}
      <div className="text-center py-2" style={{ fontSize: '0.85rem', borderTop: '1px solid #222' }}>
        &copy; GeckoSigns
      </div>
    </footer>
  );
};

export default Footer;