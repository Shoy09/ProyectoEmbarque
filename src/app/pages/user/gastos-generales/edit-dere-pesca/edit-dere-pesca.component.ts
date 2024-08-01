import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DerechoPI } from 'app/core/models/derechoP.model';
import { CostoXGalonService } from 'app/core/services/costo-x-galon.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-dere-pesca',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-dere-pesca.component.html',
  styleUrl: './edit-dere-pesca.component.css'
})
export class EditDerePescaComponent {

  formEDePesca: FormGroup;

  constructor(
    private _toastr: ToastrService,
    private formBuilder: FormBuilder,
    private serviceDP: CostoXGalonService,
    public dialogRef: MatDialogRef<EditDerePescaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DerechoPI
  ){
    this.formEDePesca = this.formBuilder.group({
      item : [{ value: '' , disabled: true }, Validators.required],
      costo : ['', [Validators.required]],
    })
  }

  ngOnInit():void{
    this.formEDePesca.patchValue(this.data)
  }

  save(): void {
    if (this.formEDePesca.valid) {
      // Habilita el campo deshabilitado temporalmente para obtener sus valores
      this.formEDePesca.get('item')?.enable();

      const derePesca: DerechoPI = this.formEDePesca.getRawValue(); // getRawValue() obtiene los valores incluso de los campos deshabilitados

      // Vuelve a deshabilitar el campo antes de enviar los datos
      this.formEDePesca.get('item')?.disable();

      this.serviceDP.updateDerechoPesca(derePesca, this.data.id).subscribe(
        (res) => {
          console.log("DP actualizada:", res);
          this.dialogRef.close(res);
          this._toastr.success('Registro actualizado correctamente');
        },
        (error) => {
          console.error("Error al actualizar DP:", error);
          this._toastr.error('Hubo un error al actualizar el registro');
        }
      );
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
