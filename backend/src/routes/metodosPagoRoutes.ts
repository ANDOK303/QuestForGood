import { Router } from 'express';
import { getMetodosPago } from '../controllers/metodosPagoController';

const router = Router();

router.get('/', getMetodosPago);

export default router;