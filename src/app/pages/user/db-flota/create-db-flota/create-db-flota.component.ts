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

  submitForm(): void {
    if (this.firstFormGroup.valid && this.secondFormGroup.valid) {
      // Obtén los valores de ambos formularios
      const formData = {
        ...this.firstFormGroup.getRawValue(),
        ...this.secondFormGroup.getRawValue()
      };

      // Convierte los valores a tipos apropiados si es necesario
      const flotaData: FlotaDP = {
        fecha: formData.fecha || '',
        tipo_cambio: Number(formData.tipo_cambio),
        embarcacion: Number(formData.embarcacion),
        zona_pesca: Number(formData.zona_pesca),
        horas_faena: formData.horas_faena || '',
        kilos_declarados: Number(formData.kilos_declarados),
        merluza: formData.merluza ? Number(formData.merluza) : undefined,
        bereche: formData.bereche ? Number(formData.bereche) : undefined,
        volador: formData.volador ? Number(formData.volador) : undefined,
        merluza_descarte: formData.merluza_descarte ? Number(formData.merluza_descarte) : undefined,
        otro: formData.otro || undefined,
        kilo_otro: formData.kilo_otro ? Number(formData.kilo_otro) : undefined,
        toneladas_procesadas: Number(formData.toneladas_procesadas),
        toneladas_recibidas: Number(formData.toneladas_recibidas),
        total_tripulacion: Number(formData.total_tripulacion),
        consumo_gasolina: Number(formData.consumo_gasolina),
        total_gasolina: Number(formData.total_gasolina),
        consumo_hielo: Number(formData.consumo_hielo),
        total_hielo: Number(formData.total_hielo),
        consumo_agua: Number(formData.consumo_agua),
        total_agua: Number(formData.total_agua),
        consumo_viveres: Number(formData.consumo_viveres),
        total_vivieres: Number(formData.total_vivieres),
        dias_inspeccion: Number(formData.dias_inspeccion),
        total_servicio_inspeccion: Number(formData.total_servicio_inspeccion),
        total_derecho_pesca: Number(formData.total_derecho_pesca),
        total_costo: Number(formData.total_costo),
        costo_tm_captura: Number(formData.costo_tm_captura),
      };

      // Envía los datos al servicio para crear la flota
      this.flotaService.createFlota(flotaData).subscribe(
        response => {
          console.log('Flota creada exitosamente', response);
          // Opcional: reinicia el formulario o muestra un mensaje de éxito
          this.firstFormGroup.reset();
          this.secondFormGroup.reset();
        },
        error => {
          console.error('Error al crear Flota', error);
        }
      );
    } else {
      console.error('El formulario no es válido.');
    }
  }


}
