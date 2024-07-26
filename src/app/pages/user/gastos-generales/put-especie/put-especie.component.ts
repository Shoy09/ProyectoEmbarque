import { CommonModule, formatDate } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Especies } from 'app/core/models/especie.model';
import { EspeciesService } from 'app/core/services/especies.service';

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
