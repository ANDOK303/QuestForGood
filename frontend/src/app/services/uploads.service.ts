import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config';

@Injectable({ providedIn: 'root' })
export class UploadsService {
  constructor(private http: HttpClient) {}

  subirLogoJuego(archivo: File, nombreJuego: string): Observable<{ url: string }> {
    const datos = new FormData();
    datos.append('imagen', archivo);
    const params = new HttpParams().set('nombre', nombreJuego);
    return this.http.post<{ url: string }>(`${API_URL}/uploads/juegos`, datos, { params });
  }
}