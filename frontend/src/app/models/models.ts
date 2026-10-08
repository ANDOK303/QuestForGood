export interface Usuario {
    id: number;
    nombre: string;
    correo: string;
    rol_id: number;
    total_donado: string;
}

export interface LoginResponse {
    mensaje: string;
    token: string;
    usuario: Usuario;
}

export interface Juego {
    id: number;
    categoria_id: number;
    nombre: string;
    descripcion: string;
    precio_original: string;
    descuento: string;
    imagen_url: string | null;
    categoria_nombre?: string;
}

export interface Causa {
    id: number;
    nombre: string;
    descripcion: string;
    total_recaudado: string;
}

export interface NuevaCompra {
    usuario_id: number;
    juego_id: number;
    causa_id: number;
    metodo_pago_id: number;
}

export interface CompraRespuesta {
    mensaje: string;
    compra_id: number;
    monto_pagado: string;
    monto_donado: string;
}

export interface Compra {
    id: number;
    usuario_id: number;
    juego_id: number;
    causa_id: number;
    metodo_pago_id: number;
    monto_pagado: string;
    monto_donado: string;
    fecha: string;
    juego_nombre: string;
    causa_nombre: string;
}
export interface MetodoPago {
    id: number;
    nombre: string;
}
export interface Estadisticas {
  resumen: { total_compras: number; total_pagado: string; total_donado: string };
  porCausa: { nombre: string; total_recaudado: string }[];
  porMes: { mes: string; total: string }[];
  topJuegos: { nombre: string; ventas: number }[];
}