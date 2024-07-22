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
import { CostoGalonGasoI } from 'app/core/models/costoGG.model';
import { CostoTMHielo } from 'app/core/models/costoGH.model';
import { CostoM3Agua } from 'app/core/models/costoMA.model';
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
  toneladasProcesadas: number = 0;
  toneladasRecibidas: number = 0;
  lastCosto?: CostoGalonGasoI;
  lastCostoHielo?: CostoTMHielo;
  lastCostoAgua?: CostoM3Agua;
  costoZarpe?: number;

  firstFormGroup = this._formBuilder.group({
    fecha: ['', Validators.required],
    tipo_cambio: [{ value: '', disabled: true }, Validators.required],
    consumo_viveres: [0, Validators.required],
    total_vivieres: [{ value: 0, disabled: true }, Validators.required],
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
    total_tripulacion: ['', Validators.required]
  });

  secondFormGroup = this._formBuilder.group({
    consumo_gasolina: [0, Validators.required],
    total_gasolina: [{ value: 0, disabled: true }, Validators.required],
    consumo_hielo: [0, Validators.required],
    total_hielo: [{ value: 0, disabled: true }, Validators.required],
    consumo_agua: [0, Validators.required],
    total_agua: [{ value: 0, disabled: true }, Validators.required],
    dias_inspeccion: ['', Validators.required],
    costo_inspeccion: [141.98, Validators.required],
    total_servicio_inspeccion: [0, Validators.required],
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
    this.loadLastCosto();
    this.loadLastCostoHielo();
    this.loadLastAgua();
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
        this.firstFormGroup.patchValue({ tipo_cambio: String(lastTipoCambio.costo) });
      }
    });
  }

  //COMBUSTIBLE

  loadLastCosto() {
    this.costoXGalonService.getLastCosto().subscribe(lastCosto => {
      this.lastCosto = lastCosto;
      this.calculateTotalGasolina();
    });
  }

  calculateTotalGasolina() {
    if (this.lastCosto) {
      const consumoGasolina = Number(this.secondFormGroup.get('consumo_gasolina')?.value) || 0;
      const costoGalon = this.lastCosto.costo;
      const totalGasolina = consumoGasolina * costoGalon;
      this.secondFormGroup.patchValue({ total_gasolina: totalGasolina });
    }
  }

  //HIELO
  loadLastCostoHielo(){
    this.costoXGalonService.getLastCostoHielo().subscribe(lastCosto => {
      this.lastCostoHielo = lastCosto;
      this.totalHielo();
    });
  }

  totalHielo(){
    if (this.lastCostoHielo) {
      const consumo = Number(this.secondFormGroup.get('consumo_hielo')?.value) || 0;
      const costoGalon = this.lastCostoHielo.costo;
      const total = consumo * costoGalon;
      this.secondFormGroup.patchValue({ total_hielo: total });
    }
  }

  //AGUA
  loadLastAgua(){
    this.costoXGalonService.getLastM3Agua().subscribe(lastCosto => {
      this.lastCostoAgua = lastCosto;
      this.totalAgua();
    });
  }

  totalAgua(){
    if (this.lastCostoAgua) {
      const consumo = Number(this.secondFormGroup.get('consumo_agua')?.value) || 0;
      const costoGalon = this.lastCostoAgua.costo;
      const total = consumo * costoGalon;
      this.secondFormGroup.patchValue({ total_agua: total });
    }
  }

  //VIVERES POR EMBARCACIÓN
  calculateTotalVivieres(embarcacionId: number): void {
    const selectedEmbarcacion = this.embarcaciones.find(e => e.id === embarcacionId);
    if (selectedEmbarcacion) {
      const consumoViveres = Number(this.firstFormGroup.get('consumo_viveres')?.value) || 0;
      console.log(`Consumo de Viveres: ${consumoViveres}`);

      const costoZarpe = selectedEmbarcacion.costo_zarpe;
      const totalVivieres = consumoViveres * costoZarpe;
      console.log(`Calculando totalVivieres: ${consumoViveres} * ${costoZarpe} = ${totalVivieres}`);
      this.firstFormGroup.patchValue({ total_vivieres: totalVivieres });
    }
  }

  //SERVICIO DE INSPECCION
  calculateTotalServicioInspeccion(): void {
    const diasInspeccion = Number(this.secondFormGroup.get('dias_inspeccion')?.value) || 0;
    const costoInspeccion = Number(this.secondFormGroup.get('costo_inspeccion')?.value) || 141.98;
    console.log('Días de inspección:', diasInspeccion); // Debug log
    console.log('Costo de inspección:', costoInspeccion); // Debug log
    const totalServicioInspeccion = diasInspeccion * costoInspeccion;
    this.secondFormGroup.patchValue({ total_servicio_inspeccion: totalServicioInspeccion });
  }

  //TONELADAS

  calculateToneladas(): void {
    const totalMerluza = Number(this.firstFormGroup.get('merluza')?.value) || 0;
    const totalBereche = Number(this.firstFormGroup.get('bereche')?.value) || 0;
    const totalVolador = Number(this.firstFormGroup.get('volador')?.value) || 0;
    const totalMerluzaDescarte = Number(this.firstFormGroup.get('merluza_descarte')?.value) || 0;
    const totalKiloOtro = Number(this.firstFormGroup.get('kilo_otro')?.value) || 0;

    console.log("Valores de toneladas:", totalMerluza, totalBereche, totalVolador, totalMerluzaDescarte, totalKiloOtro);

    this.toneladasProcesadas = Number(((totalMerluza + totalBereche + totalVolador + totalKiloOtro) / 1000).toFixed(2));
    this.toneladasRecibidas = Number((this.toneladasProcesadas + (totalMerluzaDescarte / 1000)).toFixed(2));

    console.log("Toneladas Procesadas:", this.toneladasProcesadas, "Toneladas Recibidas:", this.toneladasRecibidas);
  }

  //metodo post
  submitForm(): void {
    if (this.firstFormGroup.valid && this.secondFormGroup.valid) {
      this.calculateToneladas();
      this.calculateTotalGasolina();
      this.totalHielo();
      this.totalAgua();
      this.calculateTotalVivieres;
      this.calculateTotalServicioInspeccion();
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
        toneladas_procesadas: this.toneladasProcesadas,
        toneladas_recibidas: this.toneladasRecibidas,
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
