import { AfterViewInit, Component, ElementRef, ViewChild, signal } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { EstadisticasService } from '../../services/estadisticas.service';
import { Estadisticas } from '../../models/models';

Chart.register(...registerables);
Chart.defaults.color = '#e8e8f0';
Chart.defaults.borderColor = '#33265a';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements AfterViewInit {
  @ViewChild('graficaCausas') graficaCausas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('graficaMeses') graficaMeses!: ElementRef<HTMLCanvasElement>;
  @ViewChild('graficaJuegos') graficaJuegos!: ElementRef<HTMLCanvasElement>;

  datos = signal<Estadisticas | null>(null);
  error = signal('');

  constructor(private estadisticasService: EstadisticasService) {}

  ngAfterViewInit(): void {
    this.estadisticasService.getEstadisticas().subscribe({
      next: data => {
        this.datos.set(data);
        this.dibujar(data);
      },
      error: () => this.error.set('No se pudieron cargar las estadísticas')
    });
  }

  private dibujar(data: Estadisticas): void {
    const colores = ['#a855f7', '#fbbf24', '#38bdf8', '#fb7185', '#34d399'];

    new Chart(this.graficaCausas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: data.porCausa.map(c => c.nombre),
        datasets: [{
          data: data.porCausa.map(c => Number(c.total_recaudado)),
          backgroundColor: colores,
          borderWidth: 0
        }]
      },
      options: { maintainAspectRatio: false }
    });

    new Chart(this.graficaMeses.nativeElement, {
      type: 'line',
      data: {
        labels: data.porMes.map(m => m.mes),
        datasets: [{
          label: 'Donado ($)',
          data: data.porMes.map(m => Number(m.total)),
          borderColor: '#6ee7b7',
          backgroundColor: 'rgba(110, 231, 183, 0.2)',
          fill: true,
          tension: 0.3
        }]
      },
      options: { maintainAspectRatio: false }
    });

    new Chart(this.graficaJuegos.nativeElement, {
      type: 'bar',
      data: {
        labels: data.topJuegos.map(j => j.nombre),
        datasets: [{
          label: 'Compras',
          data: data.topJuegos.map(j => j.ventas),
          backgroundColor: '#fbbf24'
        }]
      },
      options: {
        maintainAspectRatio: false,
        scales: { y: { ticks: { stepSize: 1 } } }
      }
    });
  }
}