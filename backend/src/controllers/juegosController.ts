import { Request, Response } from 'express';
import pool from '../config/db';

export const getJuegos = async (req: Request, res: Response): Promise<void> => {
    try {
        const [rows] = await pool.query(`
            SELECT j.*, c.nombre AS categoria_nombre
            FROM juegos j
            LEFT JOIN categorias c ON j.categoria_id = c.id
        `);
        res.json(rows);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getJuegoById = async (req: Request, res: Response): Promise<void> => {
    try {
        const [rows]: any = await pool.query('SELECT * FROM juegos WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            res.status(404).json({ error: 'Juego no encontrado' });
            return;
        }
        res.json(rows[0]);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getCategorias = async (req: Request, res: Response): Promise<void> => {
    try {
        const [rows] = await pool.query('SELECT * FROM categorias');
        res.json(rows);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const crearJuego = async (req: Request, res: Response): Promise<void> => {
    try {
        const { categoria_id, nombre, descripcion, precio_original, descuento, imagen_url } = req.body;

        if (!nombre || precio_original === undefined) {
            res.status(400).json({ error: 'Nombre y precio son obligatorios' });
            return;
        }

        const [resultado]: any = await pool.query(
            'INSERT INTO juegos (categoria_id, nombre, descripcion, precio_original, descuento, imagen_url) VALUES (?, ?, ?, ?, ?, ?)',
            [categoria_id || null, nombre, descripcion || null, precio_original, descuento ?? 10, imagen_url || null]
        );

        res.status(201).json({ mensaje: 'Juego creado', id: resultado.insertId });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizarJuego = async (req: Request, res: Response): Promise<void> => {
    try {
        const { categoria_id, nombre, descripcion, precio_original, descuento, imagen_url } = req.body;

        if (!nombre || precio_original === undefined) {
            res.status(400).json({ error: 'Nombre y precio son obligatorios' });
            return;
        }

        const [resultado]: any = await pool.query(
            'UPDATE juegos SET categoria_id = ?, nombre = ?, descripcion = ?, precio_original = ?, descuento = ?, imagen_url = ? WHERE id = ?',
            [categoria_id || null, nombre, descripcion || null, precio_original, descuento ?? 10, imagen_url || null, req.params.id]
        );

        if (resultado.affectedRows === 0) {
            res.status(404).json({ error: 'Juego no encontrado' });
            return;
        }

        res.json({ mensaje: 'Juego actualizado' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarJuego = async (req: Request, res: Response): Promise<void> => {
    try {
        const [resultado]: any = await pool.query('DELETE FROM juegos WHERE id = ?', [req.params.id]);

        if (resultado.affectedRows === 0) {
            res.status(404).json({ error: 'Juego no encontrado' });
            return;
        }

        res.json({ mensaje: 'Juego eliminado' });
    } catch (error: any) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            res.status(409).json({ error: 'No se puede eliminar: el juego tiene compras o reseñas asociadas' });
            return;
        }
        res.status(500).json({ error: error.message });
    }
};