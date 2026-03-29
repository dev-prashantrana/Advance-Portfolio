import express from 'express';
import { readContent, writeContent } from '../utils/contentStore.js';

const router = express.Router();

// Store a contact message
router.post('/', async (req, res) => {
  try {
    const { name, email, number, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required.' });
    }

    const content = await readContent();
    const messages = Array.isArray(content.contact?.messages) ? content.contact.messages : [];

    const newMessage = {
      id: Date.now().toString(),
      name,
      email,
      number: number || '',
      message,
      createdAt: new Date().toISOString(),
    };

    const updated = {
      ...content,
      contact: {
        ...content.contact,
        messages: [newMessage, ...messages],
      },
    };

    await writeContent(updated);
    res.status(201).json({ message: 'Message saved', data: newMessage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unable to save message' });
  }
});

export default router;
