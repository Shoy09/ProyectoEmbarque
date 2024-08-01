import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CostoXGalonService } from 'app/core/services/costo-x-galon.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-agua',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-agua.component.html',
  styleUrl: './create-agua.component.css'
})
export class CreateAguaComponent {

  formCreateAgua: FormGroup;

  @Output() dataSaved = new EventEmitter<void>();

  constructor(
    private _toastr: ToastrService,
    private serviceAgua: CostoXGalonService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreateAguaComponent>
  ){
    this.formCreateAgua = this.formBuilder.group({
      costo: ['', [Validators.required]]
    })
  }

  save() {
    if (this.formCreateAgua.valid) {
      const value = this.formCreateAgua.value;
      value.fecha = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
      console.log("Datos a enviar:", value);
      this.serviceAgua.postM3Agua(value).subscribe(res => {
        if (res) {
          console.log("Dato ingresado correctamente:", res);
          this.formCreateAgua.reset();
          this.dialogRef.close();
          this.dataSaved.emit();
          this._toastr.success('Éxito!', 'Registro de agua guardado correctamente');
        }
      }, error => {
        console.error("Error al guardar:", error);
        this._toastr.error('Error!', 'Hubo un error al guardar el registro del agua');
      });
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
