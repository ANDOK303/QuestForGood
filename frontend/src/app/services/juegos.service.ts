import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config';
import { Juego } from '../models/models';

@Injectable({ providedIn: 'root' })
export class JuegosService {
    constructor(private http: HttpClient) { }

    getJuegos(): Observable<Juego[]> {
        return this.http.get<Juego[]>(`${API_URL}/juegos`);
    }

    getJuego(id: number): Observable<Juego> {
        return this.http.get<Juego>(`${API_URL}/juegos/${id}`);
    }
}