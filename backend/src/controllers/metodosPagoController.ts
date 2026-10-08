import { Request, Response } from 'express';
import pool from '../config/db';

export const getMetodosPago = async (req: Request, res: Response): Promise<void> => {
    try {
        const [rows] = await pool.query('SELECT * FROM metodos_pago');
        res.json(rows);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};