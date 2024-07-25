import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { EspeciesService } from 'app/core/services/especies.service';

@Component({
  selector: 'app-create-especies',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-especies.component.html',
  styleUrl: './create-especies.component.css'
})
export class CreateEspeciesComponent {

  formCreateEspecie: FormGroup;

  @Output() dataSaved = new EventEmitter<void>();

  constructor(
    private servicioEspecie: EspeciesService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreateEspeciesComponent>
  ){
    this.formCreateEspecie = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      precio: ['', [Validators.required]],
    })
  }

  save(){
    if (this.formCreateEspecie.valid) {
      const value = this.formCreateEspecie.value;
      value.fecha = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
      console.log("Datos a enviar:", value);
      this.servicioEspecie.postEspecie(value).subscribe(res => {
        if (res) {
          console.log("Dato ingresado correctamente:", res);
          this.formCreateEspecie.reset();
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
