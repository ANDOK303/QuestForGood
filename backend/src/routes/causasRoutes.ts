import { Router } from 'express';
import { getCausas, getCausaById } from '../controllers/causasController';

const router = Router();

router.get('/', getCausas);
router.get('/:id', getCausaById);

export default router;