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
    EstadisticaToneProceComponent
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

  seleccionadoresEmbarcacion: { selectedEmbarcacion: number | null }[] = [];
  seleccionadoresZonaPesca: { selectedZonaPesca: number | null }[] = [];

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

    // Filtra los registros por fecha, embarcación, y zona de pesca
    this.filteredData = this.flota.filter(flota => {
        const fecha = new Date(flota.fecha);
        const isInRange = fecha >= this.startDate && fecha <= this.endDate;

        // Convierte los valores seleccionados a número antes de comparar
        const selectedZonaPescaNumber = Number(this.selectedZonaPesca);
        const selectedEmbarcacionNumber = Number(this.selectedEmbarcacion);

        const matchesZonaPesca = flota.zona_pesca === selectedZonaPescaNumber || !this.selectedZonaPesca;
        const matchesEmbarcacion = flota.embarcacion === selectedEmbarcacionNumber || !this.selectedEmbarcacion;

        const isIncluded = isInRange && matchesZonaPesca && matchesEmbarcacion;

        if (isIncluded) {
            console.log('Registro incluido:', flota);
        } else {
            console.log('Registro excluido:', flota);
        }

        return isIncluded;
    });

    // Muestra los datos filtrados
    console.log('Datos filtrados:', this.filteredData);

    // Actualiza el estado de los datos filtrados
    this.isDateFiltered = true;
}
addSelector(tipo: 'embarcacion' | 'zonaPesca') {
    if (tipo === 'embarcacion') {
      this.seleccionadoresEmbarcacion.push({ selectedEmbarcacion: null });
    } else if (tipo === 'zonaPesca') {
      this.seleccionadoresZonaPesca.push({ selectedZonaPesca: null });
    }
  }

  removeSelector(tipo: 'embarcacion' | 'zonaPesca', index: number) {
    if (tipo === 'embarcacion') {
      this.seleccionadoresEmbarcacion.splice(index, 1);
    } else if (tipo === 'zonaPesca') {
      this.seleccionadoresZonaPesca.splice(index, 1);
    }
  }

  getFilteredEmbarcaciones(index: number): Embarcaciones[] {
    // Obtén los IDs seleccionados, asegurándote de filtrar los valores null
    const selectedIds = this.seleccionadoresEmbarcacion
      .filter((_, i) => i !== index)
      .map(selector => selector.selectedEmbarcacion)
      .filter(id => id !== null) as number[]; // Asegúrate de que solo queden números

    return this.embarcaciones.filter(embarcacion => !selectedIds.includes(embarcacion.id));
  }

  getFilteredZonaPesca(index: number): ZonaPescaI[] {
    // Obtén los IDs seleccionados, asegurándote de filtrar los valores null
    const selectedIds = this.seleccionadoresZonaPesca
      .filter((_, i) => i !== index)
      .map(selector => selector.selectedZonaPesca)
      .filter(id => id !== null) as number[]; // Asegúrate de que solo queden números

    return this.ZonaPesca.filter(zona => !selectedIds.includes(zona.id));
  }


}
