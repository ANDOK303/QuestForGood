import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config';
import { Categoria, Juego, JuegoPayload, MensajeRespuesta } from '../models/models';

@Injectable({ providedIn: 'root' })
export class JuegosService {
    constructor(private http: HttpClient) { }

    getJuegos(): Observable<Juego[]> {
        return this.http.get<Juego[]>(`${API_URL}/juegos`);
    }

    getJuego(id: number): Observable<Juego> {
        return this.http.get<Juego>(`${API_URL}/juegos/${id}`);
    }

    getCategorias(): Observable<Categoria[]> {
        return this.http.get<Categoria[]>(`${API_URL}/juegos/categorias`);
    }

    crearJuego(datos: JuegoPayload): Observable<MensajeRespuesta> {
        return this.http.post<MensajeRespuesta>(`${API_URL}/juegos`, datos);
    }

    actualizarJuego(id: number, datos: JuegoPayload): Observable<MensajeRespuesta> {
        return this.http.put<MensajeRespuesta>(`${API_URL}/juegos/${id}`, datos);
    }

    eliminarJuego(id: number): Observable<MensajeRespuesta> {
        return this.http.delete<MensajeRespuesta>(`${API_URL}/juegos/${id}`);
    }
}