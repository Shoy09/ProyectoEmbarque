import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MecanismoI } from 'app/core/models/mecanismoI.models';

import { CostoXGalonService } from 'app/core/services/costo-x-galon.service';

@Component({
  selector: 'app-edit-si',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-si.component.html',
  styleUrl: './edit-si.component.css'
})
export class EditSIComponent {
  formESP: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private serviceDP: CostoXGalonService,
    public dialogRef: MatDialogRef<EditSIComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MecanismoI
  ){
    this.formESP = this.formBuilder.group({
      item : [{ value: '' , disabled: true }, Validators.required],
      costo_dia : ['', [Validators.required]],
    })
  }

  ngOnInit():void{
    this.formESP.patchValue(this.data)
  }

  save(): void {
    if (this.formESP.valid) {
      // Habilita el campo deshabilitado temporalmente para obtener sus valores
      this.formESP.get('item')?.enable();

      const derePesca: MecanismoI = this.formESP.getRawValue(); // getRawValue() obtiene los valores incluso de los campos deshabilitados

      console.log('Datos del formulario:', derePesca);
      console.log('Todos los datos del formulario:', this.formESP.value);

      // Vuelve a deshabilitar el campo antes de enviar los datos
      this.formESP.get('item')?.disable();

      this.serviceDP.updateM(derePesca, this.data.id).subscribe(
        (res) => {
          console.log("DP actualizada:", res);
          this.dialogRef.close(res);
        },
        (error) => {
          console.error("Error al actualizar DP:", error);
        }
      );
    }
  }

  cancel() {
    this.dialogRef.close();
  }


}
