import { useState } from 'react';
import { useContent } from '../context/ContentContext';
import http from '../api/http';

const Contact = () => {
  const { content } = useContent();
  const email = content?.contact?.email || 'prashant@example.com';
  const socials = content?.contact?.socials || {};
  const [form, setForm] = useState({ name: '', email: '', number: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading' });

    try {
      await http.post('/contact', form);
      setStatus({ type: 'success', message: 'Message sent! I will respond soon.' });
      setForm({ name: '', email: '', number: '', message: '' });
    } catch (_) {
      setStatus({ type: 'error', message: 'Failed to send message. Please try again.' });
    }
  };

  return (
    <>
      <section id="contact" className="contact-section">
        <h2>Contact Me</h2>
        <form onSubmit={handleSubmit} className="contact-form">
          <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input type="tel" name="number" placeholder="Phone Number" value={form.number} onChange={handleChange} />
          <textarea name="message" placeholder="Message" value={form.message} onChange={handleChange} required rows={5} />
          <button type="submit">Send Message</button>
          {status?.type === 'success' && <p className="contact-success">{status.message}</p>}
          {status?.type === 'error' && <p className="contact-error">{status.message}</p>}
        </form>
      </section>

      <footer className="footer">
        <h2 className="footer-title">Let's Connect</h2>
        <p className="footer-text">Feel free to reach out for collaborations or just a friendly chat.</p>
        <div className="footer-email">Email: <a href={`mailto:${email}`}>{email}</a></div>
        <div className="footer-socials">
          <a href={socials.github || '#'} className="social-icon" aria-label="GitHub">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0.297C5.373 0.297 0 5.67 0 12.297c0 5.292 3.438 9.785 8.205 11.385.6.111.82-.261.82-.58 0-.287-.011-1.244-.017-2.252-3.338.726-4.042-1.609-4.042-1.609-.546-1.387-1.333-1.757-1.333-1.757-1.089-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.833 2.809 1.303 3.495.997.108-.775.418-1.303.76-1.603-2.665-.305-5.466-1.333-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.958-.266 1.984-.399 3.005-.404 1.02.005 2.047.138 3.006.404 2.289-1.553 3.295-1.23 3.295-1.23.655 1.653.243 2.873.12 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.804 5.623-5.475 5.92.43.37.814 1.102.814 2.222 0 1.605-.014 2.898-.014 3.293 0 .321.216.694.825.576C20.565 22.077 24 17.586 24 12.297 24 5.67 18.627.297 12 .297z"/>
            </svg>
          </a>
          <a href={socials.linkedin || '#'} className="social-icon" aria-label="LinkedIn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.026-3.037-1.85-3.037-1.851 0-2.134 1.445-2.134 2.939v5.667h-3.554V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.369-1.85 3.602 0 4.268 2.369 4.268 5.455v6.286zM5.337 7.433a2.069 2.069 0 1 1 0-4.138 2.069 2.069 0 0 1 0 4.138zm1.777 13.019H3.561V9h3.553v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.543C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.273V1.729C24 .774 23.2 0 22.225 0z"/>
            </svg>
          </a>
          <a href={socials.twitter || '#'} className="social-icon" aria-label="Twitter">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.954 4.569c-.885.393-1.83.657-2.825.775 1.014-.608 1.794-1.574 2.163-2.723-.949.556-2.003.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.317-3.809 2.103-6.102 2.103-.396 0-.779-.023-1.17-.069 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.496 14-13.986 0-.21 0-.42-.015-.63.961-.69 1.8-1.56 2.46-2.548l-.047-.02z"/>
            </svg>
          </a>
          <a href={socials.instagram || '#'} className="social-icon" aria-label="Instagram">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.33 3.608 1.305.975.975 1.243 2.242 1.305 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.33 2.633-1.305 3.608-.975.975-2.242 1.243-3.608 1.305-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.33-3.608-1.305-.975-.975-1.243-2.242-1.305-3.608C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.062-1.366.33-2.633 1.305-3.608.975-.975 2.242-1.243 3.608-1.305C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.77.131 4.665.375 3.68 1.36 2.695 2.345 2.451 3.45 2.392 4.732 2.333 6.012 2.32 6.421 2.32 10.68s.013 4.668.072 5.948c.059 1.282.303 2.387 1.288 3.372.985.985 2.09 1.229 3.372 1.288 1.28.059 1.689.072 5.948.072s4.668-.013 5.948-.072c1.282-.059 2.387-.303 3.372-1.288.985-.985 1.229-2.09 1.288-3.372.059-1.28.072-1.689.072-5.948s-.013-4.668-.072-5.948c-.059-1.282-.303-2.387-1.288-3.372-.985-.985-2.09-1.229-3.372-1.288C16.668.013 16.259 0 12 0z"/>
              <path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162S8.597 18.162 12 18.162 18.162 15.403 18.162 12 15.403 5.838 12 5.838zm0 10.162c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z"/>
              <circle cx="18.406" cy="5.594" r="1.44"/>
            </svg>
          </a>
        </div>
        <p className="footer-copy">© 2026 Prashant Rana. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Contact;