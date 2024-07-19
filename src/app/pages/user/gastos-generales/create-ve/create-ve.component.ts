import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Embarcaciones } from 'app/core/models/embarcacion';
import { ConsumoViveresI } from 'app/core/models/tViveres.model';
import { CostoXGalonService } from 'app/core/services/costo-x-galon.service';
import { EmbarcacionesService } from 'app/core/services/embarcaciones.service';

@Component({
  selector: 'app-create-ve',
  standalone: true,
  imports: [MatDialogModule, CommonModule, ReactiveFormsModule],
  templateUrl: './create-ve.component.html',
  styleUrl: './create-ve.component.css'
})
export class CreateVEComponent {
  @Output() newCostoAdded = new EventEmitter<ConsumoViveresI>();
  @Input() updateTable!: EventEmitter<void>;

  costo_x_zarpe: ConsumoViveresI[] = []
  formCVZ : FormGroup;
  embarcaciones: Embarcaciones[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private embarcacionesService: EmbarcacionesService,
    private serviceViveresZarpe: CostoXGalonService,
    public dialogRef: MatDialogRef<CreateVEComponent>,
  ){
    this.formCVZ = this.formBuilder.group({
      embarcacion: ['', [Validators.required]],
      costo_zarpe: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getEmbarcaciones();

    if (this.updateTable) {
      this.updateTable.subscribe(() => {
        this.dialogRef.close(); // O cualquier otra acción que desees realizar
      });
    }
  }

  getEmbarcaciones() {
    this.embarcacionesService.getEmbarcaciones().subscribe(
      embarcaciones => {
        this.embarcaciones = embarcaciones;
        // Aquí puedes realizar cualquier otra lógica necesaria con los datos de especies
      },
      error => {
        console.error('Error al obtener embarcaciones:', error);
      }
    );
  }
  postCostoViEm() {
    if (this.formCVZ.valid) {
      const value = this.formCVZ.value;

      this.serviceViveresZarpe.postCV(value).subscribe(
        res => {
          if (res) {
            console.log("costo x zarpe guardado", res);
            this.formCVZ.reset();
            this.newCostoAdded.emit(res); // Emitir el evento con el nuevo dato
            this.dialogRef.close();
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
