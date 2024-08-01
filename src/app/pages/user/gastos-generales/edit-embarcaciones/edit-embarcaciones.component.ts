import { CommonModule, formatDate } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Embarcaciones } from 'app/core/models/embarcacion';
import { EmbarcacionesService } from 'app/core/services/embarcaciones.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-embarcaciones',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-embarcaciones.component.html',
  styleUrl: './edit-embarcaciones.component.css'
})
export class EditEmbarcacionesComponent {
  formPutEmbarcacion: FormGroup

  constructor(
    private _toastr: ToastrService,
    private fomrBuilder: FormBuilder,
    private serviceEmbarcacion: EmbarcacionesService,
    private dialog: MatDialogRef<EditEmbarcacionesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Embarcaciones
  ){
    this.formPutEmbarcacion = this.fomrBuilder.group({
      nombre: ['', [Validators.required]],
      costo_zarpe: ['', [Validators.required]],
      bonificacion: [''],
      boner: ['', [Validators.required]],
      fecha: [new Date(), Validators.required]
    })
  }

  ngOnInit(): void {
    this.formPutEmbarcacion.patchValue(this.data)
  }

  save(): void {
    if (this.formPutEmbarcacion.valid) {
      // Formatea la fecha al día actual en formato 'YYYY-MM-DD'
      const currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
      this.formPutEmbarcacion.get('fecha')!.setValue(currentDate);

      const embarcacion: Embarcaciones = this.formPutEmbarcacion.value;
      console.log("Datos enviados:", embarcacion);

      this.serviceEmbarcacion.updateEmbarcaciones(embarcacion, this.data.id).subscribe(
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
