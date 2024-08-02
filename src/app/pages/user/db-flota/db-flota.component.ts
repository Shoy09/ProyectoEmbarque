import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FlotaService } from 'app/core/services/flota.service';
import { CreateDbFlotaComponent } from './create-db-flota/create-db-flota.component';
import { FlotaDP } from 'app/core/models/flota.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { EmbarcacionesService } from 'app/core/services/embarcaciones.service';
import { Embarcaciones } from 'app/core/models/embarcacion';
import { ZonaPescaI } from 'app/core/models/zonaPesca';
import { CreateDiarioComponent } from '../seguimiento-pesca/create-diario/create-diario.component';
import { IDiarioPesca } from 'app/core/models/diarioPesca.model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-db-flota',
  standalone: true,
  imports: [CommonModule,
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
  templateUrl: './db-flota.component.html',
  styleUrl: './db-flota.component.css'
})
export class DbFlotaComponent {

  private dialog = inject(MatDialog);

  flotas: FlotaDP[] = [];
  embarcaciones: Embarcaciones[] = [];
  zona_pesca: ZonaPescaI[] = [];
  areColumnsVisible: boolean = false;

  displayedColumns: string[] = [
    'fecha', 'embarcacion', 'zona_pesca', 'horas_faena'
    , 'kilos_declarados', 'merluza', 'bereche',
    'volador', 'merluza_descarte', 'otro', 'kilo_otro',
    'precio_otro', 'precio_basico', 'toneladas_procesadas',
    'toneladas_recibidas', 'total_tripulacion', 'tipo_cambio','consumo_gasolina', 'galon_hora',
    'total_gasolina', 'consumo_hielo', 'total_hielo',
    'consumo_agua', 'total_agua', 'consumo_viveres', 'total_vivieres',
    'dias_inspeccion', 'total_servicio_inspeccion', 'total_derecho_pesca',
    'total_costo', 'costo_tm_captura', 'csot', 'lances'
  ];
  flotaDPId!: number;
  isDateFiltered = false;
  startDate! : Date;
  endDate!: Date;

  dataSource!: MatTableDataSource<FlotaDP>
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private serviceFlota: FlotaService,
    private embarcacionesService: EmbarcacionesService,
    private route: ActivatedRoute,
    private router: Router
  ){}

  ngOnInit(): void {
    this.loadFlotas();
    this.loadEmbarcaciones();
    this.loadZonaPesca();
    this.dataSource = new MatTableDataSource<FlotaDP>([]);
    this.route.params.subscribe(params => {
      this.flotaDPId = +params['flotaDPId'];
      this.loadFlotaData();
    });
  }

  loadFlotaData(): void {
    this.serviceFlota.getFlotas().subscribe(
      (allFlotas: FlotaDP[]) => {
        this.dataSource.data = allFlotas;
      },
      error => {
        console.error('Error al cargar los datos de las flotas:', error);
      }
    );
  }

  resetFilter(): void {
    this.dataSource.filter = '';
    if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
    }
  }

  selectFlota(id: number): void {
  }

  loadEmbarcaciones(): void {
    this.embarcacionesService.getEmbarcaciones().subscribe(
      (embarcaciones: Embarcaciones[]) => {
        this.embarcaciones = embarcaciones;
        this.loadFlotas(); // Cargar flotas después de obtener embarcaciones
      },
      error => {
        console.error('Error al obtener embarcaciones:', error);
      }
    );
  }

  loadZonaPesca(): void{
    this.embarcacionesService.getZonaPesca().subscribe(
      (zona_pesca: ZonaPescaI[]) => {
        this.zona_pesca = zona_pesca;
        this.loadFlotas(); // Cargar flotas después de obtener embarcaciones
      },
      error => {
        console.error('Error al obtener embarcaciones:', error);
      }
    );
  }

  loadFlotas(): void {
    this.serviceFlota.getFlotas().subscribe(
      (data: FlotaDP[]) => {
        const flotasConNombres = data.map(flota => ({
         ...flota,
          embarcacionNombre: this.embarcaciones.find(e => e.id === Number(flota.embarcacion))?.nombre || 'Desconocido',
          zonaNombre: this.zona_pesca.find(z => z.id === Number(flota.zona_pesca))?.nombre || 'Desconocido',
        }));

        const reversedData = flotasConNombres.reverse(); // Corrección aquí
        this.flotas = reversedData;
        this.dataSource = new MatTableDataSource(this.flotas);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        console.error('Error al obtener registros de flota:', error);
      }
    );
  }

  getLancesForFlota(flotaId: number): IDiarioPesca[] {
    return [];
  }

  toggleColumnsVisibility(): void {
    this.areColumnsVisible = !this.areColumnsVisible;
    this.updateDisplayedColumns();
  }

  updateDisplayedColumns(): void {
    this.displayedColumns = [
      'fecha', 'embarcacion', 'zona_pesca', 'horas_faena',
      'kilos_declarados', 'merluza', 'bereche',
      'volador', 'merluza_descarte', 'otro', 'kilo_otro',
      'precio_otro', 'precio_basico', 'toneladas_procesadas',
      'toneladas_recibidas', 'total_tripulacion',
      'tipo_cambio', 'consumo_gasolina',
      'total_gasolina', 'galon_hora', 'consumo_hielo', 'total_hielo',
      'consumo_agua', 'total_agua', 'consumo_viveres', 'total_vivieres',
      'dias_inspeccion', 'total_servicio_inspeccion', 'total_derecho_pesca',
      'total_costo', 'costo_tm_captura', 'csot', 'lances'
    ];

    // Si las columnas están visibles, agrega las columnas adicionales
    if (this.areColumnsVisible) {
      this.displayedColumns = [
        'fecha', 'embarcacion', 'zona_pesca', 'horas_faena',
        'kilos_declarados', 'merluza', 'bereche',
        'volador', 'merluza_descarte', 'otro', 'kilo_otro',
        'precio_otro', 'precio_basico', 'toneladas_procesadas',
        'toneladas_recibidas','participacion', 'bonificacion', 'total_participacion', 'aporte_REP',
        'gratificacion', 'vacaciones', 'cts', 'essalud', 'senati', 'SCTR_SAL',
        'SCTR_PEN', 'poliza_seguro', 'total_tripulacion', 'tipo_cambio','consumo_gasolina',
        'total_gasolina', 'galon_hora', 'consumo_hielo', 'total_hielo',
        'consumo_agua', 'total_agua', 'consumo_viveres', 'total_vivieres',
        'dias_inspeccion', 'total_servicio_inspeccion', 'total_derecho_pesca',
        'total_costo', 'costo_tm_captura', 'csot', 'lances',

      ];
    }
  }

  openCreateFormFlota(): void {
    const dialogRefCreate = this.dialog.open(CreateDbFlotaComponent, {
      disableClose: true // Evita que se cierre al hacer clic fuera
    });

    dialogRefCreate.componentInstance.dataSaved.subscribe((success: boolean) => {
      if (success) {
        dialogRefCreate.close(); // Cierra el diálogo
        //this.getFlotaDP();
        this.loadFlotas(); // Actualiza también la lista de flotas
      }
    });
  }

  openFomrCreateLances(flotaDP: FlotaDP): void {
    const dialogRefCreate = this.dialog.open(CreateDiarioComponent, {
      width: '600px', // ajusta el ancho según tus necesidades
      data: {
        flotaDP_id: flotaDP.id,
        fecha: flotaDP.fecha,
        embarcacion: flotaDP.embarcacion,
        zona_pesca: flotaDP.zona_pesca
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyDateFilter() {
    if (this.startDate && this.endDate) {
      this.isDateFiltered = true; // Actualiza el estado del filtro
      this.dataSource.data = this.flotas.filter(flotas => {
        const fecha = new Date(flotas.fecha);
        return fecha >= this.startDate && fecha <= this.endDate;
      });
      this.dataSource.paginator!.firstPage();
    }
  }

  clearDateFilter() {
    // Restablece los controles de fecha
    this.startDate = null!;
    this.endDate = null!;
    this.isDateFiltered = false; // Actualiza el estado del filtro

    // Restablece los datos filtrados
    this.dataSource.data = this.flotas;
    this.dataSource.paginator!.firstPage();
  }

  ngAfterViewInit() {
    this.loadFlotas();
  }

}
