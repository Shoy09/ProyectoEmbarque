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
          scales: {
            x: {
              stacked: true
            },
            y: {
              stacked: true
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

    // Crear un mapa para acumular datos por fecha y embarcación
    const dataMap = new Map<string, any>();

    this.data.forEach(flota => {
      const key = `${flota.embarcacion || 'Desconocido'} - ${new Date(flota.fecha).toLocaleDateString()}`;

      if (!dataMap.has(key)) {
        dataMap.set(key, {
          toneladas_procesadas: 0,
          toneladas_recibidas: 0,
          consumo_gasolina: 0,
          galon_hora: 0,
          consumo_hielo: 0,
          consumo_agua: 0
        });
      }

      const currentData = dataMap.get(key);
      dataMap.set(key, {
        toneladas_procesadas: currentData.toneladas_procesadas + (flota.toneladas_procesadas || 0),
        toneladas_recibidas: currentData.toneladas_recibidas + (flota.toneladas_recibidas || 0),
        consumo_gasolina: currentData.consumo_gasolina + (flota.consumo_gasolina || 0),
        galon_hora: currentData.galon_hora + (flota.galon_hora || 0),
        consumo_hielo: currentData.consumo_hielo + (flota.consumo_hielo || 0),
        consumo_agua: currentData.consumo_agua + (flota.consumo_agua || 0)
      });
    });

    const labels = Array.from(dataMap.keys());
    const dataValues = Array.from(dataMap.values());

    return {
      labels: labels,
      datasets: [
        {
          label: 'Toneladas Procesadas',
          data: dataValues.map(d => d.toneladas_procesadas),
          borderColor: Utils.CHART_COLORS.blue,
          backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
        },
        {
          label: 'Toneladas Recibidas',
          data: dataValues.map(d => d.toneladas_recibidas),
          borderColor: Utils.CHART_COLORS.naranja,
          backgroundColor: Utils.transparentize(Utils.CHART_COLORS.naranja, 0.5),
        },
        {
          label: 'Consumo Gasolina (gal)',
          data: dataValues.map(d => d.consumo_gasolina),
          borderColor: Utils.CHART_COLORS.red,
          backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
        },
        {
          label: 'Gasolina x Hora (gal)',
          data: dataValues.map(d => d.galon_hora),
          borderColor: Utils.CHART_COLORS.verde,
          backgroundColor: Utils.transparentize(Utils.CHART_COLORS.verde, 0.5),
        },
        {
          label: 'Consumo Hielo (gal)',
          data: dataValues.map(d => d.consumo_hielo),
          borderColor: Utils.CHART_COLORS.morado,
          backgroundColor: Utils.transparentize(Utils.CHART_COLORS.morado, 0.5),
        },
        {
          label: 'Consumo Agua (L)',
          data: dataValues.map(d => d.consumo_agua),
          borderColor: Utils.CHART_COLORS.azulClaro,
          backgroundColor: Utils.transparentize(Utils.CHART_COLORS.azulClaro, 0.5),
        },
      ]
    };
  }

}
