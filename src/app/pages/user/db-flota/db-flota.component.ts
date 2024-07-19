import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CostoXGalonService } from 'app/core/services/costo-x-galon.service';
import { FlotaService } from 'app/core/services/flota.service';
import { CreateDbFlotaComponent } from './create-db-flota/create-db-flota.component';
import { MecanismoI } from 'app/core/models/mecanismoI.models';

@Component({
  selector: 'app-db-flota',
  standalone: true,
  imports: [CommonModule,
    MatDialogModule,
  ],
  templateUrl: './db-flota.component.html',
  styleUrl: './db-flota.component.css'
})
export class DbFlotaComponent {
  readonly dialog = inject(MatDialog);

  constructor(private serviceFlota: FlotaService,
    private serviceGastoGenerales: CostoXGalonService
  ){}

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
