import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Embarcaciones } from 'app/core/models/embarcacion';
import { FlotaDP } from 'app/core/models/flota.model';
import { ZonaPescaI } from 'app/core/models/zonaPesca';
import { EmbarcacionesService } from 'app/core/services/embarcaciones.service';
import { FlotaService } from 'app/core/services/flota.service';
import { ChartConfiguration } from 'chart.js';
import { Chart } from 'chart.js';
import { Utils } from './utils';
import { Especies } from 'app/core/models/especie.model';
import { EspeciesService } from 'app/core/services/especies.service';

@Component({
  selector: 'app-estadistica-pastel',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule,
  ],
  templateUrl: './estadistica-pastel.component.html',
  styleUrl: './estadistica-pastel.component.css'
})
export class EstadisticaPastelComponent implements OnInit{

  flota: FlotaDP[] = [];
  zona_p: ZonaPescaI[] = [];
  embarcaciones: Embarcaciones[] = [];
  startDate!: Date;
  endDate!: Date;
  isDateFiltered = false;
  selectedEmbarcaciones: Set<number> = new Set();
  selectedZona: Set<number> = new Set();
  especies: string[] = [];
  especie :Especies[] = [];
  data: any;

  constructor(
    private serviceFlota: FlotaService,
    private serviceEmbarcaciones: EmbarcacionesService,
    private serviceEspecie : EspeciesService,
  ){}

  public chart!: Chart<'pie'>;

  ngOnInit(): void {
    this.serviceEmbarcaciones.getEmbarcaciones().subscribe(embarcaciones => {
      this.embarcaciones = embarcaciones;

      this.serviceEmbarcaciones.getZonaPesca().subscribe(zonasPesca => {
        this.zona_p = zonasPesca;

        this.serviceFlota.getFlotas().subscribe((flotas: FlotaDP[]) => {
          this.flota = flotas;
          this.extractEspecies();
          this.filterPastel();
        });
      });
    });

    this.serviceEspecie.getDiarioPesca().subscribe(especies => {
      this.especie = especies;
      console.log('Especies obtenidas:', this.especie);
    });
  }

  extractEspecies() {
    const especiesSet = new Set<string>();

    this.flota.forEach(flota => {
      if (flota.especie && Array.isArray(flota.especie)) {
        flota.especie.forEach(especie => {
          if (especie && especie.nombre) {
            especiesSet.add(especie.nombre);
          }
        });
      }
    });

    especiesSet.add('Otra Especie');

    this.especies = Array.from(especiesSet);
    console.log('Especies extraídas:', this.especies);
  }

  filterPastel() {
    console.log('Flota inicial:', this.flota.length);
    let filteredRecords = this.flota;

    if (!this.startDate || !this.endDate) {
      console.log('Fechas no seleccionadas');
      this.data = { labels: [], datasets: [] };
      if (this.chart) {
        this.chart.data = this.data;
        this.chart.update();
      }
      return;
    }

    console.log('Fechas seleccionadas:', this.startDate, this.endDate);

    filteredRecords = filteredRecords.filter(flota => {
      const flotaDate = new Date(flota.fecha);
      return flotaDate >= new Date(this.startDate) && flotaDate <= new Date(this.endDate);
    });

    console.log('Registros después del filtro de fechas:', filteredRecords.length);

    if (this.selectedZona.size > 0) {
      filteredRecords = filteredRecords.filter(flota => this.selectedZona.has(flota.zona_pesca));
      console.log('Registros después del filtro de zona:', filteredRecords.length);
    }

    const availableEmbarcaciones = new Set<number>(filteredRecords.map(flota => flota.embarcacion));

    if (this.selectedEmbarcaciones.size === 0) {
      this.selectedEmbarcaciones = availableEmbarcaciones;
    }

    console.log('Embarcaciones seleccionadas:', this.selectedEmbarcaciones.size);

    const embarcacionesData: { [key: number]: { [key: string]: number } } = {};

    this.selectedEmbarcaciones.forEach(embarcacionId => {
      const embarcacionRecords = filteredRecords.filter(flota => flota.embarcacion === embarcacionId);
      embarcacionesData[embarcacionId] = {};

      this.especies.forEach(especie => {
        if (especie === 'Otra Especie') {
          embarcacionesData[embarcacionId][especie] = embarcacionRecords.reduce((sum, flota) =>
            sum + (flota.kilo_otro ? Number(flota.kilo_otro) : 0), 0);
        } else {
          embarcacionesData[embarcacionId][especie] = embarcacionRecords.reduce((sum, flota) => {
            if (flota.especie && Array.isArray(flota.especie)) {
              const especieData = flota.especie.find(e => e.nombre === especie);
              return sum + (especieData ? especieData.cantidad : 0);
            }
            return sum;
          }, 0);
        }
      });
    });

    console.log('Datos procesados por embarcación:', embarcacionesData);

    const datasets = Array.from(this.selectedEmbarcaciones).map((embarcacionId, index) => {
      const embarcacion = this.embarcaciones.find(e => e.id === embarcacionId);
      return {
        label: embarcacion ? embarcacion.nombre : `Embarcación ${embarcacionId}`,
        data: this.especies.map(especie => embarcacionesData[embarcacionId][especie] || 0),
        backgroundColor: Utils.generateColors(this.especies.length, index),
        borderColor: Utils.generateBorderColors(this.especies.length, index)
      };
    });

    this.data = {
      labels: this.especies,
      datasets: datasets
    };

    console.log('Datos finales para el gráfico:', this.data);

    this.createPastel();
  }

  createPastel() {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;

    const config: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: this.data,
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
    };

    console.log('Configuración final del gráfico:', config);

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, config);
    console.log('Gráfico creado:', this.chart);
  }

  toggleEmbarcacion(embarcacionId: number) {
    if (this.selectedEmbarcaciones.has(embarcacionId)) {
      this.selectedEmbarcaciones.delete(embarcacionId);
    } else {
      this.selectedEmbarcaciones.add(embarcacionId);
    }
    this.filterPastel();
  }

  togleZonaPesca(id: number){
    if(this.selectedZona.has(id)){
      this.selectedZona.delete(id);
    }else {
      this.selectedZona.add(id)
    }
    this.filterPastel();
  }

}
