import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
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
import { EstadisticaMaterializacionComponent } from "../estadistica-materializacion/estadistica-materializacion.component";
import { EstadisticaPastelComponent } from "../estadistica-pastel/estadistica-pastel.component";
import { GraficoBarrasComponent } from "../grafico-barras/grafico-barras.component";
import { MatIconModule } from '@angular/material/icon';
import { EstadisticaToneProceComponent } from '../estadistica-tone-proce/estadistica-tone-proce.component';
import { EstadisticaToneladasComponent } from "../estadistica-toneladas/estadistica-toneladas.component";
import { EstadisticaCostoComponent } from "../estadistica-costo/estadistica-costo.component";
import { CombustibleProcesablesComponent } from "./graficas/combustible-procesables/combustible-procesables.component";
import { HieloRecibidasComponent } from "./graficas/hielo-recibidas/hielo-recibidas.component";
import { HieloProcesablesComponent } from "./graficas/hielo-procesables/hielo-procesables.component";
import { AguaRecibidasComponent } from "./graficas/agua-recibidas/agua-recibidas.component";

@Component({
  selector: 'app-estadistica-sp',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule,
    EstadisticaMaterializacionComponent,
    EstadisticaPastelComponent,
    GraficoBarrasComponent,
    EstadisticaToneProceComponent,
    EstadisticaToneladasComponent,
    EstadisticaCostoComponent,
    CombustibleProcesablesComponent,
    HieloRecibidasComponent,
    HieloProcesablesComponent,
    AguaRecibidasComponent
],
  templateUrl: './estadistica-sp.component.html',
  styleUrls: ['./estadistica-sp.component.css']
})
export class EstadisticaSPComponent implements OnInit {
  flota: FlotaDP[] = [];
  zona_p: ZonaPescaI[] = [];
  embarcaciones: Embarcaciones[] = [];
  startDate!: Date;
  endDate!: Date;
  isDateFiltered = false;
  selectedEmbarcaciones: Set<number> = new Set();
  selectedZona: Set<number> = new Set();
  selectedEspecie: string | undefined;
  currentChart: string = 'bar';
  data: any;

  especies: { nombre: string; cantidad: number; precio: number }[] = [];
  public chart!: Chart;

  filteredData: any[] = []; // Define filteredData aquí

  constructor(
    private serviceFlota: FlotaService,
    private serviceEmbarcaciones: EmbarcacionesService,
  ) {}

  ngOnInit(): void {
    this.loadFlotasLances();
    this.loadEmbarcaciones();
    this.loadZonas();
  }

  private loadFlotasLances(): void {
    this.serviceFlota.getFlotasLances().subscribe(
      (data: FlotaDP[]) => {
        this.flota = data;
      },
      error => {
        console.error('Error loading flotas lances', error);
      }
    );
  }

  private loadEmbarcaciones(): void {
    this.serviceEmbarcaciones.getEmbarcaciones().subscribe(
      (data: Embarcaciones[]) => {
        this.embarcaciones = data;
      },
      error => {
        console.error('Error loading embarcaciones', error);
      }
    );
  }

  private loadZonas(): void {
    this.serviceEmbarcaciones.getZonaPesca().subscribe(
      (data: ZonaPescaI[]) => {
        this.zona_p = data;
      },
      error => {
        console.error('Error loading zonas de pesca', error);
      }
    );
  }

  showChart(chartType: string) {
    if (this.currentChart !== chartType) {
      this.currentChart = chartType;
      // Aquí podrías limpiar el gráfico anterior si es necesario
    }
  }

  clearFilter() {
    this.startDate = null!;
    this.endDate = null!;
    this.isDateFiltered = false;
  }

  applyFilters() {
    if (!this.startDate || !this.endDate) {
      this.filteredData = [];
      console.log('No hay fechas definidas. Data filtrada vacía:', this.filteredData);
      return;
    }

    let filteredRecords = this.flota;

    // Filtrar por embarcaciones seleccionadas
    if (this.selectedEmbarcaciones.size > 0) {
      filteredRecords = filteredRecords.filter(flota =>
        this.selectedEmbarcaciones.has(flota.embarcacion)
      );
    }

    // Filtrar por zonas de pesca seleccionadas
    if (this.selectedZona.size > 0) {
      filteredRecords = filteredRecords.filter(flota =>
        this.selectedZona.has(flota.zona_pesca)
      );
    }

    // Filtrar por fechas
    filteredRecords = filteredRecords.filter(flota => {
      const flotaDate = new Date(flota.fecha);
      return flotaDate >= this.startDate && flotaDate <= this.endDate;
    });

    // Actualiza los datos filtrados
    this.filteredData = filteredRecords;
    console.log('Datos filtrados:', this.filteredData);

    this.isDateFiltered = true;
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
