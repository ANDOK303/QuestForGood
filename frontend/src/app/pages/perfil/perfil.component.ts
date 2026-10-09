import { Component, OnInit, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PerfilService } from '../../services/perfil.service';
import { JuegosService } from '../../services/juegos.service';
import { Juego, Perfil } from '../../models/models';
import { resolverImagen } from '../../config';

@Component({
  selector: 'app-perfil',
  imports: [FormsModule, DatePipe, DecimalPipe, RouterLink],
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {
  perfil = signal<Perfil | null>(null);
  juegos = signal<Juego[]>([]);
  mensaje = signal('');
  error = signal('');
  nombre = '';
  interesId = 0;
  foto = resolverImagen;

  constructor(
    private auth: AuthService,
    private perfilService: PerfilService,
    private juegosService: JuegosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.auth.usuarioActual) {
      this.router.navigate(['/login']);
      return;
    }
    this.cargar();
    this.juegosService.getJuegos().subscribe(data => this.juegos.set(data));
  }

  private limpiar(): void {
    this.mensaje.set('');
    this.error.set('');
  }

  cargar(): void {
    this.perfilService.getPerfil().subscribe({
      next: data => {
        this.perfil.set(data);
        this.nombre = data.usuario.nombre;
        this.auth.actualizarUsuario({
          nombre: data.usuario.nombre,
          total_donado: data.usuario.total_donado,
          foto_url: data.usuario.foto_url ?? null
        });
      },
      error: () => this.error.set('No se pudo cargar tu perfil')
    });
  }

  disponibles(): Juego[] {
    const actuales = new Set((this.perfil()?.intereses ?? []).map(i => i.id));
    return this.juegos().filter(j => !actuales.has(j.id));
  }

  guardarNombre(): void {
    this.limpiar();
    if (!this.nombre.trim()) {
      this.error.set('El nombre es obligatorio');
      return;
    }
    this.perfilService.actualizarNombre(this.nombre.trim()).subscribe({
      next: res => {
        this.mensaje.set(res.mensaje);
        this.cargar();
      },
      error: err => this.error.set(err.error?.error || 'No se pudo actualizar el nombre')
    });
  }

  cambiarFoto(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const archivo = input.files?.[0];
    if (!archivo) {
      return;
    }
    this.limpiar();
    this.perfilService.subirFoto(archivo).subscribe({
      next: res => {
        this.mensaje.set(res.mensaje);
        this.cargar();
        input.value = '';
      },
      error: err => {
        this.error.set(err.error?.error || 'No se pudo subir la foto');
        input.value = '';
      }
    });
  }

  quitarFoto(): void {
    if (!confirm('¿Quitar tu foto de perfil?')) {
      return;
    }
    this.limpiar();
    this.perfilService.quitarFoto().subscribe({
      next: res => {
        this.mensaje.set(res.mensaje);
        this.cargar();
      },
      error: err => this.error.set(err.error?.error || 'No se pudo quitar la foto')
    });
  }

  agregarInteres(): void {
    if (!this.interesId) {
      return;
    }
    this.limpiar();
    this.perfilService.agregarInteres(this.interesId).subscribe({
      next: res => {
        this.mensaje.set(res.mensaje);
        this.interesId = 0;
        this.cargar();
      },
      error: err => this.error.set(err.error?.error || 'No se pudo agregar el juego')
    });
  }

  quitarInteres(juegoId: number): void {
    this.limpiar();
    this.perfilService.quitarInteres(juegoId).subscribe({
      next: res => {
        this.mensaje.set(res.mensaje);
        this.cargar();
      },
      error: err => this.error.set(err.error?.error || 'No se pudo quitar el juego')
    });
  }
}