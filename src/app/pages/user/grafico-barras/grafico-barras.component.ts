import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Utils } from './util'; // Asegúrate de que Utils está correctamente importado

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
  @Input() data: any[] = []; // Datos sin procesar

  public chart!: Chart;

  ngOnInit(): void {
    this.createChart();
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

    const labels = this.data.map(flota => `${flota.embarcacion || 'Desconocido'} - ${new Date(flota.fecha).toLocaleDateString()}`);
    const datasetDataGaso = this.data.map(flota => flota.consumo_gasolina);
    const toneladasProcesadas = this.data.map(flota => flota.toneladas_procesadas);
    const toneladasRecibidas = this.data.map(flota => flota.toneladas_recibidas);
    const galonGasoHora = this.data.map(flota => flota.galon_hora);
    const consumoHielo = this.data.map(flota => flota.consumo_hielo);
    const consumoAgua = this.data.map(flota => flota.consumo_agua);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Toneladas Procesadas',
          data: toneladasProcesadas,
          borderColor: Utils.CHART_COLORS.blue,
          backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
        },
        {
          label: 'Toneladas Recibidas',
          data: toneladasRecibidas,
          borderColor: Utils.CHART_COLORS.naranja,
          backgroundColor: Utils.transparentize(Utils.CHART_COLORS.naranja, 0.5),
        },
        {
          label: 'Consumo Gasolina (gal)',
          data: datasetDataGaso,
          borderColor: Utils.CHART_COLORS.red,
          backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
        },
        {
          label: 'Gasolina x Hora (gal)',
          data: galonGasoHora,
          borderColor: Utils.CHART_COLORS.verde,
          backgroundColor: Utils.transparentize(Utils.CHART_COLORS.verde, 0.5),
        },
        {
          label: 'Consumo Hielo (gal)',
          data: consumoHielo,
          borderColor: Utils.CHART_COLORS.morado,
          backgroundColor: Utils.transparentize(Utils.CHART_COLORS.morado, 0.5),
        },
        {
          label: 'Consumo Agua (L)',
          data: consumoAgua,
          borderColor: Utils.CHART_COLORS.azulClaro,
          backgroundColor: Utils.transparentize(Utils.CHART_COLORS.azulClaro, 0.5),
        },
      ]
    };
  }
}
