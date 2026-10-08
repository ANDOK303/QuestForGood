import { Response } from 'express';
import pool from '../config/db';
import { AuthRequest } from '../middlewares/auth';

export const crearCompra = async (req: AuthRequest, res: Response): Promise<void> => {
    const usuarioId = req.usuario!.id;
    const { juego_id, causa_id, metodo_pago_id } = req.body;

    if (!juego_id || !causa_id || !metodo_pago_id) {
        res.status(400).json({ error: 'Juego, causa y método de pago son obligatorios' });
        return;
    }

    const conexion = await pool.getConnection();
    try {
        const [juegos]: any = await conexion.query('SELECT * FROM juegos WHERE id = ?', [juego_id]);
        if (juegos.length === 0) {
            res.status(404).json({ error: 'Juego no encontrado' });
            return;
        }

        const juego = juegos[0];
        const precioOriginal = Number(juego.precio_original);
        const descuentoPorcentaje = Number(juego.descuento);
        const montoPagado = precioOriginal - (precioOriginal * (descuentoPorcentaje / 100));
        const montoDonado = montoPagado * 0.05;

        await conexion.beginTransaction();

        const [resultado]: any = await conexion.query(
            'INSERT INTO compras (usuario_id, juego_id, causa_id, metodo_pago_id, monto_pagado, monto_donado) VALUES (?, ?, ?, ?, ?, ?)',
            [usuarioId, juego_id, causa_id, metodo_pago_id, montoPagado, montoDonado]
        );

        await conexion.query('UPDATE causas SET total_recaudado = total_recaudado + ? WHERE id = ?', [montoDonado, causa_id]);
        await conexion.query('UPDATE usuarios SET total_donado = total_donado + ? WHERE id = ?', [montoDonado, usuarioId]);
        await conexion.query(
            'INSERT INTO notificaciones (usuario_id, mensaje) VALUES (?, ?)',
            [usuarioId, `¡Gracias por tu compra! Donaste $${montoDonado.toFixed(2)} a una buena causa.`]
        );

        await conexion.commit();

        res.status(201).json({
            mensaje: 'Compra realizada con éxito',
            compra_id: resultado.insertId,
            monto_pagado: montoPagado.toFixed(2),
            monto_donado: montoDonado.toFixed(2)
        });
    } catch (error: any) {
        await conexion.rollback();
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            res.status(400).json({ error: 'Causa o método de pago inválido' });
            return;
        }
        res.status(500).json({ error: error.message });
    } finally {
        conexion.release();
    }
};

export const getComprasPorUsuario = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const usuarioId = Number(req.params.usuarioId);

        if (req.usuario!.id !== usuarioId && req.usuario!.rol_id !== 1) {
            res.status(403).json({ error: 'No puedes ver las compras de otro usuario' });
            return;
        }

        const [rows] = await pool.query(`
            SELECT c.*, j.nombre AS juego_nombre, ca.nombre AS causa_nombre
            FROM compras c
            JOIN juegos j ON c.juego_id = j.id
            JOIN causas ca ON c.causa_id = ca.id
            WHERE c.usuario_id = ?
            ORDER BY c.fecha DESC
        `, [usuarioId]);
        res.json(rows);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};