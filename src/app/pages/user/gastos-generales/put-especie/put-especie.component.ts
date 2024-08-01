import { CommonModule, formatDate } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Especies } from 'app/core/models/especie.model';
import { EspeciesService } from 'app/core/services/especies.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-put-especie',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './put-especie.component.html',
  styleUrl: './put-especie.component.css'
})
export class PutEspecieComponent {

  fomrPutEspecie: FormGroup;

  constructor(
    private _toastr: ToastrService,
    private formBuilder: FormBuilder,
    private especie: EspeciesService,
    private dialogRef: MatDialogRef<PutEspecieComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Especies
  ){
    this.fomrPutEspecie = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      precio: ['', [Validators.required]],
      fecha: [new Date(), Validators.required]
    })
  }

  ngOnInit(): void{
    this.fomrPutEspecie.patchValue(this.data)
  }

  save(): void {
    if (this.fomrPutEspecie.valid) {
      // Formatea la fecha al día actual en formato 'YYYY-MM-DD'
      const currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
      this.fomrPutEspecie.get('fecha')!.setValue(currentDate);

      const especie: Especies = this.fomrPutEspecie.value;
      console.log("Datos enviados:", especie);

      this.especie.putEspecie(especie, this.data.id).subscribe(
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
