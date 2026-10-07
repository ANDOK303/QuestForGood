import { Router } from 'express';
import { getJuegos, getJuegoById } from '../controllers/juegosController';

const router = Router();

router.get('/', getJuegos);
router.get('/:id', getJuegoById);

export default router;