import { Router } from 'express';
import { verificarToken } from '../middlewares/auth';
import { recibirImagen, uploadPerfil } from '../middlewares/upload';
import {
    getPerfil,
    actualizarPerfil,
    subirFoto,
    quitarFoto,
    agregarInteres,
    quitarInteres
} from '../controllers/perfilController';

const router = Router();

router.use(verificarToken);

router.get('/', getPerfil);
router.put('/', actualizarPerfil);
router.post('/foto', recibirImagen(uploadPerfil, 'foto'), subirFoto);
router.delete('/foto', quitarFoto);
router.post('/intereses', agregarInteres);
router.delete('/intereses/:juegoId', quitarInteres);

export default router;