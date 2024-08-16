import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Embarcaciones } from 'app/core/models/embarcacion';
import { FlotaDP } from 'app/core/models/flota.model';
import { ZonaPescaI } from 'app/core/models/zonaPesca';
import { EmbarcacionesService } from 'app/core/services/embarcaciones.service';
import { FlotaService } from 'app/core/services/flota.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-produccion-toneladas',
  standalone: true,
  imports: [MatDialogModule, CommonModule, ReactiveFormsModule],
  templateUrl: './create-produccion-toneladas.component.html',
  styleUrl: './create-produccion-toneladas.component.css'
})
export class CreateProduccionToneladasComponent implements OnInit{

  flota: FlotaDP[] = [];
  formCPT: FormGroup;
  embarcaciones: Embarcaciones[] = [];
  zona: ZonaPescaI[] = [];
  fecha: Date;
  embarcacion: number;
  nombreEmbarcacion: String = '';
  idFlota: any;

  @Output() dataSaved = new EventEmitter<boolean>();


  constructor(
    private formBuilder: FormBuilder,
    private embarcacionesService: EmbarcacionesService,
    private serviceFlota: FlotaService,
    public dialogRef: MatDialogRef<CreateProduccionToneladasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      embarcacion: number,
      fecha: Date,
      zona_pesca: number,
      toneladas_procesables: number,
      id?: any // Agrega el ID opcional para la actualización
    },
    private matDialog: MatDialog
  ) {
    this.fecha = data.fecha;
    this.embarcacion = data.embarcacion;
    this.idFlota = data.id; // Asigna el ID recibido

    this.formCPT = this.formBuilder.group({
      toneladas_procesadas: [this.data.toneladas_procesables, [Validators.required]],
      toneladas_procesadas_produccion: ['', [Validators.required]],
      toneladas_NP: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getEmbarcaciones();
    if (this.idFlota) {
      this.loadFlotaData(this.idFlota); // Carga los datos si estamos en modo edición
    }
  }

  loadFlotaData(id: any) {
    this.serviceFlota.getFlota(id).subscribe(flota => {
      this.formCPT.patchValue({
        toneladas_procesadas: flota.toneladas_procesadas,
        toneladas_procesadas_produccion: flota.toneladas_procesadas_produccion,
        toneladas_NP: flota.toneladas_NP,
      });
    });
  }

  getProduccionToneladas() {
    this.serviceFlota.getFlotas().subscribe(tone => this.flota = tone);
  }

  updateFlota() {
    // Obtiene los valores del formulario
    const toneladas_procesables = Number(this.formCPT.get('toneladas_procesadas')?.value) || 0;
    const toneladas_procesadas = Number(this.formCPT.get('toneladas_procesadas_produccion')?.value) || 0;

    // Validación para asegurar que toneladas_procesadas_produccion no sea mayor que toneladas_procesadas
    if (toneladas_procesadas > toneladas_procesables) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Error en los datos',
        text: 'La cantidad procesada no puede ser mayor que la cantidad procesable.',
        customClass: {
          popup: 'swal2-centered'
        }
      });
      return; // Salir de la función sin realizar la operación
    }

    // Filtra los campos que queremos actualizar
    const updatedFields = {
      toneladas_procesadas_produccion: toneladas_procesadas,
      toneladas_NP: this.formCPT.get('toneladas_NP')?.value
    };

    if (this.formCPT.valid && this.idFlota) {
      this.serviceFlota.updateFlotaToneladas(updatedFields, this.idFlota).subscribe(
        res => {
          console.log("Registro guardado: ", res);
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: '¡Registro guardado!',
            showConfirmButton: false,
            timer: 1500,
            customClass: {
              popup: 'swal2-centered'
            }
          });
          this.formCPT.reset();
          this.dialogRef.close(res);
          this.dataSaved.emit(true); // Emitir evento de éxito
        },
        error => {
          console.error("Error al actualizar Flota:", error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Hubo un error al actualizar la flota.',
            footer: '<a href="">Haz clic aquí para volver</a>',
            customClass: {
              popup: 'swal2-centered'
            }
          });
          this.dataSaved.emit(false); // Emitir evento de error
        }
      );
    }

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
