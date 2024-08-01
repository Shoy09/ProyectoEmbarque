import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { IDiarioPesca } from 'app/core/models/diarioPesca.model';
import { Embarcaciones } from 'app/core/models/embarcacion';
import { Especies } from 'app/core/models/especie.model';
import { ZonaPescaI } from 'app/core/models/zonaPesca';
import { DiarioPescaService } from 'app/core/services/diario-pesca.service';
import { EmbarcacionesService } from 'app/core/services/embarcaciones.service';
import { EspeciesService } from 'app/core/services/especies.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-create-diario',
  standalone: true,
  imports: [MatDialogModule, CommonModule, ReactiveFormsModule],
  templateUrl: './create-diario.component.html',
  styleUrl: './create-diario.component.css'
})
export class CreateDiarioComponent implements OnInit{

  diario : IDiarioPesca[] = [];
  formCDP: FormGroup;
  embarcaciones: Embarcaciones[] = [];
  zona: ZonaPescaI[] = [];
  especies: Especies[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private especiesService: EspeciesService,
    private embarcacionesService: EmbarcacionesService,
    private diarioPescaService: DiarioPescaService,
    public dialogRef: MatDialogRef<CreateDiarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { flotaDP_id: number },
    private matDialog: MatDialog
  ){
    this.formCDP = this.formBuilder.group({
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
      flotaDP_id: [this.data.flotaDP_id, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getEspecies();
    this.getEmbarcaciones();
    this.getZonaPesca();
  }

  getDiarioPesca(){
    this.diarioPescaService.getDiarioPesca().subscribe(diario => this.diario = diario );
  }

  postDP() {
    if (this.formCDP.valid) {
      const value = this.formCDP.value;

      // Si ya tenemos una fecha seleccionada por el usuario, no la sobrescribimos
      if (!value.fecha) {
        const fecha = new Date();
        value.fecha = `${fecha.getFullYear()}-${('0' + (fecha.getMonth() + 1)).slice(-2)}-${('0' + fecha.getDate()).slice(-2)}`;
      }

      this.diarioPescaService.postDiarioPesca(value).subscribe(
        res => {
          if (res) {
            console.log("DP guardada: ", res);
            this.formCDP.reset(); // Limpiamos el formulario
            this.dialogRef.close(res); // Cerramos el diálogo actual
            this.getDiarioPesca(); // Actualizamos la lista de registros

            Swal.fire({
              title: 'Lance registrado correctamente!',
              text: '¿Desea agregar otro lance?',
              icon: 'success',
              showCancelButton: true,
              confirmButtonText: 'Sí, agregar otro',
              cancelButtonText: 'No, cerrar'
            }).then((result) => {
              if (result.isConfirmed) {
                // Si el usuario quiere continuar, abrimos el diálogo nuevamente usando MatDialog
                this.matDialog.open(CreateDiarioComponent, {
                  width: '500px',
                  data: { flotaDP_id: this.data.flotaDP_id }
                });
              } else {
                // Aquí puedes manejar la acción si el usuario elige no agregar otro registro
                this.dialogRef.close(); // O cierra el diálogo actual si es necesario
              }
            });
          }
        },
        error => {
          console.error("Error al guardar DP:", error);
          console.error("Detalles del error:", error.error);
        }
      );
    }
  }

  getEspecies() {
    this.especiesService.getDiarioPesca().subscribe(
      especies => {
        this.especies = especies;
        // Aquí puedes realizar cualquier otra lógica necesaria con los datos de especies
      },
      error => {
        console.error('Error al obtener especies:', error);
      }
    );
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

  getZonaPesca(){
    this.embarcacionesService.getZonaPesca().subscribe(
      zona => {
        this.zona = zona;
      },
      error => {
        console.error('Error al obtener zona:', error);
      }
    )
  }

  cancel() {
    this.dialogRef.close();
  }

}
