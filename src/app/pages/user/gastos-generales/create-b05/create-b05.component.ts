import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CostoGalonGasoI } from 'app/core/models/costoGG.model';
import { CostoXGalonService } from 'app/core/services/costo-x-galon.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-b05',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-b05.component.html',
  styleUrl: './create-b05.component.css'
})
export class CreateB05Component {

  formCreateB05: FormGroup;

  @Output() dataSaved = new EventEmitter<void>();

  constructor(
    private _toastr: ToastrService,
    private serviceB05: CostoXGalonService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreateB05Component>
  ){
    this.formCreateB05 = this.formBuilder.group({
      costo: ['', [Validators.required]]
    })
  }

  save() {
    if (this.formCreateB05.valid) {
      const value = this.formCreateB05.value;
      value.fecha = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
      console.log("Datos a enviar:", value);
      this.serviceB05.postCGG(value).subscribe(res => {
        if (res) {
          console.log("Dato ingresado correctamente:", res);
          this.formCreateB05.reset();
          this.dialogRef.close();
          this.dataSaved.emit();
          this._toastr.success('Éxito!', 'Registro guardado correctamente');
        }
      }, error => {
        console.error("Error al guardar:", error);
        this._toastr.error('Error!', 'Hubo un error al guardar el registro');
      });
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
