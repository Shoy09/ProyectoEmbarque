import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CostoXGalonService } from 'app/core/services/costo-x-galon.service';

@Component({
  selector: 'app-create-hielo',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-hielo.component.html',
  styleUrl: './create-hielo.component.css'
})
export class CreateHieloComponent {

  formCreateHielo: FormGroup;

  @Output() dataSaved = new EventEmitter<void>();

  constructor(
    private serviceHielo: CostoXGalonService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreateHieloComponent>
  ) {
    this.formCreateHielo = this.formBuilder.group({
      costo: ['', [Validators.required]]
    })
  }

  save(){
    if (this.formCreateHielo.valid) {
      const value = this.formCreateHielo.value;
      value.fecha = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
      console.log("Datos a enviar:", value);
      this.serviceHielo.postCTMHielo(value).subscribe(res => {
        if (res) {
          console.log("Dato ingresado correctamente:", res);
          this.formCreateHielo.reset();
          this.dialogRef.close();
          this.dataSaved.emit(); // Emitir evento para notificar al componente padre
        }
      }, error => {
        console.error("Error al guardar:", error);
      });
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
