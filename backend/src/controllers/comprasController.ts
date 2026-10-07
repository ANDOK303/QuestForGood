import { Request, Response } from 'express';
import pool from '../config/db';

export const crearCompra = async (req: Request, res: Response): Promise<void> => {
    try {
        const { usuario_id, juego_id, causa_id, metodo_pago_id } = req.body;

        if (!usuario_id || !juego_id || !causa_id || !metodo_pago_id) {
            res.status(400).json({ error: 'Todos los campos son obligatorios' });
            return;
        }

        const [juegos]: any = await pool.query('SELECT * FROM juegos WHERE id = ?', [juego_id]);
        if (juegos.length === 0) {
            res.status(404).json({ error: 'Juego no encontrado' });
            return;
        }

        const juego = juegos[0];
        const precioOriginal = Number(juego.precio_original);
        const descuentoPorcentaje = Number(juego.descuento);

        const montoPagado = precioOriginal - (precioOriginal * (descuentoPorcentaje / 100));
        const montoDonado = montoPagado * 0.05;

        const [resultado]: any = await pool.query(
            'INSERT INTO compras (usuario_id, juego_id, causa_id, metodo_pago_id, monto_pagado, monto_donado) VALUES (?, ?, ?, ?, ?, ?)',
            [usuario_id, juego_id, causa_id, metodo_pago_id, montoPagado, montoDonado]
        );

        await pool.query('UPDATE causas SET total_recaudado = total_recaudado + ? WHERE id = ?', [montoDonado, causa_id]);
        await pool.query('UPDATE usuarios SET total_donado = total_donado + ? WHERE id = ?', [montoDonado, usuario_id]);

        await pool.query(
            'INSERT INTO notificaciones (usuario_id, mensaje) VALUES (?, ?)',
            [usuario_id, `¡Gracias por tu compra! Donaste $${montoDonado.toFixed(2)} a una buena causa.`]
        );

        res.status(201).json({
            mensaje: 'Compra realizada con éxito',
            compra_id: resultado.insertId,
            monto_pagado: montoPagado.toFixed(2),
            monto_donado: montoDonado.toFixed(2)
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getComprasPorUsuario = async (req: Request, res: Response): Promise<void> => {
    try {
        const [rows] = await pool.query(`
            SELECT c.*, j.nombre AS juego_nombre, ca.nombre AS causa_nombre
            FROM compras c
            JOIN juegos j ON c.juego_id = j.id
            JOIN causas ca ON c.causa_id = ca.id
            WHERE c.usuario_id = ?
            ORDER BY c.fecha DESC
        `, [req.params.usuarioId]);
        res.json(rows);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
