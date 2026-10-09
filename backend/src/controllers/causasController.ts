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

export const crearCausa = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nombre, descripcion } = req.body;

        if (!nombre) {
            res.status(400).json({ error: 'El nombre es obligatorio' });
            return;
        }

        const [resultado]: any = await pool.query(
            'INSERT INTO causas (nombre, descripcion) VALUES (?, ?)',
            [nombre, descripcion || null]
        );

        res.status(201).json({ mensaje: 'Causa creada', id: resultado.insertId });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizarCausa = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nombre, descripcion } = req.body;

        if (!nombre) {
            res.status(400).json({ error: 'El nombre es obligatorio' });
            return;
        }

        const [resultado]: any = await pool.query(
            'UPDATE causas SET nombre = ?, descripcion = ? WHERE id = ?',
            [nombre, descripcion || null, req.params.id]
        );

        if (resultado.affectedRows === 0) {
            res.status(404).json({ error: 'Causa no encontrada' });
            return;
        }

        res.json({ mensaje: 'Causa actualizada' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarCausa = async (req: Request, res: Response): Promise<void> => {
    try {
        const [resultado]: any = await pool.query('DELETE FROM causas WHERE id = ?', [req.params.id]);

        if (resultado.affectedRows === 0) {
            res.status(404).json({ error: 'Causa no encontrada' });
            return;
        }

        res.json({ mensaje: 'Causa eliminada' });
    } catch (error: any) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            res.status(409).json({ error: 'No se puede eliminar: la causa tiene compras asociadas' });
            return;
        }
        res.status(500).json({ error: error.message });
    }
};