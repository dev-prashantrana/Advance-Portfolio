import { useEffect, useState } from 'react';
import { useContent } from '../context/ContentContext';

const Hero = () => {
  const { content } = useContent();
  const name = content?.hero?.name || 'Prashant Rana';
  const intro = content?.hero?.intro || "I'm a software developer passionate about building beautiful experiences.";
  const profileImage = content?.hero?.profileImage || '/assets/Prashant-Rana.png';
  const phrases = content?.hero?.phrases || ['a Web Developer', 'a Software Developer', 'a UI/UX Designer'];
  const [currentText, setCurrentText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const items = [name, ...phrases];
    const text = items[textIndex % items.length];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setCurrentText(text.slice(0, currentText.length + 1));
        if (currentText === text) {
          setIsDeleting(true);
          setTimeout(() => setIsDeleting(false), 1200);
        }
      } else {
        setCurrentText(text.slice(0, currentText.length - 1));
        if (currentText === '') {
          setTextIndex((textIndex + 1) % items.length);
          setIsDeleting(false);
        }
      }
    }, isDeleting ? 80 : 160);
    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, textIndex, name, phrases]);

  const resumeUrl = content?.resumeUrl || '/assets/Certificates/Resume.pdf';

  return (
    <section id="home" className="hero">
      <div className="hero-wrapper">
        <div className="hero-image">
          <img src={profileImage} alt={name} />
        </div>
        <div className="hero-content">
          <h1>Hi, I'm <span id="typed-text">{currentText}</span></h1>
          <p className="hero-intro">{intro}</p>
          <div className="hero-buttons">
            <button className="btn" onClick={() => scrollToSection('projects')}>View Projects</button>
            <a href={resumeUrl} download className="btn alt">Download Resume</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;