import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CostoGalonGasoI } from 'app/core/models/costoGG.model';
import { CostoTMHielo } from 'app/core/models/costoGH.model';
import { CostoM3Agua } from 'app/core/models/costoMA.model';
import { TipoCambio } from 'app/core/models/costoTC.model';
import { ConsumoViveresI } from 'app/core/models/tViveres.model';
import { CostoXGalonService } from 'app/core/services/costo-x-galon.service';
import { CreateVEComponent } from './create-ve/create-ve.component';
import { Embarcaciones } from 'app/core/models/embarcacion';
import { EmbarcacionesService } from 'app/core/services/embarcaciones.service';
import { MecanismoI } from 'app/core/models/mecanismoI.models';
import { CreateB05Component } from './create-b05/create-b05.component';

@Component({
  selector: 'app-gastos-generales',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatSortModule,
    MatDatepickerModule,
    MatPaginatorModule,
  ],
  templateUrl: './gastos-generales.component.html',
  styleUrl: './gastos-generales.component.css'
})
export class GastosGeneralesComponent {

  readonly dialog = inject(MatDialog);

  //combustible
  displayedColumns: string[] = ['fecha', 'costo'];
  dataSource!: MatTableDataSource<CostoGalonGasoI>;
  lastCosto?: CostoGalonGasoI;

  //hielo
  displayedColumnsTMHielo: string[] = ['id', 'fecha', 'costo'];
  dataSourceTMHielo!: MatTableDataSource<CostoTMHielo>;
  ultimoCostoHielo?: CostoTMHielo;

  //agua
  displayedColumnsT3Agua: string[] = ['id', 'fecha', 'costo'];
  dataSourceT3Agua!: MatTableDataSource<CostoM3Agua>;
  ultimoCostoAgua?: CostoM3Agua;

  //tipo cambio
  displayedColumnsTipoCambio: string[] = ['id', 'fecha', 'costo'];
  dataSourceTipoCambio!: MatTableDataSource<TipoCambio>;
  ultimoCostoTipoCambio?: TipoCambio;

  //viveres
  displayedColumnsViveresEmbarcacion: string[] = ['embarcacion', 'costo_zarpe'];
  dataSourceViveresEmbarcacion!: MatTableDataSource<ConsumoViveresI>;
  embarcaciones: Embarcaciones[] = [];

  //mecanismo
  displayedColumnsMecanismo: string[] = ['item', 'costo_dia'];
  dataSourceMecanismo!: MatTableDataSource<MecanismoI>

  //PAGINACIÓN
  @ViewChildren(MatPaginator) paginators!: QueryList<MatPaginator>;
  @Output() updateTable = new EventEmitter<void>();

  constructor(
    private costoGalonGasolina: CostoXGalonService,
    private embarcacionesService: EmbarcacionesService,
  ) {
    this.updateTable.subscribe(() => {
      this.getCostoViEm(); // Actualiza la tabla con los nuevos datos
    });
  }

  ngOnInit() {

    this.dataSource = new MatTableDataSource();
    this.dataSourceTMHielo = new MatTableDataSource();
    this.dataSourceT3Agua = new MatTableDataSource();
    this.dataSourceTipoCambio = new MatTableDataSource();
    this.dataSourceViveresEmbarcacion = new MatTableDataSource();
    this.dataSourceMecanismo = new MatTableDataSource();
    this.getEmbarcaciones();
    this.updateTable.subscribe(() => {
      this.getCostoViEm();
    });


    //combustible
    this.costoGalonGasolina.getCGG().subscribe((data) => {
      const reversedData = data.reverse();
      this.dataSource.data = reversedData;
    });

    this.costoGalonGasolina.getLastCosto().subscribe(last => {
      this.lastCosto = last;
    });

    //hielo
    this.costoGalonGasolina.getTMHielo().subscribe((data) => {
      const reversedData = data.reverse();
      this.dataSourceTMHielo.data = reversedData;
    });

    this.costoGalonGasolina.getLastCostoHielo().subscribe(last => {
      this.ultimoCostoHielo = last;
    });

    //agua
    this.costoGalonGasolina.getM3Agua().subscribe((data) =>{
      const reversedData = data.reverse();
      this.dataSourceT3Agua.data = reversedData
    })

    this.costoGalonGasolina.getLastM3Agua().subscribe( last => {
      this.ultimoCostoAgua = last
    })

    //tipo cambio
    this.costoGalonGasolina.getTC().subscribe((data) =>{
      const reversedData = data.reverse();
      this.dataSourceTipoCambio.data = reversedData
    })

    this.costoGalonGasolina.getLastTipoCambio().subscribe( last =>{
      this.ultimoCostoTipoCambio = last
    })

    //consumo de viveres por embarcacion
    this.costoGalonGasolina.getCEV().subscribe((data) => {
      this.dataSourceViveresEmbarcacion.data = data;
    });

    //mecanismo
    this.costoGalonGasolina.getM().subscribe((data) => {
      this.dataSourceMecanismo.data = data;
    });

  }

  getCostoViEm() {
    this.costoGalonGasolina.getCEV().subscribe(data => {
      this.dataSourceViveresEmbarcacion.data = data;
    });
  }

  getEmbarcaciones() {
    this.embarcacionesService.getEmbarcaciones().subscribe(
      embarcaciones => {
        this.embarcaciones = embarcaciones;
      },
      error => {
        console.error('Error al obtener embarcaciones:', error);
      }
    );
  }

  getNombreEmbarcacion(id: number): String {
    const embarcacion = this.embarcaciones.find(e => e.id === id);
    return embarcacion ? embarcacion.nombre : 'Desconocido' as String;
  }

  getCEV(): void {
    this.costoGalonGasolina.getCEV().subscribe((data) => {
      this.dataSourceViveresEmbarcacion.data = data;
    });
  }

  openCreateFormVE(): void {
    const dialogRefCreate = this.dialog.open(CreateVEComponent, {
      width: '600px',
      data: {} as ConsumoViveresI
    });

    dialogRefCreate.componentInstance.updateTable = this.updateTable; // Pasando el EventEmitter como Input

    dialogRefCreate.afterClosed().subscribe(result => {
      if (result) {
        this.getCostoViEm(); // Asegúrate de que esto esté en lugar adecuado
      }
    });
  }

  openFormB05(): void{
    const dialogRefCreate = this.dialog.open(CreateB05Component, {
      width: '600px'
    });

    dialogRefCreate.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  
  ngAfterViewInit() {
    this.paginators.forEach((paginator, index) => {
      switch(index) {
        case 0:
          this.dataSource.paginator = paginator;
          break;
        case 1:
          this.dataSourceTMHielo.paginator = paginator;
          break;
        case 2:
          this.dataSourceT3Agua.paginator = paginator;
          break;
        case 3:
          this.dataSourceTipoCambio.paginator = paginator;
          break;
        case 4:
          this.dataSourceViveresEmbarcacion.paginator = paginator;
          break;
      }
    });
  }

}
