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
  data: any;

  constructor(
    private serviceFlota: FlotaService,
    private serviceEmbarcaciones: EmbarcacionesService,
  ){}

  public chart!: Chart<'pie'>;

  ngOnInit(): void {
    this.serviceEmbarcaciones.getEmbarcaciones().subscribe(embarcaciones => {
      this.embarcaciones = embarcaciones;

      this.serviceEmbarcaciones.getZonaPesca().subscribe(zonasPesca => {
        this.zona_p = zonasPesca;

        this.serviceFlota.getFlotasLances().subscribe((flotas: FlotaDP[]) => {
          this.flota = flotas;
          this.filterPastel(); // Cambié a filterPastel aquí
        });
      });
    });
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
                let label = context.label || '';
                if (context.parsed) {
                  label += ': ' + context.parsed;
                }
                return label;
              }
            }
          }
        }
      }
    };

    if (this.chart) {
      this.chart.destroy(); // Destruir el gráfico anterior antes de crear uno nuevo
    }

    this.chart = new Chart(ctx, config);
  }


  filterPastel() {
    let filteredRecords = this.flota;

    //fecha
    if (this.startDate && this.endDate) {
      filteredRecords = filteredRecords.filter(flota => {
        const fecha = new Date(flota.fecha); // Asume que 'fecha' es una propiedad de 'flota'
        return fecha >= this.startDate && fecha <= this.endDate;
      });
    }

    //embarcaciones
    if (this.selectedEmbarcaciones.size > 0) {
      filteredRecords = filteredRecords.filter(flota =>
        this.selectedEmbarcaciones.has(flota.embarcacion)
      );
    }

    //zonas de pesca
    if (this.selectedZona.size > 0) {
      filteredRecords = filteredRecords.filter(flota =>
        this.selectedZona.has(flota.zona_pesca)
      );
    }

    // Agrega las etiquetas para los datos del gráfico
    const labels = [
      'Merluza',
      'Bereche',
      'Volador',
      'Merluza NP',
      'Otra Especie (kg)'
    ];

    // Calcula los totales para cada tipo
    const totalMerluza = filteredRecords.reduce((sum, flota) => sum + flota.merluza!, 0);
    const totalBereche = filteredRecords.reduce((sum, flota) => sum + flota.bereche!, 0);
    const totalVolador = filteredRecords.reduce((sum, flota) => sum + flota.volador!, 0);
    const totalMerluzaNP = filteredRecords.reduce((sum, flota) => sum + flota.merluza_descarte!, 0);
    const totalOtro = filteredRecords.reduce((sum, flota) => sum + flota.kilo_otro!, 0);

    // Datos para el gráfico
    this.data = {
      labels: labels,
      datasets: [{
        data: [totalMerluza, totalBereche, totalVolador, totalMerluzaNP, totalOtro],
        backgroundColor: [
          Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
          Utils.transparentize(Utils.CHART_COLORS.naranja, 0.5),
          Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
          Utils.transparentize(Utils.CHART_COLORS.verde, 0.5),
          Utils.transparentize(Utils.CHART_COLORS.morado, 0.5),
        ],
        borderColor: [
          Utils.CHART_COLORS.blue,
          Utils.CHART_COLORS.naranja,
          Utils.CHART_COLORS.red,
          Utils.CHART_COLORS.verde,
          Utils.CHART_COLORS.morado,
        ],
      }]
    };

  this.createPastel();  // Llama a createPastel después de establecer this.data
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
