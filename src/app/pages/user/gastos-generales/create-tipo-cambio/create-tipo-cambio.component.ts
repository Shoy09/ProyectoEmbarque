import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CostoXGalonService } from 'app/core/services/costo-x-galon.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-tipo-cambio',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-tipo-cambio.component.html',
  styleUrl: './create-tipo-cambio.component.css'
})
export class CreateTipoCambioComponent {

  formTipoCambio: FormGroup;

  @Output() dataSaved = new EventEmitter<void>();

  constructor(
    private _toastr: ToastrService,
    private serviceTC: CostoXGalonService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreateTipoCambioComponent>
  ) {
    this.formTipoCambio = this.formBuilder.group({
      costo: ['', [Validators.required]]
    })
  }

  save(){
    if (this.formTipoCambio.valid) {
      const value = this.formTipoCambio.value;
      value.fecha = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
      console.log("Datos a enviar:", value);
      this.serviceTC.post(value).subscribe(res => {
        if (res) {
          console.log("Dato ingresado correctamente:", res);
          this.formTipoCambio.reset();
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
