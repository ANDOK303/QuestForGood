import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { API_URL } from '../config';
import { LoginResponse, Usuario } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private usuarioSubject = new BehaviorSubject<Usuario | null>(this.leerUsuario());
  usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient) {}

  registrar(datos: { nombre: string; correo: string; contrasena: string }): Observable<{ mensaje: string; id: number }> {
    return this.http.post<{ mensaje: string; id: number }>(`${API_URL}/usuarios/registro`, datos);
  }

  login(correo: string, contrasena: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_URL}/usuarios/login`, { correo, contrasena }).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
        this.usuarioSubject.next(res.usuario);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.usuarioSubject.next(null);
  }

  actualizarUsuario(cambios: Partial<Usuario>): void {
    const usuario = this.usuarioSubject.value;
    if (!usuario) {
      return;
    }
    const actualizado = { ...usuario, ...cambios };
    localStorage.setItem('usuario', JSON.stringify(actualizado));
    this.usuarioSubject.next(actualizado);
  }

  actualizarDonado(monto: string): void {
    const usuario = this.usuarioSubject.value;
    if (!usuario) {
      return;
    }
    this.actualizarUsuario({ total_donado: (Number(usuario.total_donado) + Number(monto)).toFixed(2) });
  }

  get usuarioActual(): Usuario | null {
    return this.usuarioSubject.value;
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  private leerUsuario(): Usuario | null {
    const guardado = localStorage.getItem('usuario');
    return guardado ? JSON.parse(guardado) : null;
  }
}