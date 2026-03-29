import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { readContent, writeContent } from '../utils/contentStore.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/assets/uploads/'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const content = await readContent();
    res.json(content);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unable to load content' });
  }
});

router.put('/', requireAuth, async (req, res) => {
  try {
    const existing = await readContent();
    const updated = Object.assign({}, existing, req.body);
    await writeContent(updated);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unable to update content' });
  }
});

// Tracking visits
router.post('/visit', async (req, res) => {
  try {
    const content = await readContent();
    const stats = content.stats || { visits: 0 };
    const visitors = Array.isArray(content.visitors) ? content.visitors : [];

    const visitor = {
      id: Date.now().toString(),
      ip: req.ip || req.connection.remoteAddress || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      timestamp: new Date().toISOString(),
      referrer: req.get('Referrer') || 'direct',
    };

    const updated = {
      ...content,
      stats: {
        ...stats,
        visits: (stats.visits || 0) + 1,
      },
      visitors: [visitor, ...visitors].slice(0, 100), // Keep last 100 visitors
    };
    await writeContent(updated);
    res.json({ visits: updated.stats.visits });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unable to update visit count' });
  }
});

// Reset stats
router.post('/stats/reset', requireAuth, async (req, res) => {
  try {
    const content = await readContent();
    const updated = {
      ...content,
      stats: {
        ...content.stats,
        visits: 0,
      },
    };
    await writeContent(updated);
    res.json({ stats: updated.stats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unable to reset stats' });
  }
});

// Delete a message
router.delete('/messages/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const content = await readContent();
    const messages = Array.isArray(content.contact?.messages) ? content.contact.messages : [];
    const updatedMessages = messages.filter((msg) => msg.id !== id);
    if (updatedMessages.length === messages.length) {
      return res.status(404).json({ message: 'Message not found' });
    }

    const updated = {
      ...content,
      contact: {
        ...content.contact,
        messages: updatedMessages,
      },
    };
    await writeContent(updated);
    res.json({ message: 'Message deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unable to delete message' });
  }
});

// Clear all messages
router.post('/messages/clear', requireAuth, async (req, res) => {
  try {
    const content = await readContent();
    const updated = {
      ...content,
      contact: {
        ...content.contact,
        messages: [],
      },
    };
    await writeContent(updated);
    res.json({ message: 'Messages cleared' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unable to clear messages' });
  }
});

// File upload route
router.post('/upload', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const fileUrl = `/assets/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

export default router;
