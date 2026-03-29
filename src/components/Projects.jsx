import ProjectCard from './ProjectCard';
import { useContent } from '../context/ContentContext';

const Projects = () => {
  const { content } = useContent();
  const projects = content?.projects || [];

  return (
    <section id="projects" className="projects-section">
      <h2>Projects</h2>
      <div className="project-grid">
        {projects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>
    </section>
  );
};

export default Projects;