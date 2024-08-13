import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Embarcaciones } from 'app/core/models/embarcacion';
import { FlotaDP } from 'app/core/models/flota.model';
import { EmbarcacionesService } from 'app/core/services/embarcaciones.service';
import { FlotaService } from 'app/core/services/flota.service';
import { forkJoin } from 'rxjs';
import { CreateProduccionToneladasComponent } from './create-produccion-toneladas/create-produccion-toneladas.component';

@Component({
  selector: 'app-produccion-toneladas',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './produccion-toneladas.component.html',
  styleUrl: './produccion-toneladas.component.css'
})
export class ProduccionToneladasComponent {

  private dialog = inject(MatDialog);

  flotas: FlotaDP[] = [];
  embarcaciones: Embarcaciones[] = [];




  displayedColumns: string[] = [
    'fecha', 'embarcacion','toneladas_procesables',
    'toneladas_procesadas','toneladas_NP', 'acciones'
  ];

  flotaDPId!: number;
  isDateFiltered = false;
  startDate!: Date;
  endDate!: Date;

  dataSource!: MatTableDataSource<FlotaDP>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private serviceFlota: FlotaService,
    private embarcacionesService: EmbarcacionesService,
  ) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<FlotaDP>([]);
    forkJoin({
      embarcaciones: this.embarcacionesService.getEmbarcaciones(),
      zonaPesca: this.embarcacionesService.getZonaPesca(),
    }).subscribe(({ embarcaciones }) => {
      this.embarcaciones = embarcaciones;
      this.loadProduccionToneladas();
    });
  }

  loadProduccionToneladas(): void {
    this.serviceFlota.getFlotas().subscribe(
      (allFlotas: FlotaDP[]) => {
        if (allFlotas) {
          const flotasConNombres = allFlotas.map(flota => ({
            ...flota,
            embarcacionNombre: this.embarcaciones.find(e => e.id === Number(flota.embarcacion))?.nombre || 'Desconocido'
          }));
          this.dataSource.data = flotasConNombres;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          console.error('No se recibieron datos de flotas');
        }
      },
      error => {
        console.error('Error al cargar los datos de las flotas:', error);
      }
    );
  }

  openFormCreateToneladasProduccion(flotaDP: FlotaDP): void {
    const dialog = this.dialog.open(CreateProduccionToneladasComponent, {
      data: {
        fecha: flotaDP.fecha,
        embarcacion: flotaDP.embarcacion,
        toneladas_procesables: flotaDP.toneladas_procesadas,
        id: flotaDP.id // Asegúrate de incluir el ID aquí
      }
    });

    dialog.componentInstance.dataSaved.subscribe((success: boolean) => {
      if (success) {
        this.loadProduccionToneladas(); // Actualiza la lista de flotas
      }
    });
  }

  

}
