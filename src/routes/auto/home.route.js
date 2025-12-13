import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { authMiddleware } from '../../utils/auth.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/home.html', authMiddleware, (_req, res) => {
  res.sendFile(path.join(__dirname, '../../../public/home.html'));
});

export default router;
