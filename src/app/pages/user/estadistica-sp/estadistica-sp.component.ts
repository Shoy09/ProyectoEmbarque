import { Component, OnInit, ViewChild } from '@angular/core';
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
import { EstadisticaPastelComponent } from "./graficas/estadistica-pastel/estadistica-pastel.component";
import { GraficoBarrasComponent } from "./graficas/grafico-barras/grafico-barras.component";
import { MatIconModule } from '@angular/material/icon';
import { EstadisticaToneProceComponent } from './graficas/estadistica-tone-proce/estadistica-tone-proce.component';
import { EstadisticaToneladasComponent } from "./graficas/estadistica-toneladas/estadistica-toneladas.component";
import { EstadisticaCostoComponent } from "./graficas/estadistica-costo/estadistica-costo.component";
import { CombustibleProcesablesComponent } from "./graficas/combustible-procesables/combustible-procesables.component";
import { HieloRecibidasComponent } from "./graficas/hielo-recibidas/hielo-recibidas.component";
import { HieloProcesablesComponent } from "./graficas/hielo-procesables/hielo-procesables.component";
import { AguaRecibidasComponent } from "./graficas/agua-recibidas/agua-recibidas.component";
import { AguaProcesablesComponent } from "./graficas/agua-procesables/agua-procesables.component";
import { ConsuViveRComponent } from "./graficas/consu-vive-r/consu-vive-r.component";
import { CombustibleXHoraComponent } from "./graficas/combustible-x-hora/combustible-x-hora.component";
import { ToneladasEspeciesComponent } from "./graficas/toneladas-especies/toneladas-especies.component";
import { LancesComponent } from "./graficas/lances/lances.component";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

import { TDocumentDefinitions } from 'pdfmake/interfaces';

pdfMake.vfs = pdfFonts.pdfMake.vfs;


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
    AguaRecibidasComponent,
    AguaProcesablesComponent,
    ConsuViveRComponent,
    CombustibleXHoraComponent,
    ToneladasEspeciesComponent,
    LancesComponent
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
  data: any;

  especies: { nombre: string; cantidad: number; precio: number }[] = [];

  @ViewChild('chartContainer', { static: false }) chartContainer: any;
  currentChart: string = 'bar';

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
    }
  }

  createPDF() {
    const chartCanvases = this.chartContainer.nativeElement.querySelectorAll('canvas');

    if (chartCanvases.length > 0) {
      const images = Array.from(chartCanvases).map((canvas: HTMLCanvasElement) => {
        return { image: canvas.toDataURL('image/png'), width: 500 };
      });

      const documentDefinition: TDocumentDefinitions = {
        content: [
          { text: 'Reporte de Gráficas', style: 'header' },
          ...images // Agrega todas las imágenes capturadas al contenido
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10]
          }
        }
      };

      pdfMake.createPdf(documentDefinition).download('reporte.pdf');
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
