import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    usuario?: { id: number; rol_id: number };
}

export const verificarToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Token requerido' });
        return;
    }
    try {
        const payload = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET as string) as { id: number; rol_id: number };
        req.usuario = payload;
        next();
    } catch {
        res.status(401).json({ error: 'Token inválido o expirado' });
    }
};

export const soloAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.usuario?.rol_id !== 1) {
        res.status(403).json({ error: 'Acceso solo para administradores' });
        return;
    }
    next();
};