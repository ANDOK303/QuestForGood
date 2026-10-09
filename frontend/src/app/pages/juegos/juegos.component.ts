import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { JuegosService } from '../../services/juegos.service';
import { Juego } from '../../models/models';
import { resolverImagen } from '../../config';

@Component({
  selector: 'app-juegos',
  imports: [RouterLink],
  templateUrl: './juegos.component.html'
})
export class JuegosComponent implements OnInit {
  juegos = signal<Juego[]>([]);
  error = signal('');

  constructor(private juegosService: JuegosService) {}

  ngOnInit(): void {
    this.juegosService.getJuegos().subscribe({
      next: data => this.juegos.set(data),
      error: () => this.error.set('No se pudo cargar el catálogo')
    });
  }

  imagen(juego: Juego): string | null {
    return resolverImagen(juego.imagen_url);
  }

  precioFinal(juego: Juego): number {
    const precio = Number(juego.precio_original);
    return precio - precio * (Number(juego.descuento) / 100);
  }

  donacion(juego: Juego): number {
    return this.precioFinal(juego) * 0.05;
  }
}