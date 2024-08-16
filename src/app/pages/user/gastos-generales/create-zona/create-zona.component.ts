import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { EmbarcacionesService } from 'app/core/services/embarcaciones.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-zona',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-zona.component.html',
  styleUrl: './create-zona.component.css'
})
export class CreateZonaComponent {

  formCreateZona : FormGroup;

  @Output() dataSaved = new EventEmitter<void>();

  constructor(
    private _toastr: ToastrService,
    private servicioZona: EmbarcacionesService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreateZonaComponent>
  ){
    this.formCreateZona = this.formBuilder.group({
      nombre: ['', [Validators.required]],
    })
  }

  save(){
    if (this.formCreateZona.valid) {
      const value = this.formCreateZona.value;
      this.servicioZona.postZona(value).subscribe({
        next: (res) => {
          console.log("Dato ingresado correctamente:", res);
          this.formCreateZona.reset();
          this.dialogRef.close();
          this.dataSaved.emit(); // Emitir evento para notificar al componente padre
          this._toastr.success('Éxito!', 'Registro guardado correctamente');
        },
        error: (err) => {
          console.error("Error al guardar:", err);
          if (err.error.nombre) {
            this._toastr.error('Error!', err.error.nombre);
          } else {
            this._toastr.error('Error!', 'Hubo un error al guardar el registro');
          }
        }
      });
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
