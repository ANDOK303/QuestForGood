import { Response } from 'express';
import path from 'path';
import fs from 'fs';
import pool from '../config/db';
import { AuthRequest } from '../middlewares/auth';
import { carpetaUploads } from '../config/uploads';

const borrarArchivo = (url: string | null): void => {
    if (!url || !url.startsWith('/uploads/')) {
        return;
    }
    const ruta = path.resolve(carpetaUploads, url.replace('/uploads/', ''));
    if (!ruta.startsWith(carpetaUploads + path.sep)) {
        return;
    }
    fs.unlink(ruta, () => undefined);
};
export const getPerfil = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const usuarioId = req.usuario!.id;

        const [usuarios]: any = await pool.query(
            `SELECT u.id, u.nombre, u.correo, u.rol_id, r.nombre AS rol_nombre,
                    u.total_donado, u.foto_url, u.fecha_registro
             FROM usuarios u
             JOIN roles r ON r.id = u.rol_id
             WHERE u.id = ?`,
            [usuarioId]
        );
        if (usuarios.length === 0) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }

        const [resumen]: any = await pool.query(
            `SELECT COUNT(*) AS total_compras, COALESCE(SUM(monto_pagado), 0) AS total_gastado
             FROM compras WHERE usuario_id = ?`,
            [usuarioId]
        );

        const [intereses] = await pool.query(
            `SELECT j.id, j.nombre, j.imagen_url, j.precio_original, j.descuento, c.nombre AS categoria_nombre
             FROM intereses i
             JOIN juegos j ON j.id = i.juego_id
             LEFT JOIN categorias c ON c.id = j.categoria_id
             WHERE i.usuario_id = ?
             ORDER BY i.fecha DESC`,
            [usuarioId]
        );

        const [compras] = await pool.query(
            `SELECT c.id, c.monto_pagado, c.monto_donado, c.fecha,
                    j.nombre AS juego_nombre, ca.nombre AS causa_nombre
             FROM compras c
             JOIN juegos j ON j.id = c.juego_id
             JOIN causas ca ON ca.id = c.causa_id
             WHERE c.usuario_id = ?
             ORDER BY c.fecha DESC
             LIMIT 5`,
            [usuarioId]
        );

        const [cupones] = await pool.query(
            `SELECT uc.id, uc.usado, uc.fecha_obtenido, uc.fecha_expira,
                    c.codigo, c.descripcion, c.descuento_extra, c.tipo,
                    (uc.usado = 0 AND (uc.fecha_expira IS NULL OR uc.fecha_expira > NOW())) AS vigente
             FROM usuarios_cupones uc
             JOIN cupones c ON c.id = uc.cupon_id
             WHERE uc.usuario_id = ?
             ORDER BY vigente DESC, uc.fecha_expira ASC`,
            [usuarioId]
        );

        res.json({ usuario: usuarios[0], resumen: resumen[0], intereses, compras, cupones });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizarPerfil = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const nombre = String(req.body.nombre ?? '').trim();

        if (!nombre || nombre.length > 100) {
            res.status(400).json({ error: 'El nombre es obligatorio y debe tener máximo 100 caracteres' });
            return;
        }

        await pool.query('UPDATE usuarios SET nombre = ? WHERE id = ?', [nombre, req.usuario!.id]);
        res.json({ mensaje: 'Perfil actualizado', nombre });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const subirFoto = async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.file) {
        res.status(400).json({ error: 'Sube una imagen PNG, JPG, WEBP o GIF de hasta 3 MB' });
        return;
    }

    const nueva = `/uploads/perfiles/${req.file.filename}`;
    try {
        const usuarioId = req.usuario!.id;
        const [rows]: any = await pool.query('SELECT foto_url FROM usuarios WHERE id = ?', [usuarioId]);
        const anterior: string | null = rows[0]?.foto_url ?? null;

        await pool.query('UPDATE usuarios SET foto_url = ? WHERE id = ?', [nueva, usuarioId]);
        borrarArchivo(anterior);

        res.json({ mensaje: 'Foto actualizada', foto_url: nueva });
    } catch (error: any) {
        borrarArchivo(nueva);
        res.status(500).json({ error: error.message });
    }
};

export const quitarFoto = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const usuarioId = req.usuario!.id;
        const [rows]: any = await pool.query('SELECT foto_url FROM usuarios WHERE id = ?', [usuarioId]);
        const anterior: string | null = rows[0]?.foto_url ?? null;

        await pool.query('UPDATE usuarios SET foto_url = NULL WHERE id = ?', [usuarioId]);
        borrarArchivo(anterior);

        res.json({ mensaje: 'Foto eliminada' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const agregarInteres = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const juegoId = Number(req.body.juego_id);

        if (!juegoId) {
            res.status(400).json({ error: 'El juego es obligatorio' });
            return;
        }

        const [juegos]: any = await pool.query('SELECT id FROM juegos WHERE id = ?', [juegoId]);
        if (juegos.length === 0) {
            res.status(404).json({ error: 'Juego no encontrado' });
            return;
        }

        await pool.query('INSERT INTO intereses (usuario_id, juego_id) VALUES (?, ?)', [req.usuario!.id, juegoId]);
        res.status(201).json({ mensaje: 'Juego agregado a tus intereses' });
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ error: 'Ese juego ya está en tu lista' });
            return;
        }
        res.status(500).json({ error: error.message });
    }
};

export const quitarInteres = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        await pool.query('DELETE FROM intereses WHERE usuario_id = ? AND juego_id = ?', [req.usuario!.id, req.params.juegoId]);
        res.json({ mensaje: 'Juego quitado de tus intereses' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};