import { Utils } from './../estadistica-tone-proce/util';
import { Component, Input, SimpleChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-estadistica-tone-proce',
  standalone: true,
  imports: [],
  templateUrl: './estadistica-tone-proce.component.html',
  styleUrl: './estadistica-tone-proce.component.css'
})
export class EstadisticaToneProceComponent {

  @Input() data: any[] = [] //datos de estadistica-sp

  public chart!: Chart;

  ngOnInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      console.log('Datos recibidos:', this.data);
      if (this.chart) {
        this.updateTone();
      } else {
        this.createChart();
      }
    }
  }

  createChart() {
    if (this.data && this.data.length) {
      this.chart = new Chart("chartTone", {
        type: 'bar',
        data: this.getChartTone(),
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Estadísticas de Toneladas Procesadas'
            },
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true,
              ticks: {
                callback: (value) => `${value}%`
              }
            }
          }
        },
      });
    } else {
      console.error('No hay datos disponibles para crear el gráfico');
    }
  }

  updateTone(){
    if(this.chart){
      this.chart.data = this.getChartTone();
      this.chart.update();
    }
  }

  getChartTone() {
    if (!this.data || this.data.length === 0) {
      console.error('Datos no están disponibles');
      return {
        labels: [],
        datasets: [
          {
            label: 'Sin datos',
            data: [],
            backgroundColor: Utils.CHART_COLORS.red,
          }
        ]
      };
    }

    const labels = this.data.map(flota => `${flota.embarcacion || 'Desconocido'} - ${new Date(flota.fecha).toLocaleDateString()}`);
    const toneladas_procesadas = this.data.map(flota => flota.toneladas_procesadas_produccion || 0);
    const toneladas_np = this.data.map(flota => flota.toneladas_NP || 0);

    // Calcular el total de cada flota y los porcentajes
    const total_toneladas = toneladas_procesadas.map((tp, i) => tp + toneladas_np[i]);
    const porcentaje_procesadas = toneladas_procesadas.map((tp, i) => (total_toneladas[i] ? (tp / total_toneladas[i]) * 100 : 0));
    const porcentaje_np = toneladas_np.map((tnp, i) => (total_toneladas[i] ? (tnp / total_toneladas[i]) * 100 : 0));

    return {
      labels: labels,
      datasets: [
        {
          label: 'Toneladas Procesadas (%)',
          data: porcentaje_procesadas,
          backgroundColor: Utils.CHART_COLORS.blue,
        },
        {
          label: 'Toneladas NP (%)',
          data: porcentaje_np,
          backgroundColor: Utils.CHART_COLORS.red,
        },
      ]
    };
  }

}
