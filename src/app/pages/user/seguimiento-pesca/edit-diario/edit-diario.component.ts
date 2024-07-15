import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { IDiarioPesca } from 'app/core/models/diarioPesca.model';
import { Embarcaciones } from 'app/core/models/embarcacion';
import { Especies } from 'app/core/models/especie.model';
import { DiarioPescaService } from 'app/core/services/diario-pesca.service';
import { EmbarcacionesService } from 'app/core/services/embarcaciones.service';
import { EspeciesService } from 'app/core/services/especies.service';

@Component({
  selector: 'app-edit-diario',
  standalone: true,
  imports: [MatDialogModule, CommonModule, ReactiveFormsModule ],
  templateUrl: './edit-diario.component.html',
  styleUrl: './edit-diario.component.css'
})
export class EditDiarioComponent implements OnInit {

  formEDP: FormGroup;
  especies: Especies[] = [];
  embarcaciones: Embarcaciones[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private especiesService: EspeciesService,
    private embarcacionService: EmbarcacionesService,
    private diarioPE: DiarioPescaService,
    public dialogRef: MatDialogRef<EditDiarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDiarioPesca
  ){
    this.formEDP = this.formBuilder.group({
      embarcacion: ['', [Validators.required]],
      especie: ['', [Validators.required]],
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
    this.formEDP.patchValue(this.data); // Aplicamos los datos iniciales
    this.getEspecies();
    this.getEmbarcaciones();
  }

  getEspecies() {
    this.especiesService.getDiarioPesca().subscribe(
      (especies: Especies[]) => {
        this.especies = especies;
        // Ahora que tenemos las especies, podemos establecer el valor predeterminado correcto si data.especie existe
        if (this.data && this.data.especie) {
          this.formEDP.controls['especie'].setValue(this.data.especie);
        }
      },
      (error: any) => {
        console.error('Error al obtener especies:', error);
      }
    );
  }

  getEmbarcaciones() {
    this.embarcacionService.getEmbarcaciones().subscribe(
      (embarcaciones: Embarcaciones[]) => {
        this.embarcaciones = embarcaciones;
        // Ahora que tenemos las embarcaciones, podemos establecer el valor predeterminado correcto si data.embarcacion existe
        if (this.data && this.data.embarcacion) {
          this.formEDP.controls['embarcacion'].setValue(this.data.embarcacion);
        }
      },
      (error: any) => {
        console.error('Error al obtener embarcaciones:', error);
      }
    );
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
