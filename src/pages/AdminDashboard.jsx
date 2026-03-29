import { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
// eslint-disable-next-line no-unused-vars
import http from '../api/http';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const { content, loading, error, reload, update } = useContent();
  const [view, setView] = useState('hero');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const section = useMemo(() => {
    if (!content) return null;

    const hero = content.hero || {};
    const about = content.about || {};
    const contact = content.contact || {};

    return {
      hero,
      about,
      contact,
      resumeUrl: content.resumeUrl || '',
      stats: content.stats || { visits: 0 },
      messages: contact.messages || [],
      visitors: content.visitors || [],
    };
  }, [content]);

  const [form, setForm] = useState({
    name: '',
    profileImage: '',
    resumeUrl: '',
    intro: '',
    phrases: '',
    aboutIntro: '',
    email: '',
    github: '',
    linkedin: '',
    twitter: '',
    instagram: '',
  });

  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    if (!section) return;
    setForm({
      name: section.hero.name || '',
      profileImage: section.hero.profileImage || '',
      resumeUrl: content.resumeUrl || '',
      intro: section.hero.intro || '',
      phrases: (section.hero.phrases || []).join(', '),
      aboutIntro: section.about.intro || '',
      email: section.contact.email || '',
      github: section.contact.socials?.github || '',
      linkedin: section.contact.socials?.linkedin || '',
      twitter: section.contact.socials?.twitter || '',
      instagram: section.contact.socials?.instagram || '',
    });
    setSkills(content.skills || []);
    setProjects(content.projects || []);
    setCertificates(content.certificates || []);
  }, [section, content]);

  const chartData = useMemo(() => {
    const visitsByDay = {};
    const messagesByDay = {};

    section?.visitors?.forEach(visitor => {
      const date = new Date(visitor.timestamp).toISOString().split('T')[0];
      visitsByDay[date] = (visitsByDay[date] || 0) + 1;
    });

    section?.messages?.forEach(msg => {
      const date = new Date(msg.createdAt).toISOString().split('T')[0];
      messagesByDay[date] = (messagesByDay[date] || 0) + 1;
    });

    const dates = new Set([...Object.keys(visitsByDay), ...Object.keys(messagesByDay)]);
    const data = Array.from(dates).sort().map(date => ({
      date,
      visits: visitsByDay[date] || 0,
      messages: messagesByDay[date] || 0,
    }));

    return data;
  }, [section]);

  const deviceData = useMemo(() => {
    const devices = {};
    section?.visitors?.forEach(visitor => {
      const ua = visitor.userAgent.toLowerCase();
      let device = 'Other';
      if (ua.includes('mobile')) device = 'Mobile';
      else if (ua.includes('tablet')) device = 'Tablet';
      else if (ua.includes('desktop') || ua.includes('windows') || ua.includes('mac')) device = 'Desktop';
      devices[device] = (devices[device] || 0) + 1;
    });
    return Object.entries(devices).map(([name, value]) => ({ name, value }));
  }, [section]);

  const token = localStorage.getItem('admin_token');
  if (!token) return <Navigate to="/admin/login" replace />;
  const updateSkill = (index, key, value) => {
    const newSkills = [...skills];
    newSkills[index][key] = value;
    setSkills(newSkills);
  };

  const addSkill = () => setSkills([...skills, { name: '', description: '', icon: '', visible: true }]);
  const removeSkill = (index) => setSkills(skills.filter((_, i) => i !== index));

  const addProject = () => setProjects([...projects, { title: '', description: '', image: '', technologies: [], links: [] }]);
  const removeProject = (index) => setProjects(projects.filter((_, i) => i !== index));
  const updateProject = (index, key, value) => {
    const newProjects = [...projects];
    if (key === 'technologies') {
      newProjects[index][key] = value.split(',').map(t => t.trim()).filter(Boolean);
    } else {
      newProjects[index][key] = value;
    }
    setProjects(newProjects);
  };
  const updateProjectLink = (index, linkIndex, key, value) => {
    const newProjects = [...projects];
    newProjects[index].links[linkIndex][key] = value;
    setProjects(newProjects);
  };
  const addProjectLink = (index) => {
    const newProjects = [...projects];
    newProjects[index].links.push({ label: '', url: '' });
    setProjects(newProjects);
  };
  const removeProjectLink = (index, linkIndex) => {
    const newProjects = [...projects];
    newProjects[index].links.splice(linkIndex, 1);
    setProjects(newProjects);
  };

  const addCertificate = () => setCertificates([...certificates, { title: '', image: '', link: '' }]);
  const removeCertificate = (index) => setCertificates(certificates.filter((_, i) => i !== index));
  const updateCertificate = (index, key, value) => {
    const newCertificates = [...certificates];
    newCertificates[index][key] = value;
    setCertificates(newCertificates);
  };

  if (loading) {
    return <p className="admin-loading">Loading content…</p>;
  }

  if (error) {
    return <p className="admin-error">Error loading content: {error.message}</p>;
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <h1>Admin Panel</h1>
        <div>
          <button className="btn alt" onClick={logout}>
            Sign out
          </button>
        </div>
      </header>

      <div className="admin-tabs">
        <button
          className={`admin-tab${view === 'hero' ? ' active' : ''}`}
          onClick={() => setView('hero')}
        >
          Hero
        </button>
        <button
          className={`admin-tab${view === 'about' ? ' active' : ''}`}
          onClick={() => setView('about')}
        >
          About
        </button>
        <button
          className={`admin-tab${view === 'skills' ? ' active' : ''}`}
          onClick={() => setView('skills')}
        >
          Skills
        </button>
        <button
          className={`admin-tab${view === 'projects' ? ' active' : ''}`}
          onClick={() => setView('projects')}
        >
          Projects
        </button>
        <button
          className={`admin-tab${view === 'certificates' ? ' active' : ''}`}
          onClick={() => setView('certificates')}
        >
          Certificates
        </button>
        <button
          className={`admin-tab${view === 'contact' ? ' active' : ''}`}
          onClick={() => setView('contact')}
        >
          Contact
        </button>
        <button
          className={`admin-tab${view === 'messages' ? ' active' : ''}`}
          onClick={() => setView('messages')}
        >
          Messages
        </button>
        <button
          className={`admin-tab${view === 'analytics' ? ' active' : ''}`}
          onClick={() => setView('analytics')}
        >
          Analytics
        </button>
      </div>

      <section className="admin-section">
        {view === 'hero' && (
          <>
            <h2>🎯 Hero Section</h2>
            <div className="form-row">
              <label>
                Name
                <div className="input-wrapper">
                  <span className="label-icon">👤</span>
                  <input value={form.name} onChange={handleChange('name')} placeholder="Your full name" />
                </div>
              </label>
              <label>
                Intro
                <div className="input-wrapper">
                  <span className="label-icon">📝</span>
                  <textarea value={form.intro} onChange={handleChange('intro')} rows={3} placeholder="Brief introduction about yourself" />
                </div>
              </label>
            </div>
            <div className="form-row single">
              <label>
                Typewriter phrases (comma separated)
                <div className="input-wrapper">
                  <span className="label-icon">💬</span>
                  <input value={form.phrases} onChange={handleChange('phrases')} placeholder="e.g., Web Developer, React Enthusiast" />
                </div>
              </label>
            </div>
            <div className="form-row">
              <label>
                Profile Image
                <div className="input-wrapper">
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange((url) => setForm(prev => ({ ...prev, profileImage: url })), e.target.files[0])} />
                </div>
                {form.profileImage && <img src={form.profileImage} alt="Profile" className="preview-image" />}
              </label>
              <label>
                Resume PDF
                <div className="input-wrapper">
                  <input type="file" accept="application/pdf" onChange={(e) => handleFileChange((url) => setForm(prev => ({ ...prev, resumeUrl: url })), e.target.files[0])} />
                </div>
                {form.resumeUrl && (
                  <a href={form.resumeUrl} target="_blank" rel="noreferrer" className="preview-link">
                    📎 Preview resume
                  </a>
                )}
              </label>
            </div>
          </>
        )}

        {view === 'about' && (
          <>
            <h2>📖 About Section</h2>
            <div className="form-row single">
              <label>
                Intro
                <div className="input-wrapper">
                  <span className="label-icon">📝</span>
                  <textarea value={form.aboutIntro} onChange={handleChange('aboutIntro')} rows={4} placeholder="Tell visitors more about yourself" />
                </div>
              </label>
            </div>
          </>
        )}

        {view === 'skills' && (
          <>
            <h2>🛠️ Skills</h2>
            {skills.map((skill, index) => (
              <div key={index} className="skill-item">
                <div className="form-row">
                  <label>
                    Name
                    <div className="input-wrapper">
                      <span className="label-icon">🏷️</span>
                      <input value={skill.name} onChange={(e) => updateSkill(index, 'name', e.target.value)} placeholder="Skill name" />
                    </div>
                  </label>
                  <label>
                    Description
                    <div className="input-wrapper">
                      <span className="label-icon">📝</span>
                      <textarea value={skill.description} onChange={(e) => updateSkill(index, 'description', e.target.value)} rows={2} placeholder="Brief description" />
                    </div>
                  </label>
                </div>
                <div className="form-row">
                  <label>
                    Icon
                    <div className="input-wrapper">
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange((url) => updateSkill(index, 'icon', url), e.target.files[0])} />
                    </div>
                    {skill.icon && <img src={skill.icon} alt="Icon" className="preview-image" />}
                  </label>
                  <div className="skill-visible">
                    <input
                      type="checkbox"
                      checked={skill.visible !== false}
                      onChange={(e) => updateSkill(index, 'visible', e.target.checked)}
                    />
                    <span>Show on portfolio</span>
                  </div>
                </div>
                <button className="btn alt remove-btn" onClick={() => removeSkill(index)}>🗑️ Remove</button>
              </div>
            ))}
            <button className="btn add-btn" onClick={addSkill}>➕ Add Skill</button>
          </>
        )}

        {view === 'projects' && (
          <>
            <h2>🚀 Projects</h2>
            {projects.map((project, index) => (
              <div key={index} className="project-item">
                <div className="form-row">
                  <label>
                    Title
                    <div className="input-wrapper">
                      <span className="label-icon">🏷️</span>
                      <input value={project.title} onChange={(e) => updateProject(index, 'title', e.target.value)} placeholder="Project title" />
                    </div>
                  </label>
                  <label>
                    Description
                    <div className="input-wrapper">
                      <span className="label-icon">📝</span>
                      <textarea value={project.description} onChange={(e) => updateProject(index, 'description', e.target.value)} rows={3} placeholder="Project description" />
                    </div>
                  </label>
                </div>
                <div className="form-row">
                  <label>
                    Image
                    <div className="input-wrapper">
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange((url) => updateProject(index, 'image', url), e.target.files[0])} />
                    </div>
                    {project.image && <img src={project.image} alt="Project" className="preview-image" />}
                  </label>
                  <label>
                    Technologies (comma separated)
                    <div className="input-wrapper">
                      <span className="label-icon">⚙️</span>
                      <input value={project.technologies.join(', ')} onChange={(e) => updateProject(index, 'technologies', e.target.value)} placeholder="React, Node.js, etc." />
                    </div>
                  </label>
                </div>
                <div className="links">
                  <h4>🔗 Links</h4>
                  {project.links.map((link, linkIndex) => (
                    <div key={linkIndex} className="link-item form-row">
                      <label>
                        Label
                        <div className="input-wrapper">
                          <span className="label-icon">🏷️</span>
                          <input value={link.label} onChange={(e) => updateProjectLink(index, linkIndex, 'label', e.target.value)} placeholder="Live Demo" />
                        </div>
                      </label>
                      <label>
                        URL
                        <div className="input-wrapper">
                          <span className="label-icon">🔗</span>
                          <input value={link.url} onChange={(e) => updateProjectLink(index, linkIndex, 'url', e.target.value)} placeholder="https://example.com" />
                        </div>
                      </label>
                      <button className="btn alt remove-btn" onClick={() => removeProjectLink(index, linkIndex)}>🗑️ Remove Link</button>
                    </div>
                  ))}
                  <button className="btn add-btn" onClick={() => addProjectLink(index)}>➕ Add Link</button>
                </div>
                <button className="btn alt remove-btn" onClick={() => removeProject(index)}>🗑️ Remove Project</button>
              </div>
            ))}
            <button className="btn add-btn" onClick={addProject}>➕ Add Project</button>
          </>
        )}

        {view === 'certificates' && (
          <>
            <h2>🏆 Certificates</h2>
            {certificates.map((cert, index) => (
              <div key={index} className="cert-item">
                <div className="form-row">
                  <label>
                    Title
                    <div className="input-wrapper">
                      <span className="label-icon">🏷️</span>
                      <input value={cert.title} onChange={(e) => updateCertificate(index, 'title', e.target.value)} placeholder="Certificate title" />
                    </div>
                  </label>
                  <label>
                    Link URL
                    <div className="input-wrapper">
                      <span className="label-icon">🔗</span>
                      <input value={cert.link} onChange={(e) => updateCertificate(index, 'link', e.target.value)} placeholder="https://certificate-link.com" />
                    </div>
                  </label>
                </div>
                <div className="form-row single">
                  <label>
                    Image
                    <div className="input-wrapper">
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange((url) => updateCertificate(index, 'image', url), e.target.files[0])} />
                    </div>
                    {cert.image && <img src={cert.image} alt="Certificate" className="preview-image" />}
                  </label>
                </div>
                <button className="btn alt remove-btn" onClick={() => removeCertificate(index)}>🗑️ Remove</button>
              </div>
            ))}
            <button className="btn add-btn" onClick={addCertificate}>➕ Add Certificate</button>
          </>
        )}

        {view === 'contact' && (
          <>
            <h2>📧 Contact Section</h2>
            <div className="form-row single">
              <label>
                Email
                <div className="input-wrapper">
                  <span className="label-icon">✉️</span>
                  <input value={form.email} onChange={handleChange('email')} type="email" placeholder="your.email@example.com" />
                </div>
              </label>
            </div>
            <div className="form-row">
              <label>
                GitHub URL
                <div className="input-wrapper">
                  <span className="label-icon">🐙</span>
                  <input value={form.github} onChange={handleChange('github')} placeholder="https://github.com/username" />
                </div>
              </label>
              <label>
                LinkedIn URL
                <div className="input-wrapper">
                  <span className="label-icon">💼</span>
                  <input value={form.linkedin} onChange={handleChange('linkedin')} placeholder="https://linkedin.com/in/username" />
                </div>
              </label>
            </div>
            <div className="form-row">
              <label>
                Twitter URL
                <div className="input-wrapper">
                  <span className="label-icon">🐦</span>
                  <input value={form.twitter} onChange={handleChange('twitter')} placeholder="https://twitter.com/username" />
                </div>
              </label>
              <label>
                Instagram URL
                <div className="input-wrapper">
                  <span className="label-icon">📸</span>
                  <input value={form.instagram} onChange={handleChange('instagram')} placeholder="https://instagram.com/username" />
                </div>
              </label>
            </div>
          </>
        )}

        {view === 'messages' && (
          <>
            <h2>💬 Messages & Stats</h2>
            <div className="admin-message-actions">
              <button className="btn alt" onClick={resetVisits} disabled={saving}>
                Reset visits
              </button>
              <button className="btn alt" onClick={clearMessages} disabled={saving}>
                Clear messages
              </button>
            </div>
            <div className="stats-chart">
              <div className="stats-bar">
                <h4>Visits</h4>
                <div className="bar" style={{ width: `${Math.min((section?.stats?.visits ?? 0) / 100, 1) * 100}%` }} />
                <div className="bar-label">Total visits: {section?.stats?.visits ?? 0}</div>
              </div>
              <div className="stats-bar">
                <h4>Messages</h4>
                <div className="bar" style={{ width: `${Math.min((section?.messages?.length ?? 0) / 25, 1) * 100}%` }} />
                <div className="bar-label">Total messages: {section?.messages?.length ?? 0}</div>
              </div>
            </div>

            <div className="messages-list">
              {section?.messages?.length ? (
                section.messages.map((msg) => (
                  <div key={msg.id} className="message-row">
                    <div className="message-header">
                      <div className="message-avatar" aria-hidden="true">
                        {msg.name
                          .split(' ')
                          .slice(0, 2)
                          .map((part) => part[0])
                          .join('')
                          .toUpperCase()}
                      </div>
                      <div className="message-meta">
                        <div className="message-sender">
                          <strong>{msg.name}</strong> <span>({msg.email})</span> {msg.number && <span>• {msg.number}</span>}
                        </div>
                        <div className="message-time">{new Date(msg.createdAt).toLocaleString()}</div>
                      </div>
                      <button className="btn alt" onClick={() => deleteMessage(msg.id)} disabled={saving}>
                        Delete
                      </button>
                    </div>
                    <div className="message-text">{msg.message}</div>
                  </div>
                ))
              ) : (
                <p>No messages yet.</p>
              )}
            </div>
          </>
        )}

        {view === 'analytics' && (
          <>
            <h2>📊 Analytics & Visitors</h2>
            <div className="charts-grid">
              <div className="chart-card">
                <h3>Visits & Messages Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="visits" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="messages" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-card">
                <h3>Device Breakdown</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <h3>Recent Visitors</h3>
            <div className="visitors-list">
              {section?.visitors?.slice(0, 20).map((visitor) => (
                <div key={visitor.id} className="visitor-card">
                  <div className="visitor-avatar">
                    👤
                  </div>
                  <div className="visitor-info">
                    <div className="visitor-ip">{visitor.ip}</div>
                    <div className="visitor-details">
                      {new Date(visitor.timestamp).toLocaleString()} • {visitor.referrer}
                    </div>
                    <div className="visitor-ua">{visitor.userAgent.slice(0, 50)}...</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {saveError && <p className="admin-error">{saveError}</p>}

        <div className="admin-actions">
          <button className="btn" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </section>
    </main>
  );
};

export default AdminDashboard;
