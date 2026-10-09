import { Router } from 'express';
import { getJuegos, getJuegoById, getCategorias, crearJuego, actualizarJuego, eliminarJuego } from '../controllers/juegosController';
import { verificarToken, soloAdmin } from '../middlewares/auth';

const router = Router();

router.get('/', getJuegos);
router.get('/categorias', getCategorias);
router.get('/:id', getJuegoById);

router.post('/', verificarToken, soloAdmin, crearJuego);
router.put('/:id', verificarToken, soloAdmin, actualizarJuego);
router.delete('/:id', verificarToken, soloAdmin, eliminarJuego);

export default router;