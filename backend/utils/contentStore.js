import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_FILE = path.join(__dirname, '../data/content.json');

const DEFAULT_CONTENT = {
  hero: {
    name: 'Prashant Rana',
    profileImage: '',
    intro: "I'm a software developer passionate about building beautiful experiences.",
    phrases: ['Web Developer', 'React Enthusiast', 'Full-stack Dev'],
    ctaPrimary: 'Download CV',
    ctaSecondary: 'Contact Me',
  },
  about: {
    intro:
      'I am a full-stack developer with a passion for building modern web applications. I love turning ideas into products and continuously learning new technologies.',
    highlights: [
      'Design and develop responsive web apps',
      'Strong understanding of JavaScript and React',
      'Experience with Node.js and MongoDB',
    ],
  },
  skills: [],
  projects: [],
  certificates: [],
  contact: {
    email: 'dev.prashantrana@gmail.com',
    socials: {
      github: '',
      linkedin: '',
      twitter: '',
      instagram: '',
    },
    messages: [],
  },
  resumeUrl: '/assets/Certificates/Resume.pdf',
  stats: {
    visits: 0,
  },
  visitors: [],
};

async function ensureContentFile() {
  try {
    await fs.access(CONTENT_FILE);
  } catch (err) {
    await fs.mkdir(path.dirname(CONTENT_FILE), { recursive: true });
    await fs.writeFile(CONTENT_FILE, JSON.stringify(DEFAULT_CONTENT, null, 2), 'utf8');
  }
}

export async function readContent() {
  await ensureContentFile();
  const file = await fs.readFile(CONTENT_FILE, 'utf8');
  try {
    return JSON.parse(file);
  } catch (err) {
    // If JSON is invalid, overwrite with defaults
    await fs.writeFile(CONTENT_FILE, JSON.stringify(DEFAULT_CONTENT, null, 2), 'utf8');
    return DEFAULT_CONTENT;
  }
}

export async function writeContent(content) {
  await ensureContentFile();
  await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf8');
  return content;
}
