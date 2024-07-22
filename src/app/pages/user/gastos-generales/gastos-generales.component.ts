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
import { CreateHieloComponent } from './create-hielo/create-hielo.component';
import { CreateAguaComponent } from './create-agua/create-agua.component';
import { CreateTipoCambioComponent } from './create-tipo-cambio/create-tipo-cambio.component';

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
  displayedColumnsTMHielo: string[] = ['fecha', 'costo'];
  dataSourceTMHielo!: MatTableDataSource<CostoTMHielo>;
  ultimoCostoHielo?: CostoTMHielo;

  //agua
  displayedColumnsT3Agua: string[] = ['fecha', 'costo'];
  dataSourceT3Agua!: MatTableDataSource<CostoM3Agua>;
  ultimoCostoAgua?: CostoM3Agua;

  //tipo cambio
  displayedColumnsTipoCambio: string[] = ['fecha', 'costo'];
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
  ) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.dataSourceTMHielo = new MatTableDataSource();
    this.dataSourceT3Agua = new MatTableDataSource();
    this.dataSourceTipoCambio = new MatTableDataSource();
    this.dataSourceViveresEmbarcacion = new MatTableDataSource();
    this.dataSourceMecanismo = new MatTableDataSource();
    this.getEmbarcaciones();

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


  //recarga de datos

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

  loadData() {
    this.costoGalonGasolina.getCGG().subscribe((data) => {
      const reversedData = data.reverse();
      this.dataSource.data = reversedData;
    });

    this.costoGalonGasolina.getLastCosto().subscribe(last => {
      this.lastCosto = last;
    });
  }

  loadDataH(){
    this.costoGalonGasolina.getTMHielo().subscribe((data) => {
      const reversedData = data.reverse();
      this.dataSourceTMHielo.data = reversedData;
    });

    this.costoGalonGasolina.getLastCostoHielo().subscribe(last => {
      this.ultimoCostoHielo = last;
    });
  }

  loadDataA(){
    this.costoGalonGasolina.getM3Agua().subscribe((data) => {
      const reversedData = data.reverse();
      this.dataSourceT3Agua.data = reversedData;
    });

    this.costoGalonGasolina.getLastM3Agua().subscribe(last => {
      this.ultimoCostoAgua = last;
    });
  }

  loadDataTC(){
    this.costoGalonGasolina.getTC().subscribe((data) => {
      const reversedData = data.reverse();
      this.dataSourceTipoCambio.data = reversedData;
    });

    this.costoGalonGasolina.getLastTipoCambio().subscribe(last => {
      this.ultimoCostoTipoCambio = last;
    });
  }

  getCostoViEm() {
    this.costoGalonGasolina.getCEV().subscribe(data => {
      this.dataSourceViveresEmbarcacion.data = data;
    });
  }

  //FORMULARIOS

  openCreateFormVE(): void {
    const dialogRef = this.dialog.open(CreateVEComponent);
    dialogRef.componentInstance.dataSaved.subscribe(() => {
      this.getCostoViEm(); // Actualiza la tabla cuando se recibe el evento
    });
  }

  openFormB05(): void {
    const dialogRef = this.dialog.open(CreateB05Component);
    dialogRef.componentInstance.dataSaved.subscribe(() => {
      this.loadData(); // Actualiza la tabla cuando se recibe el evento
    });
  }

  openFormHielo(): void{
    const dialogRef = this.dialog.open(CreateHieloComponent);
    dialogRef.componentInstance.dataSaved.subscribe(() => {
      this.loadDataH(); // Actualiza la tabla cuando se recibe el evento
    });
  }

  openFormAgua():void{
    const dialogRef = this.dialog.open(CreateAguaComponent);
    dialogRef.componentInstance.dataSaved.subscribe(() => {
      this.loadDataA(); // Actualiza la tabla cuando se recibe el evento
    });
  }

  openFormTipoCambio():void{
    const dialogRef = this.dialog.open(CreateTipoCambioComponent);
    dialogRef.componentInstance.dataSaved.subscribe(() => {
      this.loadDataTC(); // Actualiza la tabla cuando se recibe el evento
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
          case 5: // Asegúrate de asignar el paginator para la tabla de mecanismo
          this.dataSourceMecanismo.paginator = paginator;
          break;
      }
    });
  }

}
