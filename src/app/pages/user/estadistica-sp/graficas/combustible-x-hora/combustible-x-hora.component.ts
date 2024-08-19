import { Utils } from './../../../estadistica-sp/util';
import { Component, Input, SimpleChanges } from '@angular/core';
import { Embarcaciones } from 'app/core/models/embarcacion';
import { EmbarcacionesService } from 'app/core/services/embarcaciones.service';
import { Chart, ChartConfiguration, ChartDataset, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(...registerables, ChartDataLabels);

@Component({
  selector: 'app-combustible-x-hora',
  standalone: true,
  imports: [],
  templateUrl: './combustible-x-hora.component.html',
  styleUrl: './combustible-x-hora.component.css'
})
export class CombustibleXHoraComponent {

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
    const chartContainer = document.getElementById('combus-hora');
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
              text: 'Combustible x Hora en Toneladas Recibidas'
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        },
      };

      this.chart = new Chart("combus-hora", config);
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

    const combustiblexHora = this.data.map(flota => flota.galon_hora);

    const toneladasRecibidas = this.data.map(flota => flota.toneladas_recibidas || 0);

    const datasets: ChartDataset[] = [
      {
        type: 'bar' as const,
        label: 'Toneladas Recibidas',
        data: toneladasRecibidas,
        backgroundColor: 'rgba(174, 185, 196, 0.5)', // Azul celeste con 50% de opacidad
        borderColor: 'rgba(174, 185, 196, 0.5)',     // Azul celeste con 50% de opacidad
        order: 1,
        datalabels: {
          color: '#333333', // Negro oscuro
          font: {
            weight: 'bold' // Negrita
          },
        }
    },
      {
        type: 'line' as const,
        label: 'Galon de Combustible x Hora',
        data: combustiblexHora,
        backgroundColor: Utils.transparentize(Utils.CHART_COLORS.verde, 0.5),
        borderColor: Utils.CHART_COLORS.verde,
        order: 2,
        fill: false,
        tension: 0.4,
        datalabels: {
          color: '#ffffff',
          display: true,
          formatter: (value) => `${value} (gal)`,
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
