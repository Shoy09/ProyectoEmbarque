import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { IDiarioPesca } from 'app/core/models/diarioPesca.model';
import { DiarioPescaService } from 'app/core/services/diario-pesca.service';
import { CreateDiarioComponent } from './create-diario/create-diario.component';
import { EditDiarioComponent } from './edit-diario/edit-diario.component';

@Component({
  selector: 'app-seguimiento-pesca',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './seguimiento-pesca.component.html',
  styleUrl: './seguimiento-pesca.component.css'
})
export class SeguimientoPescaComponent {
  
  readonly dialog = inject(MatDialog);

  diario: IDiarioPesca[] = []

  constructor(
    private diarioPescaService: DiarioPescaService
  ){}

  ngOnInit(): void{
    this.diarioPescaService.getDiarioPesca().subscribe((data) => {
      console.log('data :' ,data);
      this.diario = data;
    })
  }

  getDiarioPesca(){
    this.diarioPescaService.getDiarioPesca().subscribe(diario => this.diario = diario );
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

}
