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
import { ZonaPescaI } from 'app/core/models/zonaPesca';
import { EstadisticaPastelComponent } from "../estadistica-pastel/estadistica-pastel.component";

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
    FormsModule,
    EstadisticaPastelComponent
],
  templateUrl: './estadistica-sp.component.html',
  styleUrl: './estadistica-sp.component.css'
})
export class EstadisticaSPComponent implements OnInit{

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

  public chart!: Chart;

  ngOnInit(): void {
    this.serviceEmbarcaciones.getEmbarcaciones().subscribe(embarcaciones => {
      this.embarcaciones = embarcaciones;

      this.serviceEmbarcaciones.getZonaPesca().subscribe(zonasPesca => {
        this.zona_p = zonasPesca;

        this.serviceFlota.getFlotasLances().subscribe((flotas: FlotaDP[]) => {
          this.flota = flotas;
          this.createChart();
        });
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
      type: 'bar',
      data: this.data
    });
  }

  applyFilters() {

    //se debe poner fecha para ejecutar el filtrado
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

    let filteredRecords = this.flota;

    // Filtrar por fechas
    if (this.startDate && this.endDate) {
      filteredRecords = filteredRecords.filter(flota => {
        const fecha = new Date(flota.fecha);
        return fecha >= this.startDate && fecha <= this.endDate;
      });
    }

    // Filtrar por embarcaciones seleccionadas
    if (this.selectedEmbarcaciones.size > 0) {
      filteredRecords = filteredRecords.filter(flota =>
        this.selectedEmbarcaciones.has(flota.embarcacion)
      );
    }

    if (this.selectedZona.size > 0) {
      filteredRecords = filteredRecords.filter(flota =>
        this.selectedZona.has(flota.zona_pesca)
      );
    }

    console.log('Filtered records by date and embarcaciones:', filteredRecords);

    const labels = filteredRecords.map(flota => {
      const embarcacion = this.embarcaciones.find(e => e.id === flota.embarcacion)?.nombre || 'Desconocido';
      return `${embarcacion} - ${new Date(flota.fecha).toLocaleDateString()}`;
    });

    const datasetDataGaso = filteredRecords.map(flota => flota.consumo_gasolina);
    const toneladasProcesadas = filteredRecords.map(flota => flota.toneladas_procesadas);
    const toneladasRecibidas = filteredRecords.map(flota => flota.toneladas_recibidas);
    const galonGasoHora = filteredRecords.map(flota => flota.galon_hora);
    const consumoHielo = filteredRecords.map(flota => flota.consumo_hielo);
    const consumoAgua = filteredRecords.map(flota => flota.consumo_agua);

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
  }

  toggleEmbarcacion(embarcacionId: number) {
    if (this.selectedEmbarcaciones.has(embarcacionId)) {
      this.selectedEmbarcaciones.delete(embarcacionId);
    } else {
      this.selectedEmbarcaciones.add(embarcacionId);
    }
    this.applyFilters();
  }

  togleZonaPesca(id: number){
    if(this.selectedZona.has(id)){
      this.selectedZona.delete(id);
    }else {
      this.selectedZona.add(id)
    }
    this.applyFilters();
  }
}



