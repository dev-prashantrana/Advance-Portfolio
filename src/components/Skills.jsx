import FlipCard from './FlipCard';
import { useContent } from '../context/ContentContext';

const Skills = () => {
  const { content } = useContent();
  const skills = (content?.skills || []).filter((skill) => skill.visible !== false);

  return (
    <section id="skills" className="skills-section">
      <h2>Skills</h2>
      <div className="skills-grid">
        {skills.map((skill, index) => (
          <FlipCard key={index} {...skill} />
        ))}
      </div>
    </section>
  );
};

export default Skills;