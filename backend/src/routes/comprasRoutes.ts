import { Router } from 'express';
import { crearCompra, getComprasPorUsuario } from '../controllers/comprasController';

const router = Router();

router.post('/', crearCompra);
router.get('/usuario/:usuarioId', getComprasPorUsuario);

export default router;
