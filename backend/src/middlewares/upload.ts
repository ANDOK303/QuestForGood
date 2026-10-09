import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { carpetaJuegos, carpetaPerfiles, crearSlug } from '../config/uploads';

const tiposPermitidos = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

const crearUploader = (carpeta: string, nombreArchivo: (req: Request, extension: string) => string): multer.Multer => {
    fs.mkdirSync(carpeta, { recursive: true });
    return multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => cb(null, carpeta),
            filename: (req, file, cb) => cb(null, nombreArchivo(req, path.extname(file.originalname).toLowerCase()))
        }),
        limits: { fileSize: 3 * 1024 * 1024 },
        fileFilter: (req, file, cb) => cb(null, tiposPermitidos.includes(file.mimetype))
    });
};

export const uploadPerfil = crearUploader(
    carpetaPerfiles,
    (req, extension) => `${Date.now()}-${Math.round(Math.random() * 1e6)}${extension}`
);

export const uploadJuego = crearUploader(
    carpetaJuegos,
    (req, extension) => `${crearSlug(String(req.query.nombre ?? ''))}${extension}`
);

export const recibirImagen = (uploader: multer.Multer, campo: string) =>
    (req: Request, res: Response, next: NextFunction): void => {
        uploader.single(campo)(req, res, (error: unknown) => {
            if (error) {
                res.status(400).json({ error: 'Imagen inválida o mayor a 3 MB' });
                return;
            }
            next();
        });
    };