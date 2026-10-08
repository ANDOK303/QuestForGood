import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config';
import { Causa } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CausasService {
  constructor(private http: HttpClient) {}

  getCausas(): Observable<Causa[]> {
    return this.http.get<Causa[]>(`${API_URL}/causas`);
  }
}