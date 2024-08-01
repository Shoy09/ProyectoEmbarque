import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Embarcaciones } from 'app/core/models/embarcacion';
import { EmbarcacionesService } from 'app/core/services/embarcaciones.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-ve',
  standalone: true,
  imports: [MatDialogModule, CommonModule, ReactiveFormsModule],
  templateUrl: './create-ve.component.html',
  styleUrl: './create-ve.component.css'
})
export class CreateVEComponent {

  formCVZ : FormGroup;
  @Output() dataSaved = new EventEmitter<void>();

  embarcaciones: Embarcaciones[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private embarcacionesService: EmbarcacionesService,
    public dialogRef: MatDialogRef<CreateVEComponent>,
  ){
    this.formCVZ = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      costo_zarpe: ['', [Validators.required]],
      bonificacion: [''],
      boner: ['', [Validators.required]]
    });
  }

  postCostoViEm() {
    if (this.formCVZ.valid) {
      const value = this.formCVZ.value;
      value.fecha = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
      console.log("Datos a enviar:", value);
      this.embarcacionesService.postEmbarcaciones(value).subscribe(res => {
        if (res) {
          console.log("Dato ingresado correctamente:", res);
          this.formCVZ.reset();
          this.dialogRef.close();
          this.dataSaved.emit(); // Emitir evento para notificar al componente padre
          Swal.fire( // Muestra la alerta
            'Éxito!',
            'El registro se guardó correctamente.',
            'success'
          );
        }
      }, error => {
        console.error("Error al guardar:", error);
      });
    }
  }

}
