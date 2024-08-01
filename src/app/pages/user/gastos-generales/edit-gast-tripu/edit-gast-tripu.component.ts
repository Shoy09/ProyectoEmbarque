import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TarifaCostoI } from 'app/core/models/tarifaCosto.model';
import { CostoXGalonService } from 'app/core/services/costo-x-galon.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-gast-tripu',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-gast-tripu.component.html',
  styleUrl: './edit-gast-tripu.component.css'
})
export class EditGastTripuComponent {
  formPutGT: FormGroup

  constructor(
    private _toastr: ToastrService,
    private fomrBuilder: FormBuilder,
    private serviceGT : CostoXGalonService,
    private dialog: MatDialogRef<EditGastTripuComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TarifaCostoI
  ){
    this.formPutGT = this.fomrBuilder.group({
      nombre_t: ['', [Validators.required]],
      tarifa: ['', [Validators.required]]
    })
  }

  ngOnInit(): void{
    this.formPutGT.patchValue(this.data)
  }

  save(): void {
    if (this.formPutGT.valid) {

      const embarcacion: TarifaCostoI = this.formPutGT.value;
      console.log("Datos enviados:", embarcacion);

      this.serviceGT.updateTarifa(embarcacion, this.data.id).subscribe(
        (res) => {
          console.log("DP actualizada:", res);
          this.dialog.close(res);
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
    this.dialog.close();
  }



}
