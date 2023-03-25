import express from 'express';
import { createUser, getUser, getUsers, deleteUser, patchUser } from '../controllers/users.js';

const router = express.Router();

// Methods
router.get('/', getUsers);
router.post('/', createUser);
router.get('/:id', getUser);
router.delete('/:id', deleteUser);
router.patch('/:id', patchUser);

export default router;