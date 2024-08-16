import { Utils } from './../../../estadistica-sp/util';
import { Component, Input, SimpleChanges } from '@angular/core';
import { Embarcaciones } from 'app/core/models/embarcacion';
import { EmbarcacionesService } from 'app/core/services/embarcaciones.service';
import { Chart, ChartData, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-estadistica-costo',
  standalone: true,
  imports: [],
  templateUrl: './estadistica-costo.component.html',
  styleUrl: './estadistica-costo.component.css'
})
export class EstadisticaCostoComponent {
  embarcaciones: Embarcaciones[] = [];
  @Input() data: any[] = [];

  constructor(
    private serviceEmbarcaciones: EmbarcacionesService,
  ) {}

  public chart!: Chart<'line'>;

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

    if (this.chart) {
      this.chart.destroy();
    }

    if (this.data && this.data.length) {
      this.chart = new Chart<'line'>("costo", {
        type: 'line',
        data: this.getChartData(),
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Costo de Captura (S/.)'
            },
          },
          interaction: {
            intersect: false,
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Fecha y Embarcación'
              }
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Valor'
              },
              suggestedMin: -10,
              suggestedMax: 200
            }
          }
        },
      });
    } else {
      console.error('No hay datos disponibles para crear el gráfico');
    }
  }

  updateChartData() {
    if (this.chart) {
      this.chart.data = this.getChartData();
      this.chart.update();
    }
  }

  getChartData(): ChartData<'line'> {
    if (!this.data || this.data.length === 0) {
      console.error('Datos no están disponibles');
      return {
        labels: [],
        datasets: [
          {
            label: 'Sin datos',
            data: [],
            borderColor: Utils.CHART_COLORS.azul,
            fill: false,
          }
        ]
      };
    }

    const labels = this.data.map(flota => {
      const embarcacion = this.embarcaciones.find(e => e.id === flota.embarcacion)?.nombre || 'Desconocido';
      return `${embarcacion} - ${new Date(flota.fecha).toLocaleDateString()}`;
    });
    const costoCaptura = this.data.map(flota => {
      if (flota.tipo_cambio && flota.toneladas_procesadas) {
        const value = flota.costo_tm_captura / flota.tipo_cambio;
        return parseFloat(value.toFixed(2));
      } else {
        return 0;
      }
    });
    const costoCapturaProcesado = this.data.map(flota => {
      if (flota.tipo_cambio && flota.toneladas_procesadas) {
        const value = flota.csot / flota.tipo_cambio;
        return parseFloat(value.toFixed(2));
      } else {
        return 0;
      }
    });

    return {
      labels: labels,
      datasets: [
        {
          label: 'Costo Captura ($)',
          data: costoCaptura,
          borderColor: Utils.CHART_COLORS.azul_noche,
          fill: false,
          cubicInterpolationMode: 'monotone',
          tension: 0.4
        },
        {
          label: 'Costo Captura Procesable ($)',
          data: costoCapturaProcesado,
          borderColor: Utils.CHART_COLORS.verde,
          fill: false,
          tension: 0.4
        }
      ]
    };
  }


}
