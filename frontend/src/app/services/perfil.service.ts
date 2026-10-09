import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config';
import { MensajeRespuesta, Perfil } from '../models/models';

@Injectable({ providedIn: 'root' })
export class PerfilService {
  constructor(private http: HttpClient) {}

  getPerfil(): Observable<Perfil> {
    return this.http.get<Perfil>(`${API_URL}/perfil`);
  }

  actualizarNombre(nombre: string): Observable<{ mensaje: string; nombre: string }> {
    return this.http.put<{ mensaje: string; nombre: string }>(`${API_URL}/perfil`, { nombre });
  }

  subirFoto(archivo: File): Observable<{ mensaje: string; foto_url: string }> {
    const datos = new FormData();
    datos.append('foto', archivo);
    return this.http.post<{ mensaje: string; foto_url: string }>(`${API_URL}/perfil/foto`, datos);
  }

  quitarFoto(): Observable<MensajeRespuesta> {
    return this.http.delete<MensajeRespuesta>(`${API_URL}/perfil/foto`);
  }

  agregarInteres(juegoId: number): Observable<MensajeRespuesta> {
    return this.http.post<MensajeRespuesta>(`${API_URL}/perfil/intereses`, { juego_id: juegoId });
  }

  quitarInteres(juegoId: number): Observable<MensajeRespuesta> {
    return this.http.delete<MensajeRespuesta>(`${API_URL}/perfil/intereses/${juegoId}`);
  }
}