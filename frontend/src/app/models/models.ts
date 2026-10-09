export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol_id: number;
  total_donado: string;
  foto_url?: string | null;
}

export interface CuponRegalo {
  codigo: string;
  descripcion: string;
  descuento_extra: string;
}

export interface LoginResponse {
  mensaje: string;
  token: string;
  usuario: Usuario;
  cupon_regalo: CuponRegalo | null;
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

export interface Categoria {
  id: number;
  nombre: string;
}

export interface JuegoPayload {
  categoria_id: number | null;
  nombre: string;
  descripcion: string;
  precio_original: number;
  descuento: number;
  imagen_url: string;
}

export interface CausaPayload {
  nombre: string;
  descripcion: string;
}

export interface MensajeRespuesta {
  mensaje: string;
  id?: number;
}

export interface PerfilUsuario extends Usuario {
  rol_nombre: string;
  fecha_registro: string;
}

export interface InteresJuego {
  id: number;
  nombre: string;
  imagen_url: string | null;
  precio_original: string;
  descuento: string;
  categoria_nombre: string | null;
}

export interface CompraReciente {
  id: number;
  monto_pagado: string;
  monto_donado: string;
  fecha: string;
  juego_nombre: string;
  causa_nombre: string;
}

export interface CuponUsuario {
  id: number;
  usado: number;
  fecha_obtenido: string;
  fecha_expira: string | null;
  codigo: string;
  descripcion: string;
  descuento_extra: string;
  tipo: string;
  vigente: number;
}

export interface Perfil {
  usuario: PerfilUsuario;
  resumen: { total_compras: number; total_gastado: string };
  intereses: InteresJuego[];
  compras: CompraReciente[];
  cupones: CuponUsuario[];
}