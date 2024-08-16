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
import { DerechoPI } from 'app/core/models/derechoP.model';
import { EditDerePescaComponent } from './edit-dere-pesca/edit-dere-pesca.component';
import { MatIconModule } from '@angular/material/icon';
import { Especies } from 'app/core/models/especie.model';
import { EspeciesService } from 'app/core/services/especies.service';
import { CreateEspeciesComponent } from './create-especies/create-especies.component';
import { PutEspecieComponent } from './put-especie/put-especie.component';
import { EditEmbarcacionesComponent } from './edit-embarcaciones/edit-embarcaciones.component';
import { EditSIComponent } from './edit-si/edit-si.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { TarifaCostoI } from 'app/core/models/tarifaCosto.model';
import { EditGastTripuComponent } from './edit-gast-tripu/edit-gast-tripu.component';
import Swal from 'sweetalert2';
import { ZonaPescaI } from 'app/core/models/zonaPesca';
import { CreateZonaComponent } from './create-zona/create-zona.component';
import { EditZonaComponent } from './edit-zona/edit-zona.component';

@Component({
  selector: 'app-gastos-generales',
  standalone: true,
  imports: [CommonModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule
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
  displayedColumnsViveresEmbarcacion: string[] = ['embarcacion', 'costo_zarpe', 'bonificacion', 'boner', 'acciones'];
  dataSourceViveresEmbarcacion!: MatTableDataSource<Embarcaciones>;
  embarcaciones: Embarcaciones[] = [];

  //servicio de inspeccion
  displayedColumnsMecanismo: string[] = ['item', 'costo_dia', 'acciones'];
  dataSourceMecanismo!: MatTableDataSource<MecanismoI>

  //derecho de pesca
  displayedColumnsDerechoPesca: string[] = ['item', 'costo_dia', 'acciones'];
  dataSourceDerechoP! : MatTableDataSource<DerechoPI>

  //especies
  displayedColumnsEspecies: string[] = ['fecha', 'nombre', 'precio', 'acciones']
  dataSourceEspecies!: MatTableDataSource<Especies>

  //zona pesca
  displayedColumnsZonaPesca: string[] = ['nombre', 'acciones'];
  dataSourceZona!: MatTableDataSource<ZonaPescaI>

  //Tarifas
  displayedColumnsTarifas: string[] = ['nombre_t', 'tarifa', 'acciones']
  dataSourceTarifas!: MatTableDataSource<TarifaCostoI>

  //PAGINACIÓN
  @ViewChildren(MatPaginator) paginators!: QueryList<MatPaginator>;
  @Output() updateTable = new EventEmitter<void>();

  constructor(
    private costoGalonGasolina: CostoXGalonService,
    private embarcacionesService: EmbarcacionesService,
    private especiesService: EspeciesService
  ) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.dataSourceTMHielo = new MatTableDataSource();
    this.dataSourceT3Agua = new MatTableDataSource();
    this.dataSourceTipoCambio = new MatTableDataSource();
    this.dataSourceViveresEmbarcacion = new MatTableDataSource();
    this.dataSourceMecanismo = new MatTableDataSource();
    this.dataSourceDerechoP = new MatTableDataSource();
    this.dataSourceEspecies = new MatTableDataSource();
    this.dataSourceTarifas = new MatTableDataSource();
    this.dataSourceZona = new MatTableDataSource();
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
    this.embarcacionesService.getEmbarcaciones().subscribe((data) => {
      this.dataSourceViveresEmbarcacion.data = data;
    });

    //servicio inspeccion - Mecanismo
    this.costoGalonGasolina.getM().subscribe((data) => {
      this.dataSourceMecanismo.data = data;
    });

    //Derecho de Pesca
    this.costoGalonGasolina.getDerechoPesca().subscribe((data) => {
      this.dataSourceDerechoP.data = data;
    })

    //especies
    this.especiesService.getDiarioPesca().subscribe((data) =>{
      this.dataSourceEspecies.data = data
    })

    //tarifas
    this.costoGalonGasolina.getTarifas().subscribe((data) => {
      this.dataSourceTarifas.data = data
    })

    //zona
    this.embarcacionesService.getZonaPesca().subscribe((data) => {
      this.dataSourceZona.data = data
    })
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
    this.embarcacionesService.getEmbarcaciones().subscribe(data => {
      this.dataSourceViveresEmbarcacion.data = data;
    });
  }

  loadDataEspecie(){
    this.especiesService.getDiarioPesca().subscribe((data) => {
      const reversedData = data.reverse();
      this.dataSourceEspecies.data = reversedData;
    });
  }

  loadDerechoPesca(){
    this.costoGalonGasolina.getDerechoPesca().subscribe(data => {
      this.dataSourceDerechoP.data = data
    })
  }

  loadTariEmb(){
    this.costoGalonGasolina.getTarifas().subscribe(data => {
      this.dataSourceTarifas.data = data
    })
  }

  loadServiInspe(){
    this.costoGalonGasolina.getM().subscribe(data => {
      this.dataSourceMecanismo.data = data
    })
  }

  loadZonaPesca(){
    this.embarcacionesService.getZonaPesca().subscribe((data) => {
      const reversedData = data.reverse();
      this.dataSourceZona.data = reversedData;
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

  openFormEditDP(DerePesca: DerechoPI){
    const dialogRefUpdate = this.dialog.open(EditDerePescaComponent, {
      data: DerePesca
    });

    dialogRefUpdate.afterClosed().subscribe(() => {
      this.loadDerechoPesca(); // Actualiza la tabla después de cerrar el diálogo
    });
  }

  openFormEditSerInsp(ServiInsp: MecanismoI){
    const dialog = this.dialog.open(EditSIComponent, {
      data: ServiInsp
    })

    dialog.afterClosed().subscribe(() => {
      this.loadServiInspe();
    })

  }

  openFormEspecie():void{
    const dialogRef = this.dialog.open(CreateEspeciesComponent)
    dialogRef.componentInstance.dataSaved.subscribe(() => {
      this.loadDataEspecie(); // Actualiza la tabla cuando se recibe el evento
    });
  }

  openFormZona():void{
    const dialogRef = this.dialog.open(CreateZonaComponent)
    dialogRef.componentInstance.dataSaved.subscribe(() => {
      this.loadZonaPesca(); // Actualiza la tabla cuando se recibe el evento
    });
  }

  openPutEspecie(PutEspecie: Especies): void {
    const dialogRef = this.dialog.open(PutEspecieComponent, {
      data: PutEspecie
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadDataEspecie(); // Actualiza la tabla después de cerrar el diálogo
    });
  }

  openPutZona(PutZona: ZonaPescaI): void {
    const dialogRef = this.dialog.open(EditZonaComponent, {
      data: PutZona
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadZonaPesca(); // Actualiza la tabla después de cerrar el diálogo
    });
  }

  deleteEspecie(id: number ){
    Swal.fire({
      title: '¿Estás seguro de que quieres eliminar esta Especie?',
      text: "Una vez eliminado, no podrás recuperarlo.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.especiesService.deleteEspecie(id).subscribe(
          () => {
            console.log('Especie eliminado correctamente');
            this.loadDataEspecie();          },
          error => {
            console.error('Error al eliminar el sondeo:', error);
          }
        );
      }
    });
  }

  openPutEmbarcacion(PutEmbarcacion: Embarcaciones): void{
    const dialog = this.dialog.open(EditEmbarcacionesComponent, {
      data: PutEmbarcacion
    });

    dialog.afterClosed().subscribe(() => {
      this.getCostoViEm(); // Actualiza la tabla después de cerrar el diálogo
    });
  }

  deleteEmbarcacion(id: number ){
    Swal.fire({
      title: '¿Estás seguro de que quieres eliminar esta Embarcacion?',
      text: "Una vez eliminado, no podrás recuperarlo.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.embarcacionesService.deleteEmbarcacion(id).subscribe(
          () => {
            console.log('Especie eliminado correctamente');
            this.getCostoViEm();          },
          error => {
            console.error('Error al eliminar el sondeo:', error);
          }
        );
      }
    });
  }

  deleteZona(id: number){
    Swal.fire({
      title: '¿Estás seguro de que quieres eliminar esta Zona?',
      text: "Una vez eliminado, no podrás recuperarlo.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.embarcacionesService.deleteZona(id).subscribe(
          () => {
            console.log('Zona eliminada correctamente');
            this.loadZonaPesca();          },
          error => {
            console.error('Error al eliminar el sondeo:', error);
          }
        );
      }
    });
  }

  openPutGastTri(PutGT: TarifaCostoI): void{
    const dialog = this.dialog.open(EditGastTripuComponent, {
      data: PutGT
    })

    dialog.afterClosed().subscribe(() => {
      this.loadTariEmb();
    })

  }

  ngAfterViewInit() {
    this.paginators.forEach((paginator, index) => {
      switch(index) {
        case 0:
          this.dataSourceEspecies.paginator = paginator;
          break;
        case 1:
          this.dataSourceViveresEmbarcacion.paginator = paginator;
          break;
        case 2:
          this.dataSourceZona.paginator = paginator;
          break;
        case 3:
          this.dataSource.paginator = paginator;
          break;
        case 4:
          this.dataSourceTMHielo.paginator = paginator;
          break;
        case 5:
          this.dataSourceT3Agua.paginator = paginator;
          break;
        case 6:
          this.dataSourceTipoCambio.paginator = paginator;
          break;
      }
    });
  }

}
