import fs from 'fs';
import path from 'path';
import pool from '../config/db';
import { carpetaJuegos, crearSlug } from '../config/uploads';

export const sincronizarLogos = async (): Promise<number> => {
    if (!fs.existsSync(carpetaJuegos)) {
        return 0;
    }

    const archivos = fs.readdirSync(carpetaJuegos);
    if (archivos.length === 0) {
        return 0;
    }

    const [juegos]: any = await pool.query('SELECT id, nombre, imagen_url FROM juegos');
    let asignados = 0;

    for (const juego of juegos) {
        if (juego.imagen_url) {
            continue;
        }
        const slug = crearSlug(juego.nombre);
        const archivo = archivos.find(a => path.parse(a).name === slug);
        if (archivo) {
            await pool.query('UPDATE juegos SET imagen_url = ? WHERE id = ?', [`/uploads/juegos/${archivo}`, juego.id]);
            asignados++;
        }
    }

    return asignados;
};