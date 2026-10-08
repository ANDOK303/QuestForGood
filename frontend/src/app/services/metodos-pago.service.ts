import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config';
import { MetodoPago } from '../models/models';

@Injectable({ providedIn: 'root' })
export class MetodosPagoService {
  constructor(private http: HttpClient) {}

  getMetodosPago(): Observable<MetodoPago[]> {
    return this.http.get<MetodoPago[]>(`${API_URL}/metodos-pago`);
  }
}