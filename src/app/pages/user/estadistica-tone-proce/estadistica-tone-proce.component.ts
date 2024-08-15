import { Embarcaciones } from 'app/core/models/embarcacion';
import { Utils } from './../estadistica-tone-proce/util';
import { Component, Input, SimpleChanges } from '@angular/core';
import { EmbarcacionesService } from 'app/core/services/embarcaciones.service';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(...registerables);
Chart.register(ChartDataLabels);


@Component({
  selector: 'app-estadistica-tone-proce',
  standalone: true,
  imports: [],
  templateUrl: './estadistica-tone-proce.component.html',
  styleUrl: './estadistica-tone-proce.component.css'
})
export class EstadisticaToneProceComponent {

  embarcaciones: Embarcaciones[] = [];
  @Input() data: any[] = [] //datos de estadistica-sp

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
        this.updateTone();
      } else {
        this.createChart();
      }
    }
  }

  createChart() {
    const chartContainer = document.getElementById('chartTone');
    if (chartContainer) {
      chartContainer.style.height = '500px';  // Ajusta la altura a tu preferencia
    }

    if (this.chart) {
      this.chart.destroy();
    }
    if (this.data && this.data.length) {
      this.chart = new Chart("chartTone", {
        type: 'bar',
        data: this.getChartTone(),
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Estadísticas de Toneladas Procesadas Producción'
            },
            datalabels: {
              color: '#fff',
              display: true,
              formatter: (value) => `${value}%`, // Mostrar el símbolo '%' en las etiquetas de datos
            }
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
                callback: (value) => `${value}%` // Mostrar el símbolo '%' en el eje y
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

    const labels = this.data.map(flota => {
      const embarcacion = this.embarcaciones.find(e => e.id === flota.embarcacion)?.nombre || 'Desconocido';
      return `${embarcacion} - ${new Date(flota.fecha).toLocaleDateString()}`;
    });
    const toneladas_procesadas = this.data.map(flota => flota.toneladas_procesadas_produccion || 0);
    const toneladas_np = this.data.map(flota => flota.toneladas_NP || 0);

    // Calcular el total de cada flota y los porcentajes
    const total_toneladas = toneladas_procesadas.map((tp, i) => tp + toneladas_np[i]);
    const porcentaje_procesadas = toneladas_procesadas.map((tp, i) => total_toneladas[i] ? +( (tp / total_toneladas[i]) * 100 ).toFixed(2) : 0);
    const porcentaje_np = toneladas_np.map((tnp, i) => total_toneladas[i] ? +( (tnp / total_toneladas[i]) * 100 ).toFixed(2) : 0);

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
