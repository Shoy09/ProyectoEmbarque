import { Component, Input, SimpleChanges } from '@angular/core';
import { Embarcaciones } from 'app/core/models/embarcacion';
import { EmbarcacionesService } from 'app/core/services/embarcaciones.service';
import { Chart, registerables } from 'chart.js';
import { Utils } from '../../util';

Chart.register(...registerables);

@Component({
  selector: 'app-lances',
  standalone: true,
  imports: [],
  templateUrl: './lances.component.html',
  styleUrl: './lances.component.css'
})
export class LancesComponent {
  embarcaciones: Embarcaciones[] = [];
  @Input() data: any[] = [];

  constructor(
    private serviceEmbarcaciones: EmbarcacionesService,
  ){}

  public chart: Chart | undefined;

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
    const chartContainer = document.getElementById('lances');
    if (chartContainer) {
      chartContainer.style.height = '500px';
    }

    if (this.chart) {
      this.chart.destroy();
    }

    const chartData = this.getChartData();
    if (chartData.datasets.length > 0) {
      this.chart = new Chart("lances", {
        type: 'bar',
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              stacked: false,
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Precio ($)'
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Precio por Estrato y Flota'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed.y !== null) {
                    label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                  }
                  return label;
                }
              }
            },
            legend: {
              position: 'top',
            }
          }
        },
      });
    } else {
      console.error('No hay lances registrados para mostrar en el gráfico');
    }
  }

  updateChartData() {
    if (this.chart) {
      const chartData = this.getChartData();
      if (chartData.datasets.length > 0) {
        this.chart.data = chartData;
        this.chart.update();
      } else {
        this.chart.destroy();
        // No es necesario asignar undefined aquí
        console.error('No hay lances registrados para mostrar en el gráfico');
      }
    }
  }
  getChartData() {
    if (!this.data || this.data.length === 0) {
      console.error('Datos no están disponibles');
      return {
        labels: [],
        datasets: []
      };
    }

    const flotaLabels: string[] = [];
    const datasets: any[] = [];
    const estratos = new Set<string>();

    this.data.forEach(flota => {
      flota.lances.forEach((lance: any) => {
        estratos.add(lance.estrato);
      });
    });

    const estratosArray = Array.from(estratos).sort();

    this.data.forEach((flota, index) => {
      const embarcacion = this.embarcaciones.find(e => e.id === flota.embarcacion)?.nombre || 'Desconocido';
      flotaLabels.push(`${embarcacion} (${new Date(flota.fecha).toLocaleDateString()})`);

      estratosArray.forEach((estrato, estratoIndex) => {
        if (!datasets[estratoIndex]) {
          datasets[estratoIndex] = {
            label: `Estrato ${estrato}`,
            data: new Array(this.data.length).fill(null),
            backgroundColor: Utils.getColorForSpecies(estratoIndex),
            borderColor: Utils.CHART_COLORS.gris,
            borderWidth: 1
          };
        }
        const lance = flota.lances.find((l: any) => l.estrato === estrato);
        datasets[estratoIndex].data[index] = lance ? lance.precio_lances : null;
      });
    });

    return {
      labels: flotaLabels,
      datasets: datasets
    };
  }
}
