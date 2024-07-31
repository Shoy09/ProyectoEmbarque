import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CostoXGalonService } from 'app/core/services/costo-x-galon.service';
import { FlotaService } from 'app/core/services/flota.service';
import { CreateDbFlotaComponent } from './create-db-flota/create-db-flota.component';
import { MecanismoI } from 'app/core/models/mecanismoI.models';
import { FlotaDP } from 'app/core/models/flota.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { EmbarcacionesService } from 'app/core/services/embarcaciones.service';
import { Embarcaciones } from 'app/core/models/embarcacion';
import { ZonaPescaI } from 'app/core/models/zonaPesca';
import { CreateDiarioComponent } from '../seguimiento-pesca/create-diario/create-diario.component';
import { IDiarioPesca } from 'app/core/models/diarioPesca.model';

@Component({
  selector: 'app-db-flota',
  standalone: true,
  imports: [CommonModule,
    MatDialogModule,
    MatTableModule
  ],
  templateUrl: './db-flota.component.html',
  styleUrl: './db-flota.component.css'
})
export class DbFlotaComponent {
  private dialog = inject(MatDialog);

  flotas: FlotaDP[] = [];
  embarcaciones: Embarcaciones[] = [];
  zona_pesca: ZonaPescaI[] = []
  displayedColumns: string[] = [
    'fecha','embarcacion', 'zona_pesca', 'horas_faena', 'tipo_cambio', 'kilos_declarados',
    'merluza', 'bereche', 'volador', 'merluza_descarte', 'otro', 'kilo_otro',
    'toneladas_procesadas', 'toneladas_recibidas', 'participacion', 'total_participacion','total_tripulacion', 'consumo_gasolina',
    'total_gasolina', 'galon_hora', 'consumo_hielo', 'total_hielo', 'consumo_agua', 'total_agua',
    'consumo_viveres', 'total_vivieres', 'dias_inspeccion', 'total_servicio_inspeccion',
    'total_derecho_pesca', 'total_costo', 'costo_tm_captura', 'csot', 'lances'
  ];
  dataSource!: MatTableDataSource<FlotaDP>

  constructor(private serviceFlota: FlotaService,
    private serviceGastoGenerales: CostoXGalonService,
    private embarcacionesService: EmbarcacionesService
  ){}

  ngOnInit(): void {
    this.loadFlotas();
    this.loadEmbarcaciones();
    this.loadZonaPesca();
    this.dataSource = new MatTableDataSource<FlotaDP>([]);
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
        // Mapear los datos para incluir nombres de embarcación y zona de pesca
        const flotasConNombres = data.map(flota => ({
          ...flota,
          embarcacionNombre: this.embarcaciones.find(e => e.id === Number(flota.embarcacion))?.nombre || 'Desconocido',
          zonaNombre: this.zona_pesca.find(z => z.id === Number(flota.zona_pesca))?.nombre || 'Desconocido', // Añadido para zonaNombre
        }));

        // Reversa el array de datos
        const reversedData = flotasConNombres.reverse();
        this.flotas = reversedData;
      },
      error => {
        console.error('Error al obtener registros de flota:', error);
      }
    );
  }

  getFlotaDP() {
    this.serviceFlota.getFlotas().subscribe(data => {
      const datos = data.reverse();
      this.dataSource = new MatTableDataSource(datos);
    });
  }

  openCreateFormFlota(): void {
    const dialogRefCreate = this.dialog.open(CreateDbFlotaComponent, {
      disableClose: true // Evita que se cierre al hacer clic fuera
    });

    dialogRefCreate.componentInstance.dataSaved.subscribe((success: boolean) => {
      if (success) {
        dialogRefCreate.close(); // Cierra el diálogo
        this.getFlotaDP();
        this.loadFlotas(); // Actualiza también la lista de flotas
      }
    });
  }

  openFomrCreateLances(flotaDP: FlotaDP): void {
    const dialogRefCreate = this.dialog.open(CreateDiarioComponent, {
      width: '600px', // ajusta el ancho según tus necesidades
      data: { flotaDP_id: flotaDP.id} // Pasa el id de la instancia de FlotaDP seleccionada
    });
  }

}
