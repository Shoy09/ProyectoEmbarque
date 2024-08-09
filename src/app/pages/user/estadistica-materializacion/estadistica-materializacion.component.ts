import { Component, OnInit } from '@angular/core';
import { IFlotaDPResponse, IToneladasTiempo } from 'app/core/models/t_materializadas.model';
import { FlotaService } from 'app/core/services/flota.service';
import { Chart, ChartData, ChartOptions, ChartType } from 'chart.js';
import { Utils } from './utils';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

@Component({
  selector: 'app-estadistica-materializacion',
  standalone: true,
  imports: [],
  templateUrl: './estadistica-materializacion.component.html',
  styleUrl: './estadistica-materializacion.component.css'
})
export class EstadisticaMaterializacionComponent implements OnInit {

  toneladas: IFlotaDPResponse[] = [];
  public chart!: Chart;

  constructor(private service: FlotaService) {}

  ngOnInit(): void {
    this.service.getToneladasMensualesSemanles().subscribe((data: any) => {
      console.log('Datos recibidos de la API:', data);

      // Separar datos mensuales y semanales
      const mensual = data.mensual || [];
      const semanal = data.semanal || [];

      // Procesar los datos para la gráfica
      const labelsMensuales = mensual.map((item: { month: string }, index: number) => (index + 1).toString());
      const porcentajesMensuales = mensual.map((item: { porcentaje_procesadas: string }) => parseFloat(item.porcentaje_procesadas));

      const labelsSemanales = semanal.map((item: { week: string }, index: number) => (index + 1 + mensual.length).toString());
      const porcentajesSemanales = semanal.map((item: { porcentaje_procesadas: string }) => parseFloat(item.porcentaje_procesadas));

      this.createChart(labelsMensuales, porcentajesMensuales, labelsSemanales, porcentajesSemanales);
    });
  }

  createChart(
    labelsMensuales: string[],
    porcentajesMensuales: number[],
    labelsSemanales: string[],
    porcentajesSemanales: number[]
  ): void {
    const data: ChartData<'line'> = {
      labels: [...labelsMensuales, ...labelsSemanales],
      datasets: [
        {
          label: 'Porcentaje Procesadas Mensual',
          data: porcentajesMensuales,
          borderColor: '#42A5F5',
          backgroundColor: 'rgba(66, 165, 245, 0.2)',
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          cubicInterpolationMode: 'monotone',
          tension: 0.4,
          yAxisID: 'y',
          datalabels: {
            color: '#42A5F5',
            display: true,
            formatter: (value: number) => value.toFixed(2) + '%',
            anchor: 'end',
            align: 'top',
            backgroundColor: 'rgba(66, 165, 245, 0.2)',
            borderRadius: 3,
            padding: 4,

          }
        },
        {
          label: 'Porcentaje Procesadas Semanal',
          data: porcentajesSemanales,
          borderColor: '#FF7043',
          backgroundColor: 'rgba(255, 112, 67, 0.2)',
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          cubicInterpolationMode: 'monotone',
          tension: 0.4,
          yAxisID: 'y',
          datalabels: {
            color: '#FF7043',
            display: true,
            formatter: (value: number) => value.toFixed(2) + '%',
            anchor: 'end',
            align: 'top',
            backgroundColor: 'rgba(255, 112, 67, 0.2)',
            borderRadius: 3,
            padding: 4
          }
        }
      ]
    };

    const options: ChartOptions<'line'> = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Porcentaje Toneladas Materializadas Mensual y Semanal',
          font: {
            size: 16
          }
        },
        legend: {
          position: 'top',
          labels: {
            boxWidth: 12,
            padding: 10
          }
        },
        datalabels: {
          color: '#000',
          display: true,
          formatter: (value: number) => value.toFixed(2) + '%',
          anchor: 'end',
          align: 'top',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: 4,
          padding: 6
        }
      },
      interaction: {
        intersect: false,
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Índice',
            font: {
              size: 14
            }
          },
          ticks: {
            callback: (value: string | number) => {
              return typeof value === 'number' ? value + 1 : value;
            }
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Toneladas Materializadas (%)',
            font: {
              size: 14
            }
          },
          suggestedMin: 0,
          suggestedMax: 100,
          ticks: {
            stepSize: 10
          }
        }
      }
    };

    const ctx = document.getElementById('chart') as HTMLCanvasElement;
    if (this.chart) {
      this.chart.destroy(); // Destruir el gráfico anterior si existe
    }
    this.chart = new Chart(ctx, {
      type: 'line',
      data,
      options
    });
  }
}
