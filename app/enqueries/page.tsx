'use client';

import ClientLayout from '@/app/clientLayout';
import { useState } from 'react';

export default function Enqueries() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    description: '',
  });
  const [files, setFiles] = useState<FileList | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ ...formData, files: files ? Array.from(files).map(f => f.name) : [] });
    alert('Enquiry submitted!');
    setFormData({ name: '', phone: '', email: '', description: '' });
    setFiles(null);
  };

  return (
    <ClientLayout>
      <div className="wrap">
        <div className="card">
          <h2 className="title">Enquiries</h2>
          <p className="sub">Fill in your details and upload photos — we’ll get back to you soon.</p>

          <form onSubmit={handleSubmit} className="form">
            {/* Row 1 */}
            <div className="row">
              <label className="field">
                <span>Name</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                />
              </label>

              <label className="field">
                <span>Phone</span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 0400 000 000"
                  required
                />
              </label>
            </div>

            {/* Row 2 */}
            <div className="row">
              <label className="field">
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label className="field">
                <span>Photo(s)</span>

                {/* Pretty file input */}
                <div className="fileRow">
                  <input id="photos" type="file" multiple accept="image/*" onChange={handleFileChange} />
                  <label htmlFor="photos" className="fileBtn">Choose files</label>
                  <span className="fileNote">
                    {files && files.length > 0 ? `${files.length} selected` : 'No file chosen'}
                  </span>
                </div>
              </label>
            </div>

            {/* Row 3 */}
            <label className="field">
              <span>Description</span>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Describe your enquiry…"
                required
              />
            </label>

            <button type="submit" className="submit">Submit Enquiry</button>
          </form>
        </div>
      </div>

      {/* Styling that follows your NavBar CSS variables (auto-updates with dark mode) */}
      <style jsx>{`
        .wrap {
          padding: 2rem 1rem;
          color: var(--textColour);
        }
        .card {
          max-width: 820px;
          margin: 0 auto;
          background: var(--rows);
          border: 1px solid var(--bodyBackgroundBorder);
          border-radius: 16px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.18);
          padding: 2rem clamp(1rem, 3vw, 2rem);
        }
        .title {
          margin: 0 0 0.4rem 0;
          text-align: center;
          font-size: clamp(1.6rem, 2.5vw, 2rem);
          color: var(--textColour);
        }
        .sub {
          margin: 0 0 1.5rem 0;
          text-align: center;
          opacity: 0.85;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        @media (max-width: 760px) {
          .row { grid-template-columns: 1fr; }
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          font-weight: 600;
        }
        .field > span {
          color: var(--textColour);
        }

        input[type="text"],
        input[type="tel"],
        input[type="email"],
        textarea {
          background: var(--bodyBackground);
          color: var(--textColour);
          border: 1px solid var(--bodyBackgroundBorder);
          border-radius: 12px;
          padding: 0.7rem 0.9rem;
          outline: none;
          transition: border-color .15s ease, box-shadow .15s ease, background .15s ease;
        }
        input::placeholder, textarea::placeholder {
          color: color-mix(in oklab, var(--textColour) 55%, transparent);
        }
        input:focus, textarea:focus {
          border-color: var(--linkColour);
          box-shadow: 0 0 0 3px color-mix(in oklab, var(--linkColour) 25%, transparent);
        }

        /* File input visuals */
        .fileRow {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .fileRow input[type="file"] {
          position: absolute;
          opacity: 0;
          width: 0.1px;
          height: 0.1px;
          overflow: hidden;
        }
        .fileBtn {
          background: var(--tabColour);
          color: var(--textColour);
          border: 1px solid var(--bodyBackgroundBorder);
          border-radius: 10px;
          padding: 0.55rem 0.9rem;
          cursor: pointer;
          font-weight: 600;
          transition: transform .08s ease, box-shadow .15s ease, filter .15s ease;
        }
        .fileBtn:hover { box-shadow: 0 6px 18px rgba(0,0,0,0.15); transform: translateY(-1px); }
        .fileBtn:active { transform: translateY(0); box-shadow: 0 2px 8px rgba(0,0,0,0.12); }
        .fileNote { opacity: 0.8; }

        .submit {
          margin-top: 0.4rem;
          background: var(--tabColour);
          color: var(--textColour);
          border: 1px solid var(--bodyBackgroundBorder);
          border-radius: 12px;
          padding: 0.9rem 1.1rem;
          cursor: pointer;
          font-weight: 700;
          transition: transform .08s ease, box-shadow .15s ease, filter .15s ease;
        }
        .submit:hover { box-shadow: 0 10px 24px rgba(0,0,0,0.18); transform: translateY(-1px); }
        .submit:active { transform: translateY(0); box-shadow: 0 4px 12px rgba(0,0,0,0.14); }
      `}</style>
    </ClientLayout>
  );
}
