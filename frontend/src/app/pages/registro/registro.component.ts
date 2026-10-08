import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  imports: [FormsModule, RouterLink],
  templateUrl: './registro.component.html'
})
export class RegistroComponent {
  nombre = '';
  correo = '';
  contrasena = '';
  error = signal('');

  constructor(private auth: AuthService, private router: Router) {}

  registrar(): void {
    this.error.set('');
    this.auth.registrar({ nombre: this.nombre, correo: this.correo, contrasena: this.contrasena }).subscribe({
      next: () => this.router.navigate(['/login']),
      error: err => this.error.set(err.error?.error || 'Error al registrarse')
    });
  }
}