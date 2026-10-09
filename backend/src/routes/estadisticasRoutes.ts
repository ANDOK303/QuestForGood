import { Router } from 'express';
import { getEstadisticas } from '../controllers/estadisticasController';

const router = Router();

router.get('/', getEstadisticas);

export default router;