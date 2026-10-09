import path from 'path';

export const carpetaUploads = path.resolve(__dirname, '..', '..', 'uploads');
export const carpetaJuegos = path.join(carpetaUploads, 'juegos');
export const carpetaPerfiles = path.join(carpetaUploads, 'perfiles');

export const crearSlug = (texto: string): string =>
    texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
        