import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { Embarcaciones } from 'app/core/models/embarcacion';
import { FlotaDP } from 'app/core/models/flota.model';
import { ZonaPescaI } from 'app/core/models/zonaPesca';
import { EmbarcacionesService } from 'app/core/services/embarcaciones.service';
import { FlotaService } from 'app/core/services/flota.service';

@Component({
  selector: 'app-edit-flota',
  standalone: true,
  imports: [CommonModule,
    MatStepperModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
  ],
  templateUrl: './edit-flota.component.html',
  styleUrl: './edit-flota.component.css'
})
export class EditFlotaComponent implements OnInit {

  embarcaciones: Embarcaciones[] = [];
  embarcacionSeleccionada: Embarcaciones | undefined;
  zona: ZonaPescaI[] = [];
  showStepper: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private serviceFlota: FlotaService,
    private embarcacionService: EmbarcacionesService,
    public dialogRef: MatDialogRef<EditFlotaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FlotaDP
  ){}

  firstFormGroup = this.formBuilder.group({
    fecha: ['', Validators.required],
    consumo_viveres: [0, Validators.required],
    total_vivieres: [0],
    embarcacion: ['', Validators.required],
    zona_pesca: ['', Validators.required],
    horas_faena: ['', Validators.required],
    kilos_declarados: ['', Validators.required],
    merluza: [0],
    precio_merluza: [0],
    bereche: [0],
    precio_bereche: [0],
    volador: [0],
    precio_volador: [0],
    merluza_descarte: [0],
    precio_merluzaNP: [0],
    otro: [''],
    kilo_otro: [0],
    precio_otro: [0],
    costo_basico: [0],
    participacion: [0],
    bonificacion: [0],
    total_participacion: [0],
    aporte_REP: [0],
    gratificacion: [0],
    vacaciones: [0],
    cts: [0],
    essalud: [0],
    senati: [0],
    SCTR_SAL: [0],
    SCTR_PEN: [0],
    poliza_seguro: [0],
    total_tripulacion: [0],
    toneladas_recibidas: [0],
    toneladas_procesadas: [0],
  });

  secondFormGroup = this.formBuilder.group({
    consumo_gasolina: [0, Validators.required],
    costo_gasolina: ['', Validators.required],
    total_gasolina: [0],
    galon_hora: [0],
    consumo_hielo: [0, Validators.required],
    costo_hilo: ['', Validators.required],
    total_hielo: [0],
    consumo_agua: [, Validators.required],
    costo_agua: ['', Validators.required],
    total_agua: [0],
    dias_inspeccion: [0],
    tipo_cambio: [0],
    total_servicio_inspeccion: [0],
    total_derecho_pesca: [0],
    total_costo: [0],
    costo_tm_captura: [0],
    csot: [0],
  })

  ngOnInit(): void {
    const flotaData: any = { ...this.data };

    this.firstFormGroup.patchValue(flotaData);
    this.secondFormGroup.patchValue(flotaData);
    this.loadEmbarcaciones();
    this.loadZonas();

    if (flotaData.embarcacion) {
      this.onSelectEmbarcacion(flotaData.embarcacion);
    }
  }

  // CARGAR EMBARCACION
  loadEmbarcaciones(): void {
    this.embarcacionService.getEmbarcaciones().subscribe(data => {
      this.embarcaciones = data;
    });
  }

  //CARGAR ZONAS
  loadZonas(): void {
    this.embarcacionService.getZonaPesca().subscribe(data => {
      this.zona = data;
    });
  }

  //COSTO X ESPECIES
  editCostoBasico(): void {
    const precio_merluza = Number(this.firstFormGroup.get('precio_merluza')?.value) || 0;
    const precio_bereche = Number(this.firstFormGroup.get('precio_bereche')?.value) || 0;
    const precio_volador = Number(this.firstFormGroup.get('precio_volador')?.value) || 0;
    const precio_merluzaNP = Number(this.firstFormGroup.get('precio_merluzaNP')?.value) || 0;
    const precio_otro = Number(this.firstFormGroup.get('precio_otro')?.value) || 0;

    const costoEspecies = precio_merluza + precio_bereche + precio_volador + precio_merluzaNP + precio_otro

    const redondeo = parseFloat(costoEspecies.toFixed(2))

    this.firstFormGroup.patchValue({costo_basico: redondeo})
  }

  //EDIT TONELADAS
  editToneladas(): void {
    const totalMerluza = Number(this.firstFormGroup.get('merluza')?.value) || 0;
    const totalBereche = Number(this.firstFormGroup.get('bereche')?.value) || 0;
    const totalVolador = Number(this.firstFormGroup.get('volador')?.value) || 0;
    const totalMerluzaDescarte = Number(this.firstFormGroup.get('merluza_descarte')?.value) || 0;
    const totalKiloOtro = Number(this.firstFormGroup.get('kilo_otro')?.value) || 0;

    const toneladasProcesadas = Number(((totalMerluza + totalBereche + totalVolador + totalKiloOtro) / 1000).toFixed(2));
    const toneladasRecibidas = Number(( toneladasProcesadas + (totalMerluzaDescarte / 1000)).toFixed(2));

    this.firstFormGroup.patchValue({ toneladas_procesadas: toneladasProcesadas, toneladas_recibidas: toneladasRecibidas})
  }

  //PARTICIPACIÓN
  editParticipacion():void{
    const toneladasRecibidas = Number(this.firstFormGroup.get('toneladas_recibidas')?.value) || 0;
    const costoBasico = Number(this.firstFormGroup.get('costo_basico')?.value) || 0;
    const participacion = toneladasRecibidas * costoBasico * 0.33
    console.log(`Calculando totalVivieres: ${costoBasico} * ${toneladasRecibidas} * 0.33 = ${participacion}`);
    const participacionRedondeada = parseFloat(participacion.toFixed(2));
    this.firstFormGroup.patchValue({participacion: participacionRedondeada});
  }

  //BONIFICACIÓN
  onSelectEmbarcacion(embarcacionId: number): void {
    this.embarcacionSeleccionada = this.embarcaciones.find(e => e.id === embarcacionId);
    if (!this.embarcacionSeleccionada) {
      console.log("No se encontró la embarcación con el ID proporcionado.");
    }
    this.calculateBonificacion();
  }

  calculateBonificacion(): void {
    if (!this.embarcacionSeleccionada) {
      console.log("No se ha seleccionado una embarcación.");
      return;
    }

    const participacion = Number(this.firstFormGroup.get('participacion')?.value) || 0;
    console.log(`Participación: ${participacion}`);

    if (isNaN(participacion) || participacion === 0) {
      console.log("La participación aún no está disponible.");
      return;
    }

    const bonificacion = Number(this.embarcacionSeleccionada.bonificacion) || 0;
    if (bonificacion > 0) {
      const totalBonificacion = participacion / bonificacion;
      const redondeo = parseFloat(totalBonificacion.toFixed(2))
      console.log(`Calculando bonificación: (${participacion} / ${bonificacion}) =  ${totalBonificacion}`);
      this.firstFormGroup.patchValue({ bonificacion: redondeo });
    } else {
      this.firstFormGroup.patchValue({ bonificacion: 0 });
    }
  }

  //TOTAL PARTICIPACIÓN
  editParticipaciónTotal():void{
    const participacion = Number(this.firstFormGroup.get('participacion')?.value) || 0;
    const bonificacion = Number(this.firstFormGroup.get('bonificacion')?.value) || 0;

    const participacion_total = participacion + bonificacion
    const redondeo = parseFloat(participacion_total.toFixed(2));
    this.firstFormGroup.patchValue({total_participacion: redondeo })
  }

  closeStepper() {
    this.showStepper = false;
    const overlayContainers = document.querySelectorAll('.cdk-overlay-container');
    overlayContainers.forEach(container => {
        container.innerHTML = '';
    });
  }

  save(): void {
    this.editCostoBasico()
    this.editToneladas()
    this.editParticipacion()
    this.editParticipaciónTotal()

    // Obtener los valores de ambos formularios
    const formData = Object.assign({}, this.firstFormGroup.value, this.secondFormGroup.value);

    // Combinar los datos del formulario con los datos originales
    const updateData: FlotaDP = {
      fecha: formData.fecha || '',
        tipo_cambio: Number(formData.tipo_cambio),
        embarcacion: Number(formData.embarcacion),
        zona_pesca: Number(formData.zona_pesca),
        horas_faena: formData.horas_faena || '',
        kilos_declarados: Number(formData.kilos_declarados),
        merluza: formData.merluza ? Number(formData.merluza) : undefined,
        precio_merluza: formData.precio_merluza ? Number(formData.precio_merluza) : undefined,
        bereche: formData.bereche ? Number(formData.bereche) : undefined,
        precio_bereche: formData.precio_bereche ? Number(formData.precio_bereche) : undefined,
        volador: formData.volador ? Number(formData.volador) : undefined,
        precio_volador: formData.precio_volador ? Number(formData.precio_volador) : undefined,
        merluza_descarte: formData.merluza_descarte ? Number(formData.merluza_descarte) : undefined,
        precio_merluzaNP: formData.precio_merluzaNP ? Number(formData.precio_merluzaNP) : undefined,
        otro: formData.otro || undefined,
        kilo_otro: formData.kilo_otro ? Number(formData.kilo_otro) : undefined,
        precio_otro: formData.precio_otro ? Number(formData.precio_otro) : undefined,
        toneladas_procesadas: Number(formData.toneladas_procesadas),
        toneladas_recibidas: Number(formData.toneladas_recibidas),
        costo_basico: Number(formData.costo_basico),
        participacion: Number(formData.participacion),
        bonificacion: Number(formData.bonificacion),
        total_participacion: Number(formData.total_participacion),
        aporte_REP: Number(formData.aporte_REP),
        gratificacion: Number(formData.gratificacion),
        vacaciones:Number(formData.vacaciones),
        cts:Number(formData.cts),
        essalud : Number(formData.essalud),
        senati: Number(formData.senati),
        SCTR_SAL: Number(formData.SCTR_SAL),
        SCTR_PEN: Number(formData.SCTR_PEN),
        poliza_seguro: Number(formData.poliza_seguro),
        total_tripulacion: Number(formData.total_tripulacion),
        consumo_gasolina: Number(formData.consumo_gasolina),
        costo_gasolina:  Number(formData.costo_gasolina),
        total_gasolina: Number(formData.total_gasolina),
        galon_hora: Number(formData.galon_hora),
        consumo_hielo: Number(formData.consumo_hielo),
        costo_hilo:  Number(formData.costo_hilo),
        total_hielo: Number(formData.total_hielo),
        consumo_agua: Number(formData.consumo_agua),
        costo_agua:  Number(formData.costo_agua),
        total_agua: Number(formData.total_agua),
        consumo_viveres: Number(formData.consumo_viveres),
        total_vivieres: Number(formData.total_vivieres),
        dias_inspeccion: Number(formData.dias_inspeccion),
        total_servicio_inspeccion: Number(formData.total_servicio_inspeccion),
        total_derecho_pesca: Number(formData.total_derecho_pesca),
        total_costo: Number(formData.total_costo),
        costo_tm_captura: Number(formData.costo_tm_captura),
        csot: Number(formData.csot),
    }

    console.log('updateData:', updateData);

    this.serviceFlota.updateFlota(updateData, this.data.id).subscribe({
      next: () => {

        this.dialogRef.close({ success: true });
      },
      error: (error) => {
        console.error('Error al actualizar la flota:', error);
        // Manejar el error según sea necesario
      }
    });
}


}
