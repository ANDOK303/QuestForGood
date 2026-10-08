import { Router } from 'express';
import { crearCompra, getComprasPorUsuario } from '../controllers/comprasController';
import { verificarToken } from '../middlewares/auth';

const router = Router();

router.post('/', verificarToken, crearCompra);
router.get('/usuario/:usuarioId', verificarToken, getComprasPorUsuario);

export default router;