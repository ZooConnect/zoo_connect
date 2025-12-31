import express from 'express';
<<<<<<< HEAD
import { getAllUsers } from '../../controllers/admin/users.controller.js';

const router = express.Router();

=======
import { getAllUsers } from '../../controllers/admin/user.controller.js';

const router = express.Router();
>>>>>>> d4059f5331c357aae44f5f72a7d7fa299d13b663
router.get('/', getAllUsers); 

export default {
    prefix: '/api/admin/users',
    router: router
};