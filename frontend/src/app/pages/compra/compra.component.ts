import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { JuegosService } from '../../services/juegos.service';
import { CausasService } from '../../services/causas.service';
import { MetodosPagoService } from '../../services/metodos-pago.service';
import { ComprasService } from '../../services/compras.service';
import { Causa, CompraRespuesta, Juego, MetodoPago } from '../../models/models';

@Component({
  selector: 'app-compra',
  imports: [FormsModule, RouterLink],
  templateUrl: './compra.component.html'
})
export class CompraComponent implements OnInit {
  juego = signal<Juego | null>(null);
  causas = signal<Causa[]>([]);
  metodos = signal<MetodoPago[]>([]);
  resultado = signal<CompraRespuesta | null>(null);
  error = signal('');
  causaId = 0;
  metodoId = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private juegosService: JuegosService,
    private causasService: CausasService,
    private metodosService: MetodosPagoService,
    private comprasService: ComprasService
  ) {}

  ngOnInit(): void {
    if (!this.auth.usuarioActual) {
      this.router.navigate(['/login']);
      return;
    }
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.juegosService.getJuego(id).subscribe({
      next: data => this.juego.set(data),
      error: () => this.error.set('Juego no encontrado')
    });
    this.causasService.getCausas().subscribe(data => this.causas.set(data));
    this.metodosService.getMetodosPago().subscribe(data => this.metodos.set(data));
  }

  precioFinal(): number {
    const juego = this.juego();
    if (!juego) return 0;
    const precio = Number(juego.precio_original);
    return precio - precio * (Number(juego.descuento) / 100);
  }

  donacion(): number {
    return this.precioFinal() * 0.05;
  }

  confirmar(): void {
    const usuario = this.auth.usuarioActual;
    const juego = this.juego();
    if (!usuario || !juego) return;
    if (!this.causaId || !this.metodoId) {
      this.error.set('Selecciona una causa y un método de pago');
      return;
    }
    this.error.set('');
    this.comprasService.crearCompra({
      usuario_id: usuario.id,
      juego_id: juego.id,
      causa_id: this.causaId,
      metodo_pago_id: this.metodoId
    }).subscribe({
      next: res => {
        this.resultado.set(res);
        this.auth.actualizarDonado(res.monto_donado);
      },
      error: err => this.error.set(err.error?.error || 'No se pudo completar la compra')
    });
  }
}