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


  filterPastel() {
    let filteredRecords = this.flota;

    if (!this.startDate || !this.endDate) {
        this.data = {
            labels: [],
            datasets: []
        };
        if (this.chart) {
            this.chart.data = this.data;
            this.chart.update();
        }
        return;
    }

    // Filtrado por fechas
    filteredRecords = filteredRecords.filter(flota =>
        new Date(flota.fecha) >= new Date(this.startDate) &&
        new Date(flota.fecha) <= new Date(this.endDate)
    );

    // Filtrado por zonas de pesca
    if (this.selectedZona.size > 0) {
        filteredRecords = filteredRecords.filter(flota =>
            this.selectedZona.has(flota.zona_pesca)
        );
    }

    // Agrega las etiquetas para los datos del gráfico
    const labels = [
        'Merluza (kg)',
        'Bereche (kg)',
        'Volador (kg)',
        'Merluza NP (kg)',
        'Otra Especie (kg)'
    ];

    // Objeto para almacenar los datos por embarcación
    const embarcacionesData: { [key: number]: number[] } = {};

    // Si no hay embarcaciones seleccionadas, selecciona todas
    if (this.selectedEmbarcaciones.size === 0) {
        this.embarcaciones.forEach(e => this.selectedEmbarcaciones.add(e.id));
    }

    // Calcula los totales para cada tipo y embarcación
    this.selectedEmbarcaciones.forEach(embarcacionId => {
        const embarcacionRecords = filteredRecords.filter(flota => flota.embarcacion === embarcacionId);
        embarcacionesData[embarcacionId] = [
            embarcacionRecords.reduce((sum, flota) => sum + flota.merluza!, 0),
            embarcacionRecords.reduce((sum, flota) => sum + flota.bereche!, 0),
            embarcacionRecords.reduce((sum, flota) => sum + flota.volador!, 0),
            embarcacionRecords.reduce((sum, flota) => sum + flota.merluza_descarte!, 0),
            embarcacionRecords.reduce((sum, flota) => sum + flota.kilo_otro!, 0)
        ];
    });

    // Crear datasets para cada embarcación
    const datasets = Array.from(this.selectedEmbarcaciones).map((embarcacionId, index) => {
        const embarcacion = this.embarcaciones.find(e => e.id === embarcacionId);
        return {
            label: embarcacion ? embarcacion.nombre : `Embarcación ${embarcacionId}`,
            data: embarcacionesData[embarcacionId],
            backgroundColor: Utils.generateColors(5, index),
            borderColor: Utils.generateBorderColors(5, index)
        };
    });

    // Datos para el gráfico
    this.data = {
        labels: labels,
        datasets: datasets
    };

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

    if (this.chart) {
        this.chart.destroy();
    }

    this.chart = new Chart(ctx, config);
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
