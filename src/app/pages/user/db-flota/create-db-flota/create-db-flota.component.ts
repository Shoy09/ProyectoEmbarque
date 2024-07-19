import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { Embarcaciones } from 'app/core/models/embarcacion';
import { EmbarcacionesService } from 'app/core/services/embarcaciones.service';
import { FlotaService } from 'app/core/services/flota.service';

@Component({
  selector: 'app-create-db-flota',
  standalone: true,
  imports: [CommonModule, MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule],
  templateUrl: './create-db-flota.component.html',
  styleUrl: './create-db-flota.component.css'
})

export class CreateDbFlotaComponent {

  embarcaciones: Embarcaciones[] = [];


  firstFormGroup = this._formBuilder.group({
    fecha: ['', Validators.required],
    tipo_cambio: ['', Validators.required],
    embarcacion: ['', Validators.required],
    zona_pesca: ['', Validators.required],
    horas_faena: ['', Validators.required],
    kilos_declarados: ['', Validators.required],
    merluza: [''],
    bereche: [''],
    volador: [''],
    merluza_descarte: [''],
    otro: [''],
    kilo_otro: [''],
    toneladas_procesadas: [''],
    toneladas_recibidas: [''],
    total_tripulacion: [''],
  });

  secondFormGroup = this._formBuilder.group({
    consumo_gasolina: ['', Validators.required],
    total_gasolina: ['', Validators.required],
    consumo_hielo: ['', Validators.required],
    total_hielo: ['', Validators.required],
    consumo_agua: ['', Validators.required],
    total_agua: ['', Validators.required],
    consumo_viveres: ['', Validators.required],
    total_vivieres: ['', Validators.required],
    dias_inspeccion: ['', Validators.required],
    total_servicio_inspeccion: ['', Validators.required],
    total_derecho_pesca: ['', Validators.required],
    total_costo: ['', Validators.required],
    costo_tm_captura: ['', Validators.required],
  });

  isEditable = false;

  constructor(
    private _formBuilder: FormBuilder,
    private embarcacionesService: EmbarcacionesService,
    serviceFlota: FlotaService
  ) {}

  ngOnInit(): void {
    this.getEmbarcaciones();
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

}
