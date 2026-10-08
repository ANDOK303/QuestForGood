import { Router, Request, Response } from 'express';
import { upload } from '../middlewares/upload';
import { verificarToken } from '../middlewares/auth';

const router = Router();

router.post('/', verificarToken, upload.single('imagen'), (req: Request, res: Response): void => {
    if (!req.file) {
        res.status(400).json({ error: 'Archivo inválido: sube una imagen PNG, JPG, WEBP o GIF de hasta 3 MB' });
        return;
    }
    res.status(201).json({ url: `/uploads/${req.file.filename}` });
});

export default router;