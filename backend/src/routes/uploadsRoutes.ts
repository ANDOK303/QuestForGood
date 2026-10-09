import { Router, Request, Response, NextFunction } from 'express';
import { verificarToken, soloAdmin } from '../middlewares/auth';
import { recibirImagen, uploadJuego } from '../middlewares/upload';
import { crearSlug } from '../config/uploads';

const router = Router();

const validarNombre = (req: Request, res: Response, next: NextFunction): void => {
    if (!crearSlug(String(req.query.nombre ?? ''))) {
        res.status(400).json({ error: 'Indica el nombre del juego para guardar su logo' });
        return;
    }
    next();
};

router.post('/juegos', verificarToken, soloAdmin, validarNombre, recibirImagen(uploadJuego, 'imagen'), (req: Request, res: Response): void => {
    if (!req.file) {
        res.status(400).json({ error: 'Archivo inválido: sube una imagen PNG, JPG, WEBP o GIF de hasta 3 MB' });
        return;
    }
    res.status(201).json({ url: `/uploads/juegos/${req.file.filename}` });
});

export default router;