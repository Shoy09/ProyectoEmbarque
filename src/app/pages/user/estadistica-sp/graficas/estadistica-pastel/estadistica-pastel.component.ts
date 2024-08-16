import { CommonModule } from '@angular/common';
import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { Utils } from './utils'; // Asegúrate de tener esta utilidad para colores
import { FlotaDP } from 'app/core/models/flota.model';
import { EmbarcacionesService } from 'app/core/services/embarcaciones.service';

@Component({
  selector: 'app-estadistica-pastel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    // Incluye otros módulos necesarios aquí
  ],
  templateUrl: './estadistica-pastel.component.html',
  styleUrls: ['./estadistica-pastel.component.css']
})
export class EstadisticaPastelComponent implements OnInit, OnChanges {
  @Input() data: FlotaDP[] = []; // Datos recibidos desde el componente padre

  public chart!: Chart<'pie'>;
  private embarcacionesMap: Map<number, string> = new Map(); // Mapa para almacenar los nombres de las embarcaciones

  constructor(private embarcacionesService: EmbarcacionesService) {}

  ngOnInit(): void {
    Chart.register(...registerables); // Registra los módulos necesarios
    this.embarcacionesService.getEmbarcaciones().subscribe(embarcaciones => {
      this.embarcacionesMap = new Map(embarcaciones.map(e => [e.id, e.nombre]));
      this.createChart();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.createChart();
    }
  }

  createChart() {
    const chartContainer = document.getElementById('chartpastel');

    if (this.chart) {
      this.chart.destroy();
    }

    setTimeout(() => {
      const chartData = this.getChartData();
      const ctx = document.getElementById('chartpastel') as HTMLCanvasElement;

      if (!ctx) {
        console.error('No se pudo encontrar el canvas');
        return;
      }

      if (chartData.labels.length) {
        this.chart = new Chart(ctx, {
          type: 'pie',
          data: chartData,
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const label = context.dataset.label || '';
                    const value = context.parsed as number;
                    const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                    const percentage = ((value / total) * 100).toFixed(2);
                    return `${label}: ${value} kg (${percentage}%)`;
                  }
                }
              }
            }
          }
        });
      } else {
        console.error('No hay datos disponibles para crear el gráfico');
      }
    }, 0);
  }

  getChartData() {
    if (!this.data || this.data.length === 0) {
      console.error('Datos no están disponibles');
      return { labels: [], datasets: [] };
    }

    const especieMap = new Map<string, number>(); // Usamos solo valores numéricos

    // Sumar las cantidades por especie y embarcación
    this.data.forEach(record => {
      if (record.especie && Array.isArray(record.especie)) {
        record.especie.forEach((item: { nombre: string; cantidad: number; }) => {
          if (item && item.nombre) {
            const embarcacionNombre = this.embarcacionesMap.get(record.embarcacion) || 'Desconocido';
            const key = `${item.nombre} - ${embarcacionNombre}`;
            especieMap.set(key, (especieMap.get(key) || 0) + item.cantidad);
          }
        });
      }
    });

    const labels = Array.from(especieMap.keys());
    const data = Array.from(especieMap.values()); // Usamos un array de números
    const datasets = [{
      label: 'Cantidad',
      data: data,
      backgroundColor: Utils.generateColors(labels.length),
      borderColor: Utils.generateBorderColors(labels.length)
    }];

    return {
      labels: labels,
      datasets: datasets
    };
  }
}
