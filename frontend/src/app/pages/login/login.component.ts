import { Component, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CuponRegalo } from '../../models/models';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, DecimalPipe],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  correo = '';
  contrasena = '';
  error = signal('');
  cupon = signal<CuponRegalo | null>(null);

  constructor(private auth: AuthService, private router: Router) {}

  ingresar(): void {
    this.error.set('');
    this.auth.login(this.correo, this.contrasena).subscribe({
      next: res => {
        if (res.cupon_regalo) {
          this.cupon.set(res.cupon_regalo);
          return;
        }
        this.router.navigate(['/juegos']);
      },
      error: err => this.error.set(err.error?.error || 'Error al iniciar sesión')
    });
  }

  continuar(): void {
    this.router.navigate(['/juegos']);
  }
}