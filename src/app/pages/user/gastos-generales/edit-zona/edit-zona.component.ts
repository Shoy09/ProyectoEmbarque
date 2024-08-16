import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ZonaPescaI } from 'app/core/models/zonaPesca';
import { EmbarcacionesService } from 'app/core/services/embarcaciones.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-zona',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-zona.component.html',
  styleUrl: './edit-zona.component.css'
})
export class EditZonaComponent {

  formPutZona: FormGroup;

  constructor(
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private serviceZona: EmbarcacionesService,
    private dialogRef: MatDialogRef<EditZonaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ZonaPescaI
  ) {
    this.formPutZona = this.formBuilder.group({
      nombre: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.formPutZona.patchValue(this.data);
  }

  save(): void {
    if (this.formPutZona.valid) {
      const zona: ZonaPescaI = this.formPutZona.value;
      console.log("Datos enviados:", zona);

      this.serviceZona.updateZonaPesca(zona, this.data.id).subscribe(
        (res) => {
          console.log("DP actualizada:", res);
          this.dialogRef.close(res);
          this.toastr.success('Registro actualizado correctamente');
        },
        (error) => {
          console.error("Error al actualizar DP:", error);
          this.toastr.error('Hubo un error al actualizar el registro');
        }
      );
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
