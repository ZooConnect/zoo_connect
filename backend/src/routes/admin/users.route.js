import express from 'express';

import auth from "../middlewares/auth.middleware.js";

import { canGetAllUsers, canCreateUser, canGetUser, canDeleteUser } from '../../middlewares/admin/users.middleware.js';

import { getAllUsers, getUser, createUser, deleteUser } from '../../controllers/admin/users.controller.js';

const router = express.Router();

router.get('/', auth, canGetAllUsers, getAllUsers);
router.post('/', auth, canCreateUser, createUser);
router.get('/:id', auth, canGetUser, getUser);
router.delete('/:id', auth, canDeleteUser, deleteUser);

export default {
    prefix: '/api/admin/users',
    router: router
};