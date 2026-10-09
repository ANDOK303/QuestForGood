import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config';
import { Estadisticas } from '../models/models';

@Injectable({ providedIn: 'root' })
export class EstadisticasService {
  constructor(private http: HttpClient) {}

  getEstadisticas(): Observable<Estadisticas> {
    return this.http.get<Estadisticas>(`${API_URL}/estadisticas`);
  }
}