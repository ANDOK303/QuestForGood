import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config';

@Injectable({ providedIn: 'root' })
export class UploadsService {
  constructor(private http: HttpClient) {}

  subirImagen(archivo: File): Observable<{ url: string }> {
    const datos = new FormData();
    datos.append('imagen', archivo);
    return this.http.post<{ url: string }>(`${API_URL}/uploads`, datos);
  }
}