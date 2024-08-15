import { Component, Input, SimpleChanges } from '@angular/core';
import { Embarcaciones } from 'app/core/models/embarcacion';
import { EmbarcacionesService } from 'app/core/services/embarcaciones.service';
import { Chart, registerables } from 'chart.js';
import { Utils } from './util';

Chart.register(...registerables);

@Component({
  selector: 'app-estadistica-toneladas',
  standalone: true,
  imports: [],
  templateUrl: './estadistica-toneladas.component.html',
  styleUrl: './estadistica-toneladas.component.css'
})
export class EstadisticaToneladasComponent {

  embarcaciones: Embarcaciones[] = [];
  @Input() data: any[] = [];

  constructor(
    private serviceEmbarcaciones: EmbarcacionesService,
  ){}

  public chart!: Chart;

  ngOnInit(): void {
    this.serviceEmbarcaciones.getEmbarcaciones().subscribe(embarcaciones => {
      this.embarcaciones = embarcaciones;
          this.createChart();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      console.log('Datos recibidos:', this.data);
      if (this.chart) {
        this.updateChartData();
      } else {
        this.createChart();
      }
    }
  }

  createChart() {
    const chartContainer = document.getElementById('tone-embarcacion');
    if (chartContainer) {
      chartContainer.style.height = '500px';  // Ajusta la altura a tu preferencia
    }

    if (this.chart) {
      this.chart.destroy();
    }
    if (this.data && this.data.length) {
      this.chart = new Chart("tone-embarcacion", {
        type: 'bar',
        data: this.getChartData(), // Usa el método getChartData() para obtener los datos
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    } else {
      console.error('No hay datos disponibles para crear el gráfico');
    }
  }

  updateChartData() {
    if (this.chart) {
      this.chart.data = this.getChartData(); // Actualiza los datos del gráfico
      this.chart.update();
    }
  }

  getChartData() {
    if (!this.data || this.data.length === 0) {
      console.error('Datos no están disponibles');
      return {
        labels: [],
        datasets: [
          {
            label: 'Sin datos',
            data: [],
            borderColor: Utils.CHART_COLORS.red,
            backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
          }
        ]
      };
    }

    const labels = this.data.map(flota => {
      const embarcacion = this.embarcaciones.find(e => e.id === flota.embarcacion)?.nombre || 'Desconocido';
      return `${embarcacion} - ${new Date(flota.fecha).toLocaleDateString()}`;
    });
    const toneRecibidas = this.data.map(flota => flota.toneladas_procesadas);
    const toneProcesadas = this.data.map(flota => flota.toneladas_recibidas);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Toneladas Recibidas (t)',
          data: toneRecibidas,
          borderColor: Utils.CHART_COLORS.red,
          backgroundColor: Utils.transparentize(Utils.CHART_COLORS.morado, 0.5),
        },
        {
          label: 'Toneladas Procesables (t)',
          data: toneProcesadas,
          borderColor: Utils.CHART_COLORS.verde,
          backgroundColor: Utils.transparentize(Utils.CHART_COLORS.naranja, 0.5),
        }
      ]
    };
  }
}
