import multer from 'multer';
import path from 'path';
import fs from 'fs';

const carpeta = path.join(__dirname, '..', '..', 'uploads');
fs.mkdirSync(carpeta, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, carpeta),
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${extension}`);
    }
});

export const upload = multer({
    storage,
    limits: { fileSize: 3 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const permitidos = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
        cb(null, permitidos.includes(file.mimetype));
    }
});