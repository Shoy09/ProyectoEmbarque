import { Component, Input, SimpleChanges } from '@angular/core';
import { Embarcaciones } from 'app/core/models/embarcacion';
import { EmbarcacionesService } from 'app/core/services/embarcaciones.service';
import { Chart, registerables } from 'chart.js';
import { Utils } from './../../../estadistica-sp/util';

Chart.register(...registerables);

@Component({
  selector: 'app-toneladas-especies',
  standalone: true,
  imports: [],
  templateUrl: './toneladas-especies.component.html',
  styleUrl: './toneladas-especies.component.css'
})
export class ToneladasEspeciesComponent {

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
              text: 'Toneladas de especies'
            },
            datalabels: {
              color: '#fff',
              display: true,
              formatter: (value) => `${value} t`, // Mostrar el símbolo '%' en las etiquetas de datos
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
                callback: (value) => `${value} t` // Mostrar el símbolo '%' en el eje y
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
            backgroundColor: Utils.CHART_COLORS.azul,
          }
        ]
      };
    }

    const labels = this.data.map(flota => {
      const embarcacion = this.embarcaciones.find(e => e.id === flota.embarcacion)?.nombre || 'Desconocido';
      return `${embarcacion} - ${new Date(flota.fecha).toLocaleDateString()}`;
    });

    const porcentaje_procesadas = this.data.map(flota => flota.toneladas_procesadas_produccion);
    const porcentaje_np = this.data.map(flota => flota.toneladas_NP);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Toneladas Procesadas',
          data: porcentaje_procesadas,
          backgroundColor: Utils.CHART_COLORS.celeste,
        },
        {
          label: 'Toneladas NP',
          data: porcentaje_np,
          backgroundColor: Utils.CHART_COLORS.azul_noche,
        },
      ]
    };
  }

}
