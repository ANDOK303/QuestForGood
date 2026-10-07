import { Request, Response } from 'express';
import pool from '../config/db';

export const getCausas = async (req: Request, res: Response): Promise<void> => {
    try {
        const [rows] = await pool.query('SELECT * FROM causas');
        res.json(rows);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getCausaById = async (req: Request, res: Response): Promise<void> => {
    try {
        const [rows]: any = await pool.query('SELECT * FROM causas WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            res.status(404).json({ error: 'Causa no encontrada' });
            return;
        }
        res.json(rows[0]);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};