import express from 'express';
import { Register, Delete } from '../controllers/auth.js';

const router = express.Router();

// Methods
router.post('/', Register);
router.delete('/:id', Delete);

export default router;