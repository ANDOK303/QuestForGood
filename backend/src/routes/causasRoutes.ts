import { Router } from 'express';
import { getCausas, getCausaById, crearCausa, actualizarCausa, eliminarCausa } from '../controllers/causasController';
import { verificarToken, soloAdmin } from '../middlewares/auth';

const router = Router();

router.get('/', getCausas);
router.get('/:id', getCausaById);

router.post('/', verificarToken, soloAdmin, crearCausa);
router.put('/:id', verificarToken, soloAdmin, actualizarCausa);
router.delete('/:id', verificarToken, soloAdmin, eliminarCausa);

export default router;