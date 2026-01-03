import express from 'express';

import auth from "../../middlewares/auth.middleware.js";

import { requireRole } from '../../middlewares/admin/requireRole.middleware.js';

import { getAllUsers, getUser, createUser, deleteUser } from '../../controllers/admin/users.controller.js';

const router = express.Router();

router.get('/', auth, requireRole('staff'), getAllUsers);
router.post('/', auth, requireRole('admin'), createUser);
router.get('/:id', auth, requireRole('admin'), getUser);
router.delete('/:id', auth, requireRole('admin'), deleteUser);

export default {
    prefix: '/api/admin/users',
    router: router
};