import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db';

const regalarCuponLogin = async (usuarioId: number) => {
    const [hoy]: any = await pool.query(
        `SELECT uc.id
         FROM usuarios_cupones uc
         JOIN cupones c ON c.id = uc.cupon_id
         WHERE uc.usuario_id = ? AND c.tipo = 'login' AND DATE(uc.fecha_obtenido) = CURDATE()`,
        [usuarioId]
    );
    if (hoy.length > 0) {
        return null;
    }

    const [cupones]: any = await pool.query(`SELECT * FROM cupones WHERE tipo = 'login' ORDER BY RAND() LIMIT 1`);
    if (cupones.length === 0) {
        return null;
    }

    const cupon = cupones[0];
    await pool.query(
        'INSERT INTO usuarios_cupones (usuario_id, cupon_id, fecha_expira) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? DAY))',
        [usuarioId, cupon.id, cupon.dias_vigencia]
    );
    await pool.query(
        'INSERT INTO notificaciones (usuario_id, mensaje) VALUES (?, ?)',
        [usuarioId, `Recibiste el cupón ${cupon.codigo} (${Number(cupon.descuento_extra)}% extra) por iniciar sesión.`]
    );

    return {
        codigo: cupon.codigo,
        descripcion: cupon.descripcion,
        descuento_extra: cupon.descuento_extra
    };
};

export const registrar = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nombre, correo, contrasena } = req.body;

        if (!nombre || !correo || !contrasena) {
            res.status(400).json({ error: 'Todos los campos son obligatorios' });
            return;
        }

        const [existentes]: any = await pool.query('SELECT id FROM usuarios WHERE correo = ?', [correo]);
        if (existentes.length > 0) {
            res.status(409).json({ error: 'El correo ya está registrado' });
            return;
        }

        const contrasenaHash = await bcrypt.hash(contrasena, 10);

        const [resultado]: any = await pool.query(
            'INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)',
            [nombre, correo, contrasenaHash]
        );

        res.status(201).json({ mensaje: 'Usuario registrado correctamente', id: resultado.insertId });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { correo, contrasena } = req.body;

        const [rows]: any = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        if (rows.length === 0) {
            res.status(401).json({ error: 'Credenciales inválidas' });
            return;
        }

        const usuario = rows[0];
        const coincide = await bcrypt.compare(contrasena, usuario.contrasena);

        if (!coincide) {
            res.status(401).json({ error: 'Credenciales inválidas' });
            return;
        }

        const token = jwt.sign(
            { id: usuario.id, rol_id: usuario.rol_id },
            process.env.JWT_SECRET as string,
            { expiresIn: '2h' }
        );

        let cuponRegalo = null;
        try {
            cuponRegalo = await regalarCuponLogin(usuario.id);
        } catch {
            cuponRegalo = null;
        }

        res.json({
            mensaje: 'Login exitoso',
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol_id: usuario.rol_id,
                total_donado: usuario.total_donado,
                foto_url: usuario.foto_url ?? null
            },
            cupon_regalo: cuponRegalo
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};