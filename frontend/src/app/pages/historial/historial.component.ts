import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ComprasService } from '../../services/compras.service';
import { Compra } from '../../models/models';

@Component({
  selector: 'app-historial',
  imports: [DatePipe, RouterLink],
  templateUrl: './historial.component.html'
})
export class HistorialComponent implements OnInit {
  compras = signal<Compra[]>([]);
  error = signal('');

  constructor(
    private auth: AuthService,
    private comprasService: ComprasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const usuario = this.auth.usuarioActual;
    if (!usuario) {
      this.router.navigate(['/login']);
      return;
    }
    this.comprasService.getComprasPorUsuario(usuario.id).subscribe({
      next: data => this.compras.set(data),
      error: () => this.error.set('No se pudo cargar tu historial')
    });
  }

  totalDonado(): number {
    return this.compras().reduce((suma, c) => suma + Number(c.monto_donado), 0);
  }
}