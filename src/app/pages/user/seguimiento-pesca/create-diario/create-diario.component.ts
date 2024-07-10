import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { IDiarioPesca } from 'app/core/models/diarioPesca.model';
import { DiarioPescaService } from 'app/core/services/diario-pesca.service';


@Component({
  selector: 'app-create-diario',
  standalone: true,
  imports: [MatDialogModule, CommonModule, ReactiveFormsModule],
  templateUrl: './create-diario.component.html',
  styleUrl: './create-diario.component.css'
})
export class CreateDiarioComponent {

  diario : IDiarioPesca[] = [];
  formCDP: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private diarioPescaService: DiarioPescaService,
    public dialogRef: MatDialogRef<CreateDiarioComponent>,
  ){
    this.formCDP = this.formBuilder.group({
      embarcacion: ['', [Validators.required]],
      flota: ['', [Validators.required]],
      fecha: ['', [Validators.required]],
      numero_alcance: ['', [Validators.required]],
      zona_pesca: ['', [Validators.required]],
      estrato: ['', [Validators.required]],
      rango_profundidad_inicial: ['', [Validators.required]],
      rango_profundidad_final: ['', [Validators.required]],
      tiempo_efectivo: ['', [Validators.required]],
      rango_talla_inicial:['', [Validators.required]],
      rango_talla_final: ['', [Validators.required]],
      moda: ['', [Validators.required]],
      porcentaje: ['', [Validators.required]],
      ar: ['', [Validators.required]],
      numero: ['', [Validators.required]],
    });
  }

  getDiarioPesca(){
    this.diarioPescaService.getDiarioPesca().subscribe(diario => this.diario = diario );
  }

  postDP() {
    if (this.formCDP.valid) {
      const value = this.formCDP.value;
      
      // Formatear la fecha correctamente
      const fecha = new Date();
      value.fecha = `${fecha.getFullYear()}-${('0' + (fecha.getMonth() + 1)).slice(-2)}-${('0' + fecha.getDate()).slice(-2)}`;
      
      this.diarioPescaService.postDiarioPesca(value).subscribe(
        res => {
          if (res) {
            console.log("DP guardada: ", res);
            this.formCDP.reset();
            this.dialogRef.close(res);
            this.getDiarioPesca();
          }
        }, 
        error => {
          console.error("Error al guardar DP:", error);
          console.error("Detalles del error:", error.error);
        }
      );
    }
  }
  

}
