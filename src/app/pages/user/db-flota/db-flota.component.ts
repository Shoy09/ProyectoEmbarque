import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CostoXGalonService } from 'app/core/services/costo-x-galon.service';
import { FlotaService } from 'app/core/services/flota.service';
import { CreateDbFlotaComponent } from './create-db-flota/create-db-flota.component';
import { MecanismoI } from 'app/core/models/mecanismoI.models';
import { FlotaDP } from 'app/core/models/flota.model';
import { MatTableModule } from '@angular/material/table';

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
  readonly dialog = inject(MatDialog);

  flotas: FlotaDP[] = [];
  displayedColumns: string[] = [
    'fecha', 'tipo_cambio', 'embarcacion', 'zona_pesca', 'horas_faena', 'kilos_declarados',
    'merluza', 'bereche', 'volador', 'merluza_descarte', 'otro', 'kilo_otro',
    'toneladas_procesadas', 'toneladas_recibidas', 'total_tripulacion', 'consumo_gasolina',
    'total_gasolina', 'consumo_hielo', 'total_hielo', 'consumo_agua', 'total_agua',
    'consumo_viveres', 'total_vivieres', 'dias_inspeccion', 'total_servicio_inspeccion',
    'costo_otro', 'total_costo', 'action'
  ];

  constructor(private serviceFlota: FlotaService,
    private serviceGastoGenerales: CostoXGalonService
  ){}

  ngOnInit(): void {
    this.loadFlotas();
  }

  loadFlotas(): void {
    this.serviceFlota.getFlotas().subscribe(
      (data: FlotaDP[]) => {
        console.log(data); // Log fetched data
        this.flotas = data;
      },
      error => {
        console.error('Error al obtener registros de flota:', error);
      }
    );
  }


  openCreateFormFlota(): void {
    const dialogRefCreate = this.dialog.open(CreateDbFlotaComponent, {
      width: '600px',
      data: {} as MecanismoI
    });


    dialogRefCreate.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

}
