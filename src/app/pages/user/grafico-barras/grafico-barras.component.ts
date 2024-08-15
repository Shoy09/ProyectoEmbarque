import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Utils } from './util'; // Asegúrate de que Utils está correctamente importado
import { EmbarcacionesService } from 'app/core/services/embarcaciones.service';
import { Embarcaciones } from 'app/core/models/embarcacion';

// Registra todos los módulos necesarios
Chart.register(...registerables);

@Component({
  selector: 'app-grafico-barras',
  standalone: true,
  imports: [],
  templateUrl: './grafico-barras.component.html',
  styleUrls: ['./grafico-barras.component.css']
})
export class GraficoBarrasComponent implements OnInit, OnChanges {

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
    const chartContainer = document.getElementById('chart');
    if (chartContainer) {
      chartContainer.style.height = '500px';  // Ajusta la altura a tu preferencia
    }

    if (this.chart) {
      this.chart.destroy();
    }
    if (this.data && this.data.length) {
      this.chart = new Chart("chart", {
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
    const datasetDataGaso = this.data.map(flota => flota.consumo_gasolina);
    const toneladasRecibidas = this.data.map(flota => flota.toneladas_recibidas)

    return {
      labels: labels,
      datasets: [
        {
          label: 'Consumo Combustible (gal)',
          data: datasetDataGaso,
          borderColor: Utils.CHART_COLORS.red,
          backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
        },
        {
          label: 'Toneladas',
          data: toneladasRecibidas,
          borderColor: Utils.CHART_COLORS.azulClaro,
          backgroundColor: Utils.transparentize(Utils.CHART_COLORS.azulClaro, 0.5),
        },
      ]
    };
  }
}
