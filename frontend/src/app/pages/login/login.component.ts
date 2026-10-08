import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  correo = '';
  contrasena = '';
  error = signal('');

  constructor(private auth: AuthService, private router: Router) {}

  ingresar(): void {
    this.error.set('');
    this.auth.login(this.correo, this.contrasena).subscribe({
      next: () => this.router.navigate(['/juegos']),
      error: err => this.error.set(err.error?.error || 'Error al iniciar sesión')
    });
  }
}