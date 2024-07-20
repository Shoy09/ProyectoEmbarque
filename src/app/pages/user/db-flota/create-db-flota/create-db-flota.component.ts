import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { Embarcaciones } from 'app/core/models/embarcacion';
import { FlotaDP } from 'app/core/models/flota.model';
import { ZonaPescaI } from 'app/core/models/zonaPesca';
import { CostoXGalonService } from 'app/core/services/costo-x-galon.service';
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
    MatNativeDateModule,
    MatSelectModule],
  templateUrl: './create-db-flota.component.html',
  styleUrl: './create-db-flota.component.css'
})

export class CreateDbFlotaComponent {

  embarcaciones: Embarcaciones[] = [];
  zona_pesca: ZonaPescaI[] = [];

  firstFormGroup = this._formBuilder.group({
    fecha: ['', Validators.required],
    tipo_cambio: [{ value: '', disabled: true }, Validators.required],
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
    toneladas_procesadas: ['', Validators.required],
    toneladas_recibidas: ['', Validators.required],
    total_tripulacion: ['', Validators.required]
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
    private costoXGalonService: CostoXGalonService,
    private flotaService: FlotaService
  ) {}

  ngOnInit(): void {
    this.getEmbarcaciones();
    this.getZonaPesca();
    this.loadLastTipoCambio();
  }

  getEmbarcaciones() {
    this.embarcacionesService.getEmbarcaciones().subscribe(
      embarcaciones => {
        this.embarcaciones = embarcaciones;
      },
      error => {
        console.error('Error al obtener embarcaciones:', error);
      }
    );
  }

  getZonaPesca(){
    this.embarcacionesService.getZonaPesca().subscribe(
      zona_pesca => {
        this.zona_pesca = zona_pesca;
      },
      error => {
        console.error('Error al obtener zona_pesca:', error);
      }
    );
  }

  loadLastTipoCambio() {
    this.costoXGalonService.getLastTipoCambio().subscribe(lastTipoCambio => {
      if (lastTipoCambio) {
        // Convierte el valor a string antes de asignarlo
        this.firstFormGroup.patchValue({ tipo_cambio: String(lastTipoCambio.costo) });
      }
    });
  }

  





}
