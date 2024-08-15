import { CommonModule } from '@angular/common';
import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { Utilss } from './utils'; // Asegúrate de tener esta utilidad para colores

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
  @Input() data: any[] = []; // Datos recibidos desde el componente padre

  public chart!: Chart<'pie'>;

  ngOnInit(): void {
    Chart.register(...registerables); // Registra los módulos necesarios
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.createChart();
    }
  }

  createChart() {
    const chartContainer = document.getElementById('chartpastel');
  if (chartContainer) {
    chartContainer.style.height = '200px';  // Ajusta la altura a tu preferencia
  }

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

      if (this.chart) {
        this.chart.destroy();
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
                    const value = context.parsed;
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

    const especieMap = new Map<string, number>();

    // Sumar las cantidades por especie
    this.data.forEach(record => {
      if (record.especie && Array.isArray(record.especie)) {
        record.especie.forEach((item: { nombre: string; cantidad: number; }) => {
          if (item && item.nombre) {
            especieMap.set(item.nombre, (especieMap.get(item.nombre) || 0) + item.cantidad);
          }
        });
      }
    });

    const labels = Array.from(especieMap.keys());
    const data = Array.from(especieMap.values());

    return {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: Utilss.generateColors(labels.length),
        borderColor: Utilss.generateBorderColors(labels.length),
        label: 'Cantidad de Especies'
      }]
    };
  }
}
