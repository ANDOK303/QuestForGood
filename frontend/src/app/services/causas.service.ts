import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config';
import { Causa, CausaPayload, MensajeRespuesta } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CausasService {
    constructor(private http: HttpClient) { }

    getCausas(): Observable<Causa[]> {
        return this.http.get<Causa[]>(`${API_URL}/causas`);
    }

    crearCausa(datos: CausaPayload): Observable<MensajeRespuesta> {
        return this.http.post<MensajeRespuesta>(`${API_URL}/causas`, datos);
    }

    actualizarCausa(id: number, datos: CausaPayload): Observable<MensajeRespuesta> {
        return this.http.put<MensajeRespuesta>(`${API_URL}/causas/${id}`, datos);
    }

    eliminarCausa(id: number): Observable<MensajeRespuesta> {
        return this.http.delete<MensajeRespuesta>(`${API_URL}/causas/${id}`);
    }
}