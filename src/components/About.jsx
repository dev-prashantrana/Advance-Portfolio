import { useContent } from '../context/ContentContext';

const About = () => {
  const { content } = useContent();
  const intro =
    content?.about?.intro ||
    'I am a passionate web developer with a keen interest in creating interactive and user-friendly web applications. Currently pursuing BCA from Amity University, expected graduation in 2027.';
  const highlights =
    content?.about?.highlights ||
    [
      'Design and develop responsive web apps',
      'Strong understanding of JavaScript and React',
      'Experience with Node.js and MongoDB',
    ];

  return (
    <section id="about" className="about-section">
      <h2>About Me</h2>
      <p className="about-intro">{intro}</p>
      <div className="about-columns">
        <div className="about-card">
          <h3>Highlights</h3>
          <ul>
            {highlights.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default About;