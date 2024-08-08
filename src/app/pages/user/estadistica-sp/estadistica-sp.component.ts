import { Component, OnInit } from '@angular/core';
import { Chart} from 'chart.js/auto'
import { Utils } from './util';
import { FlotaService } from 'app/core/services/flota.service';
import { FlotaDP } from 'app/core/models/flota.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { EmbarcacionesService } from 'app/core/services/embarcaciones.service';
import { Embarcaciones } from 'app/core/models/embarcacion';

@Component({
  selector: 'app-estadistica-sp',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './estadistica-sp.component.html',
  styleUrl: './estadistica-sp.component.css'
})
export class EstadisticaSPComponent implements OnInit{

  flota: FlotaDP[] = [];
  embarcaciones: Embarcaciones[] = [];
  startDate!: Date;
  endDate!: Date;
  isDateFiltered = false;
  data: any;

  filterOptions = {
    toneladasRecibidas: false,
    toneladasProcesadas: false,
    consumoGasolina: false,
    galonHora: false
  };

  constructor(
    private serviceFlota: FlotaService,
    private serviceEmbarcaciones: EmbarcacionesService,
  ){}

  public chart!: Chart;

  ngOnInit(): void {
    // Obtener embarcaciones y flotas
    this.serviceEmbarcaciones.getEmbarcaciones().subscribe(embarcaciones => {
      this.embarcaciones = embarcaciones;
      this.serviceFlota.getFlotasLances().subscribe((flotas: FlotaDP[]) => {
        this.flota = flotas;
        this.createChart();
      });
    });
  }

  createChart() {
    this.data = {
      labels: [],
      datasets: [
        {
          label: 'Dataset',
          data: [],
          borderColor: Utils.CHART_COLORS.red,
          backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
        }
      ]
    };

    this.chart = new Chart("chart", {
      type: 'line',
      data: this.data
    });
  }


  applyDateFilter() {
    if (this.startDate && this.endDate) {
      this.isDateFiltered = true;
      // Filtrado por fechas
      const filteredRecords = this.flota.filter(flota => {
        const fecha = new Date(flota.fecha);
        return fecha >= this.startDate && fecha <= this.endDate;
      });

      console.log('Filtered records by date:', filteredRecords);

      const labels = filteredRecords.map(flota => {
        const embarcacion = this.embarcaciones.find(e => e.id === flota.embarcacion)?.nombre || 'Desconocido';
        return `${embarcacion} - ${new Date(flota.fecha).toLocaleDateString()}`;
      });
      const datasetDataGaso = filteredRecords.map(flota => flota.consumo_gasolina);
      const toneladasProcesadas = filteredRecords.map(flota => flota.toneladas_procesadas);
      const toneladasRecibidas = filteredRecords.map(flota =>  flota.toneladas_recibidas);
      const galonGasoHora = filteredRecords.map(flota => flota.galon_hora);
      const consumoHielo = filteredRecords.map(flota => flota.consumo_hielo)
      const consumoAgua = filteredRecords.map(flota => flota.consumo_agua)

      this.data = {
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

      if (!this.chart) {
        this.chart = new Chart("chart", {
          type: 'line',
          data: this.data
        });
      } else {
        this.chart.data = this.data;
        this.chart.update();
      }

      console.log('Chart updated with filtered data');
    } else {
      // Si no hay fechas, mostrar todos los datos
      this.data = {
        labels: this.flota.map(flota => `${flota.embarcacion} - ${new Date(flota.fecha).toLocaleDateString()}`),
        datasets: [
          {
            label: 'Consumo de Gasolina',
            data: this.flota.map(flota => flota.consumo_gasolina),
            borderColor: Utils.CHART_COLORS.red,
            backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
          }
        ]
      };

      if (!this.chart) {
        this.chart = new Chart("chart", {
          type: 'line',
          data: this.data
        });
      } else {
        this.chart.data = this.data;
        this.chart.update();
      }

      console.log('Chart updated with all data');
    }
  }


}
