import { AfterViewInit, ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { IDiarioPesca } from 'app/core/models/diarioPesca.model';
import { DiarioPescaService } from 'app/core/services/diario-pesca.service';
import { CreateDiarioComponent } from './create-diario/create-diario.component';
import { EditDiarioComponent } from './edit-diario/edit-diario.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EmbarcacionesService } from 'app/core/services/embarcaciones.service';
import { EspeciesService } from 'app/core/services/especies.service';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-seguimiento-pesca',
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
    FormsModule],
  templateUrl: './seguimiento-pesca.component.html',
  styleUrl: './seguimiento-pesca.component.css'
})
export class SeguimientoPescaComponent {

  readonly dialog = inject(MatDialog);
  displayedColumns: string[] = [ 'embarcacion', 'fecha', 'numero_alcance','especie', 'zona_pesca', 'estrato', 'profundidad', 'tiempo_efectivo', 'rango_talla_inicial', 'rango_talla_final','moda', 'porcentaje', 'ar', 'numero', 'acciones'];
  dataSource: MatTableDataSource<IDiarioPesca>;
  diario: IDiarioPesca[] = []
  startDate! : Date;
  endDate!: Date;
  isDateFiltered = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private diarioPescaService: DiarioPescaService,
    private embarcacionesService: EmbarcacionesService,
    private especieService: EspeciesService,
    private changeDetector: ChangeDetectorRef) {
    this.dataSource = new MatTableDataSource<IDiarioPesca>();
  }


  ngOnInit(): void {
    this.embarcacionesService.getEmbarcaciones().subscribe(embarcaciones => {
      this.diarioPescaService.getDiarioPesca().subscribe(diarios => {
        const diariosConNombres: IDiarioPesca[] = diarios.map(diario => ({
          ...diario,
          embarcacion: Number(diario.embarcacion), // Asegúrate de que embarcacion sea number si así lo requiere tu interfaz IDiarioPesca
          especie: Number(diario.especie), // Asegúrate de que especie sea number si así lo requiere tu interfaz IDiarioPesca
          embarcacionNombre: embarcaciones.find(e => Number(e.id) === Number(diario.embarcacion))?.nombre || 'Desconocido',
          // Agrega más propiedades según tu interfaz IDiarioPesca
        }));

        this.dataSource = new MatTableDataSource<IDiarioPesca>(diariosConNombres);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    });
  }


  getDiarioPesca(forceRefresh?: boolean): void {
    this.embarcacionesService.getEmbarcaciones().subscribe(embarcaciones => {
      this.especieService.getDiarioPesca().subscribe(especies => { // Asegúrate de que el método sea getEspecies()
        this.diarioPescaService.getDiarioPesca().subscribe(diarios => {
          const diariosConNombres = diarios.map(diario => ({
            ...diario,
            embarcacion: Number(diario.embarcacion),
            especie: Number(diario.especie),
            embarcacionNombre: embarcaciones.find(e => Number(e.id) === Number(diario.embarcacion))?.nombre || 'Desconocido',
            especieNombre: especies.find(e => Number(e.id) === Number(diario.especie))?.nombre || 'Desconocido',
          }));

          // Invierte el orden de los diarios para que los últimos ingresados aparezcan primero
          diariosConNombres.reverse();

          this.diario = diariosConNombres;
          this.dataSource.data = diariosConNombres;
          this.changeDetector.detectChanges();
        });
      });
    });
  }


  openFomrCreate(): void {
    const dialogRefCreate = this.dialog.open(CreateDiarioComponent, {
      width: '600px', // ajusta el ancho según tus necesidades
      data: {} as IDiarioPesca // si no necesitas pasar datos inicialmente
    });

    dialogRefCreate.afterClosed().subscribe(result => {
      if (result) {
        this.getDiarioPesca(true);
      }
    });
  }

  openFomrUpdate(diario: IDiarioPesca){
    const dialogRefUpdate = this.dialog.open(EditDiarioComponent, {
      data: diario
    });

    dialogRefUpdate.afterClosed().subscribe(result => {
      if (result) {
        this.getDiarioPesca();
      }
    });
  }

  deleteDiarioPesca(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este Sondeo?')) {
      this.diarioPescaService.deleteDiarioPesca(id).subscribe(
        () => {
          console.log('Sondeo eliminado correctamente');
          this.getDiarioPesca(); // Recargar la lista después de eliminar
        },
        error => {
          console.error('Error al eliminar el sondeo:', error);
        }
      );
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getDiarioPesca(); // Asegúrate de llamar a getDiarioPesca aquí para cargar los datos
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
      this.dataSource.data = this.diario.filter(diario => {
        const fecha = new Date(diario.fecha);
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
    this.dataSource.data = this.diario;
    this.dataSource.paginator!.firstPage();
  }



}
