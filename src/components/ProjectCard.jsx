const ProjectCard = ({ image, title, description, technologies, links }) => {
  const demoLink = links.find((link) => link.label.toLowerCase().includes('demo'))?.url || links[0]?.url;

  return (
    <div className="project-card">
      <a href={demoLink} target="_blank" rel="noopener noreferrer">
        <img src={image} alt={title} />
      </a>
      <div className="project-details">
        <h3>{title}</h3>
        <p>{description}</p>
        <ul className="tech-tags">
          {technologies.map((tech, index) => (
            <li key={index}>{tech}</li>
          ))}
        </ul>
        <div className="project-links">
          {links.map((link, index) => (
            <a key={index} href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;