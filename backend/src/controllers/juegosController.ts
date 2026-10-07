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