import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
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
import { EstadisticaMaterializacionComponent } from "../estadistica-materializacion/estadistica-materializacion.component";
import { EstadisticaPastelComponent } from "../estadistica-pastel/estadistica-pastel.component";
import { GraficoBarrasComponent } from "../grafico-barras/grafico-barras.component";

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
    EstadisticaMaterializacionComponent,
    EstadisticaPastelComponent,
    GraficoBarrasComponent
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
  selectedEmbarcacion: string | undefined;
  selectedZonaPesca: number | undefined;
  selectedEspecie: string | undefined;
  data: any;
  ZonaPesca: ZonaPescaI[] = [];
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
        this.extractEspecies();
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
        this.ZonaPesca = data;
      },
      error => {
        console.error('Error loading zonas de pesca', error);
      }
    );
  }

  private extractEspecies(): void {
    const especiesSet = new Set<string>();

    this.flota.forEach(flotas => {
      if (Array.isArray(flotas.especie)) {
        flotas.especie.forEach(e => {
          especiesSet.add(e.nombre);
        });
      }
    });

    this.especies = Array.from(especiesSet).map(name => ({ nombre: name, cantidad: 0, precio: 0 }));
  }

  clearFilter() {
    this.startDate = null!;
    this.endDate = null!;
    this.isDateFiltered = false;
  }

  applyFilters() {
    if (!this.startDate || !this.endDate) {
      // Si no hay fechas definidas, no se muestran datos
      this.filteredData = [];
      console.log('No hay fechas definidas. Data filtrada vacía:', this.filteredData);
      return;
    }

    // Muestra las fechas de inicio y fin para depuración
    console.log('Fechas de filtrado:', {
      startDate: this.startDate,
      endDate: this.endDate
    });

    // Filtra los registros por fecha
    this.filteredData = this.flota.filter(flota => {
      const fecha = new Date(flota.fecha);
      const isInRange = fecha >= this.startDate && fecha <= this.endDate;
      if (isInRange) {
        console.log('Registro incluido:', flota);
      } else {
        console.log('Registro excluido:', flota);
      }
      return isInRange;
    });

    // Muestra los datos filtrados
    console.log('Datos filtrados:', this.filteredData);

    // Actualiza el estado de los datos filtrados
    this.isDateFiltered = true;
  }


}
