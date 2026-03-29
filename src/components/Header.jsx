import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('admin_token');
  const inAdmin = location.pathname.startsWith('/admin');

  const toggle = () => setOpen((o) => !o);
  const close = () => setOpen(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    close();
  };

  const goHome = () => {
    if (inAdmin) {
      navigate('/');
      setTimeout(() => scrollToSection('home'), 50);
    } else {
      scrollToSection('home');
    }
  };

  const goToSection = (id) => {
    if (inAdmin) {
      navigate('/');
      setTimeout(() => scrollToSection(id), 50);
    } else {
      scrollToSection(id);
    }
  };

  const goAdmin = () => {
    if (token) {
      navigate('/admin/dashboard');
    } else {
      navigate('/admin/login');
    }
    close();
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="logo">Prashant Rana</div>
        <button
          className={`nav-toggle${open ? ' open' : ''}`}
          onClick={toggle}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
          <span className="nav-toggle-label">Menu</span>
        </button>
        <ul className={`nav-links${open ? ' open' : ''}`}>
          <li><button onClick={goHome}>Home</button></li>
          <li><button onClick={() => goToSection('about')}>About</button></li>
          <li><button onClick={() => goToSection('skills')}>Skills</button></li>
          <li><button onClick={() => goToSection('projects')}>Projects</button></li>
          <li><button onClick={() => goToSection('certificates')}>Certificates</button></li>
          <li><button onClick={() => goToSection('contact')}>Contact</button></li>
          <li><button onClick={goAdmin}>Admin</button></li>
        </ul>
      </div>
    </header>
  );
};

export default Header;