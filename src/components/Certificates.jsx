import { useContent } from '../context/ContentContext';

const Certificates = () => {
  const { content } = useContent();
  const certificates = content?.certificates || [];

  return (
    <section id="certificates" className="certificates-section">
      <h2>Certificates</h2>
      <p className="certificate-intro">Download my certificates below.</p>
      <div className="cert-grid">
        {certificates.map((cert, index) => (
          <a key={index} href={cert.link} download>{cert.title}</a>
        ))}
      </div>
    </section>
  );
};

export default Certificates;