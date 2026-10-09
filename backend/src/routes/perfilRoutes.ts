import { Router, Request, Response, NextFunction } from 'express';
import { verificarToken } from '../middlewares/auth';
import { upload } from '../middlewares/upload';
import {
    getPerfil,
    actualizarPerfil,
    subirFoto,
    quitarFoto,
    agregarInteres,
    quitarInteres
} from '../controllers/perfilController';

const router = Router();

const recibirFoto = (req: Request, res: Response, next: NextFunction): void => {
    upload.single('foto')(req, res, (error: unknown) => {
        if (error) {
            res.status(400).json({ error: 'Imagen inválida o mayor a 3 MB' });
            return;
        }
        next();
    });
};

router.use(verificarToken);

router.get('/', getPerfil);
router.put('/', actualizarPerfil);
router.post('/foto', recibirFoto, subirFoto);
router.delete('/foto', quitarFoto);
router.post('/intereses', agregarInteres);
router.delete('/intereses/:juegoId', quitarInteres);

export default router;