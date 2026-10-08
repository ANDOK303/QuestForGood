import { Request, Response } from 'express';
import pool from '../config/db';

export const getEstadisticas = async (req: Request, res: Response): Promise<void> => {
    try {
        const [resumen]: any = await pool.query(`
            SELECT
                COUNT(*) AS total_compras,
                COALESCE(SUM(monto_pagado), 0) AS total_pagado,
                COALESCE(SUM(monto_donado), 0) AS total_donado
            FROM compras
        `);

        const [porCausa] = await pool.query(`
            SELECT nombre, total_recaudado FROM causas ORDER BY total_recaudado DESC
        `);

        const [porMes] = await pool.query(`
            SELECT DATE_FORMAT(fecha, '%Y-%m') AS mes, SUM(monto_donado) AS total
            FROM compras
            GROUP BY DATE_FORMAT(fecha, '%Y-%m')
            ORDER BY mes
        `);

        const [topJuegos] = await pool.query(`
            SELECT j.nombre, COUNT(*) AS ventas
            FROM compras c
            JOIN juegos j ON c.juego_id = j.id
            GROUP BY j.id, j.nombre
            ORDER BY ventas DESC
            LIMIT 5
        `);

        res.json({ resumen: resumen[0], porCausa, porMes, topJuegos });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};