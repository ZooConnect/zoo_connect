import express from 'express';
import { getAllUsers } from '../../controllers/admin/users.controller.js';

const router = express.Router();

router.get('/', getAllUsers); 

export default {
    prefix: '/api/admin/users',
    router: router
};