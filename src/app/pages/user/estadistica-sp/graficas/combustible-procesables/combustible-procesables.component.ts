import { Component, Input, SimpleChanges } from '@angular/core';
import { Embarcaciones } from 'app/core/models/embarcacion';
import { EmbarcacionesService } from 'app/core/services/embarcaciones.service';
import { Chart, ChartConfiguration, ChartDataset, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Utils } from './../../../estadistica-sp/util';

Chart.register(...registerables, ChartDataLabels);

@Component({
  selector: 'app-combustible-procesables',
  standalone: true,
  imports: [],
  templateUrl: './combustible-procesables.component.html',
  styleUrl: './combustible-procesables.component.css'
})
export class CombustibleProcesablesComponent {

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
    const chartContainer = document.getElementById('combus-tone-proce');
    if (chartContainer) {
      chartContainer.style.height = '500px';
    }

    if (this.chart) {
      this.chart.destroy();
    }

    if (this.data && this.data.length) {
      const chartData = this.getChartData();
      const config: ChartConfiguration = {
        type: 'bar',
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Consumo Combustible x Toneladas Procesables'
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        },
      };

      this.chart = new Chart("combus-tone-proce", config);
    } else {
      console.error('No hay datos disponibles para crear el gráfico');
    }
  }

  updateChartData() {
    if (this.chart) {
      const chartData = this.getChartData();
      this.chart.data = chartData;
      this.chart.update();
    }
  }

  getChartData(): ChartConfiguration['data'] {
    if (!this.data || this.data.length === 0) {
      console.error('Datos no están disponibles');
      return {
        labels: [],
        datasets: [
          {
            type: 'bar',
            label: 'Sin datos',
            data: [],
            borderColor: Utils.CHART_COLORS.azul,
            backgroundColor: Utils.transparentize(Utils.CHART_COLORS.azul, 0.5),
          }
        ]
      };
    }

    const labels = this.data.map(flota => {
      const embarcacion = this.embarcaciones.find(e => e.id === flota.embarcacion)?.nombre || 'Desconocido';
      const [year, month, day] = flota.fecha.split('-');
      const formattedDate = `${day}/${month}/${year}`;
      return `${embarcacion} - ${formattedDate}`;
    });

    const datasetDataGaso = this.data.map(flota => {
      if (flota.tipo_cambio && flota.toneladas_procesadas) {
        const value = flota.total_gasolina / flota.tipo_cambio / flota.toneladas_procesadas;
        return parseFloat(value.toFixed(2));
      } else {
        return 0;
      }
    });

    const toneladasRecibidas = this.data.map(flota => flota.toneladas_procesadas || 0);

    const datasets: ChartDataset[] = [
      {
        type: 'bar' as const,
        label: 'Toneladas Procesables',
        data: toneladasRecibidas,
        backgroundColor: Utils.CHART_COLORS.azul,
        borderColor: Utils.CHART_COLORS.azul,
        order: 1,
        datalabels: {
          color: '#fff', // Negro oscuro
          font: {
            weight: 'bold' // Negrita
          },
        }
      },
      {
        type: 'line' as const,
        label: 'Consumo de Gasolina ($)',
        data: datasetDataGaso,
        backgroundColor: Utils.transparentize(Utils.CHART_COLORS.verde, 0.5),
        borderColor: Utils.CHART_COLORS.verde,
        order: 2,
        fill: false,
        tension: 0.4,
        datalabels: {
          color: '#ffffff',
          display: true,
          formatter: (value: number) => value.toLocaleString('es-ES', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
          }),
          anchor: 'end',
          align: 'top',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: 3,
          padding: 4
        }
      }
    ];
    return {
      labels: labels,
      datasets: datasets
    };
  }

}
