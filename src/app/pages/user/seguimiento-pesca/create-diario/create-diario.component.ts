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
  fecha: Date;
  embarcacion: number;
  nombreEmbarcacion: String = '';

  constructor(
    private formBuilder: FormBuilder,
    private especiesService: EspeciesService,
    private embarcacionesService: EmbarcacionesService,
    private diarioPescaService: DiarioPescaService,
    public dialogRef: MatDialogRef<CreateDiarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      flotaDP_id: number,
      embarcacion: number,
      fecha: Date,
      zona_pesca:number,
      p_flota_dolares: number,
      t_flota: number
    },
    private matDialog: MatDialog
  ){

    this.fecha = data.fecha;
    this.embarcacion = data.embarcacion;

    this.formCDP = this.formBuilder.group({
      embarcacion: [this.data.embarcacion, [Validators.required]],
      especie: ['', [Validators.required]],
      fecha: [this.data.fecha, [Validators.required]],
      numero_alcance: ['', [Validators.required]],
      zona_pesca: [this.data.zona_pesca, [Validators.required]],
      estrato: ['', [Validators.required]],
      profundidad: ['', [Validators.required]],
      tiempo_efectivo: ['', [Validators.required]],
      rango_talla_inicial:['', [Validators.required]],
      rango_talla_final: ['', [Validators.required]],
      moda: ['', [Validators.required]],
      porcentaje: ['', [Validators.required]],
      ar: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      flotaDP_id: [this.data.flotaDP_id, [Validators.required]],
      p_flota_dolares: [this.data.p_flota_dolares, [Validators.required]],
      t_flota: [this.data.t_flota, [Validators.required]],
      precio_lances: [{ value: 0, disabled: true }, Validators.required],
    });
  }

  ngOnInit(): void {
    this.getEspecies();
    this.getEmbarcaciones();
  }

  getDiarioPesca(){
    this.diarioPescaService.getDiarioPesca().subscribe(diario => this.diario = diario );
  }

  calculatePrecioLance():void{
    const p_flota = Number(this.formCDP.get('p_flota_dolares')?.value) || 0;
    const t_flota = Number(this.formCDP.get('t_flota')?.value) || 0;
    const precio_t = p_flota/t_flota
    const tonelada_captura_lance = Number(this.formCDP.get('numero')?.value) || 0;
    const precio_x_lance = precio_t * tonelada_captura_lance

    const redondeo = parseFloat(precio_x_lance.toFixed(2))
    this.formCDP.patchValue({precio_lances: redondeo})
  }

  postDP() {
    if (this.formCDP.valid) {
      this.calculatePrecioLance();
      this.formCDP.get('precio_lances')?.enable(); // Habilita el campo antes de enviar

      const value = this.formCDP.value;

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
                  data: { flotaDP_id: this.data.flotaDP_id,
                    embarcacion: this.data.embarcacion,
                    fecha: this.data.fecha,
                    zona_pesca: this.data.zona_pesca }
                });
              } else {
                this.dialogRef.close();
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
        this.setNombreEmbarcacion();
      },
      error => {
        console.error('Error al obtener embarcaciones:', error);
      }
    );
  }

  setNombreEmbarcacion() {
    const embarcacion = this.embarcaciones.find(e => e.id === this.embarcacion);
    if (embarcacion) {
      this.nombreEmbarcacion = embarcacion.nombre;
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
