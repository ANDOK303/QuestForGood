import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config';
import { Compra, CompraRespuesta, NuevaCompra } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ComprasService {
  constructor(private http: HttpClient) {}

  crearCompra(datos: NuevaCompra): Observable<CompraRespuesta> {
    return this.http.post<CompraRespuesta>(`${API_URL}/compras`, datos);
  }

  getComprasPorUsuario(usuarioId: number): Observable<Compra[]> {
    return this.http.get<Compra[]>(`${API_URL}/compras/usuario/${usuarioId}`);
  }
}