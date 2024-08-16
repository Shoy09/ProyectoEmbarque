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
        this.updateChart();
      } else {
        this.createChart();
      }
    }
  }

  createChart() {
    const chartContainer = document.getElementById('chartEspecies');
    if (chartContainer) {
      chartContainer.style.height = '500px';
    }

    if (this.chart) {
      this.chart.destroy();
    }
    if (this.data && this.data.length) {
      this.chart = new Chart("chartEspecies", {
        type: 'bar',
        data: this.getChartData(),
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Cantidad de especies por embarcación'
            },
            datalabels: {
              color: '#fff',
              display: true,
              formatter: (value) => `${value} kg`,
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
                callback: (value) => `${value} kg`
              }
            }
          }
        },
      });
    } else {
      console.error('No hay datos disponibles para crear el gráfico');
    }
  }

  updateChart(){
    if(this.chart){
      this.chart.data = this.getChartData();
      this.chart.update();
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

    const labels = this.data.map(flota => {
      const embarcacion = this.embarcaciones.find(e => e.id === flota.embarcacion)?.nombre || 'Desconocido';
      return `${embarcacion} - ${new Date(flota.fecha).toLocaleDateString()}`;
    });

    // Obtener todas las especies únicas
    const allSpecies = new Set<string>();
    this.data.forEach(flota => {
      flota.especie.forEach((esp: { nombre: string }) => {
        allSpecies.add(esp.nombre);
      });
    });

    // Crear datasets para cada especie
    const datasets = Array.from(allSpecies).map((especie, index) => {
      return {
        label: especie,
        data: this.data.map(flota => {
          const esp = flota.especie.find((e: { nombre: string }) => e.nombre === especie);
          return esp ? esp.cantidad : 0;
        }),
        backgroundColor: Utils.getColorForSpecies(index),
      };
    });

    return {
      labels: labels,
      datasets: datasets
    };
  }

}
