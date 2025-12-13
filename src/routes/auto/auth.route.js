import express from 'express';
import { register, login } from '../../controllers/auth.controller.js';

const router = express.Router();

router.post('/api/register', register);
router.post('/api/login', login);

export default router;
