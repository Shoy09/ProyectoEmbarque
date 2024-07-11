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
    MatButtonModule ],
  templateUrl: './seguimiento-pesca.component.html',
  styleUrl: './seguimiento-pesca.component.css'
})
export class SeguimientoPescaComponent {
  
  readonly dialog = inject(MatDialog);
  displayedColumns: string[] = [ 'embarcacion', 'fecha', 'numero_alcance','flota', 'zona_pesca', 'estrato', 'rango_profundidad_inicial', 'rango_profundidad_final', 'tiempo_efectivo', 'rango_talla_inicial', 'rango_talla_final','moda', 'porcentaje', 'ar', 'numero', 'acciones'];
  dataSource: MatTableDataSource<IDiarioPesca>;
  diario: IDiarioPesca[] = []

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private diarioPescaService: DiarioPescaService, private changeDetector: ChangeDetectorRef) {
    this.dataSource = new MatTableDataSource<IDiarioPesca>();
  }
  

  ngOnInit(): void {
    this.diarioPescaService.getDiarioPesca().subscribe(data => {
      this.dataSource = new MatTableDataSource<IDiarioPesca>(data);
      // Configura el paginador y el ordenamiento aquí si es necesario
    });
  }

  getDiarioPesca() {
    this.diarioPescaService.getDiarioPesca().subscribe(
      data => {
        this.diario = data;
        this.dataSource.data = this.diario;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.changeDetector.detectChanges(); // Notifica a Angular sobre los cambios
      },
      error => {
        console.error('Error al obtener el diario de pesca:', error);
      }
    );
  }
  

  openFomrCreate(): void {
    const dialogRefCreate = this.dialog.open(CreateDiarioComponent, {
      width: '600px', // ajusta el ancho según tus necesidades
      data: {} as IDiarioPesca // si no necesitas pasar datos inicialmente
    });

    dialogRefCreate.afterClosed().subscribe(result => {
      if (result) {
        this.getDiarioPesca();
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

  
  
}
