import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { IDiarioPesca } from 'app/core/models/diarioPesca.model';
import { DiarioPescaService } from 'app/core/services/diario-pesca.service';

@Component({
  selector: 'app-edit-diario',
  standalone: true,
  imports: [MatDialogModule, CommonModule, ReactiveFormsModule ],
  templateUrl: './edit-diario.component.html',
  styleUrl: './edit-diario.component.css'
})
export class EditDiarioComponent {

  formEDP: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private diarioPE: DiarioPescaService,
    public dialogRef: MatDialogRef<EditDiarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDiarioPesca
  ){
    this.formEDP = this.formBuilder.group({
      embarcacion: ['', [Validators.required]],
      flota: ['', [Validators.required]],
      fecha: ['', [Validators.required]],
      numero_alcance: ['', [Validators.required]],
      zona_pesca: ['', [Validators.required]],
      estrato: ['', [Validators.required]],
      profundidad: ['', [Validators.required]],
      tiempo_efectivo: ['', [Validators.required]],
      rango_talla_inicial:['', [Validators.required]],
      rango_talla_final: ['', [Validators.required]],
      moda: ['', [Validators.required]],
      porcentaje: ['', [Validators.required]],
      ar: ['', [Validators.required]],
      numero: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.formEDP.patchValue(this.data);
  }
  save(): void {
    if (this.formEDP.valid) {
      const diario: IDiarioPesca = this.formEDP.value;
      this.diarioPE.putDiarioPesca(diario, this.data.id).subscribe(
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

}
