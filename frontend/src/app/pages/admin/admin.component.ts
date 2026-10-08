import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JuegosService } from '../../services/juegos.service';
import { CausasService } from '../../services/causas.service';
import { Categoria, Causa, Juego, JuegoPayload } from '../../models/models';

interface JuegoForm {
  id: number | null;
  categoria_id: number | null;
  nombre: string;
  descripcion: string;
  precio_original: number;
  descuento: number;
  imagen_url: string;
}

interface CausaForm {
  id: number | null;
  nombre: string;
  descripcion: string;
}

@Component({
  selector: 'app-admin',
  imports: [FormsModule],
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {
  tab = signal<'juegos' | 'causas'>('juegos');
  juegos = signal<Juego[]>([]);
  causas = signal<Causa[]>([]);
  categorias = signal<Categoria[]>([]);
  mensaje = signal('');
  error = signal('');
  juegoForm: JuegoForm = this.juegoVacio();
  causaForm: CausaForm = this.causaVacia();

  constructor(
    private juegosService: JuegosService,
    private causasService: CausasService
  ) {}

  ngOnInit(): void {
    this.cargarJuegos();
    this.cargarCausas();
    this.juegosService.getCategorias().subscribe(data => this.categorias.set(data));
  }

  cargarJuegos(): void {
    this.juegosService.getJuegos().subscribe(data => this.juegos.set(data));
  }

  cargarCausas(): void {
    this.causasService.getCausas().subscribe(data => this.causas.set(data));
  }

  private juegoVacio(): JuegoForm {
    return { id: null, categoria_id: null, nombre: '', descripcion: '', precio_original: 0, descuento: 10, imagen_url: '' };
  }

  private causaVacia(): CausaForm {
    return { id: null, nombre: '', descripcion: '' };
  }

  private limpiar(): void {
    this.mensaje.set('');
    this.error.set('');
  }

  cambiarTab(tab: 'juegos' | 'causas'): void {
    this.limpiar();
    this.tab.set(tab);
  }

  nuevoJuego(): void {
    this.juegoForm = this.juegoVacio();
  }

  editarJuego(juego: Juego): void {
    this.limpiar();
    this.juegoForm = {
      id: juego.id,
      categoria_id: juego.categoria_id,
      nombre: juego.nombre,
      descripcion: juego.descripcion ?? '',
      precio_original: Number(juego.precio_original),
      descuento: Number(juego.descuento),
      imagen_url: juego.imagen_url ?? ''
    };
  }

  guardarJuego(): void {
    this.limpiar();
    const f = this.juegoForm;
    if (!f.nombre.trim() || f.precio_original == null || f.precio_original < 0) {
      this.error.set('Nombre y precio válido son obligatorios');
      return;
    }
    const payload: JuegoPayload = {
      categoria_id: f.categoria_id,
      nombre: f.nombre.trim(),
      descripcion: f.descripcion,
      precio_original: f.precio_original,
      descuento: f.descuento,
      imagen_url: f.imagen_url
    };
    const peticion = f.id
      ? this.juegosService.actualizarJuego(f.id, payload)
      : this.juegosService.crearJuego(payload);
    peticion.subscribe({
      next: res => {
        this.mensaje.set(res.mensaje);
        this.nuevoJuego();
        this.cargarJuegos();
      },
      error: err => this.error.set(err.error?.error || 'No se pudo guardar el juego')
    });
  }

  eliminarJuego(juego: Juego): void {
    if (!confirm(`¿Eliminar "${juego.nombre}"?`)) {
      return;
    }
    this.limpiar();
    this.juegosService.eliminarJuego(juego.id).subscribe({
      next: res => {
        this.mensaje.set(res.mensaje);
        this.cargarJuegos();
      },
      error: err => this.error.set(err.error?.error || 'No se pudo eliminar el juego')
    });
  }

  nuevaCausa(): void {
    this.causaForm = this.causaVacia();
  }

  editarCausa(causa: Causa): void {
    this.limpiar();
    this.causaForm = { id: causa.id, nombre: causa.nombre, descripcion: causa.descripcion ?? '' };
  }

  guardarCausa(): void {
    this.limpiar();
    const f = this.causaForm;
    if (!f.nombre.trim()) {
      this.error.set('El nombre es obligatorio');
      return;
    }
    const payload = { nombre: f.nombre.trim(), descripcion: f.descripcion };
    const peticion = f.id
      ? this.causasService.actualizarCausa(f.id, payload)
      : this.causasService.crearCausa(payload);
    peticion.subscribe({
      next: res => {
        this.mensaje.set(res.mensaje);
        this.nuevaCausa();
        this.cargarCausas();
      },
      error: err => this.error.set(err.error?.error || 'No se pudo guardar la causa')
    });
  }

  eliminarCausa(causa: Causa): void {
    if (!confirm(`¿Eliminar "${causa.nombre}"?`)) {
      return;
    }
    this.limpiar();
    this.causasService.eliminarCausa(causa.id).subscribe({
      next: res => {
        this.mensaje.set(res.mensaje);
        this.cargarCausas();
      },
      error: err => this.error.set(err.error?.error || 'No se pudo eliminar la causa')
    });
  }
}