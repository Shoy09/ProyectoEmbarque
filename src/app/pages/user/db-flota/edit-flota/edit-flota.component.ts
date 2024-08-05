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
    //costo_gasolina: ['', Validators.required],
    total_gasolina: [0],
    galon_hora: [0],
    consumo_hielo: [0, Validators.required],
    //costo_hilo: ['', Validators.required],
    total_hielo: [0],
    consumo_agua: [, Validators.required],
    //costo_agua: ['', Validators.required],
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

    flotaData.consumo_gasolina = flotaData.consumo_gasolina ?? null;
    flotaData.consumo_viveres = flotaData.consumo_viveres ?? null;

    this.firstFormGroup.patchValue(flotaData);
    this.secondFormGroup.patchValue(flotaData);
    this.loadEmbarcaciones();
    this.loadZonas();
  }

  loadEmbarcaciones(): void {
    this.embarcacionService.getEmbarcaciones().subscribe(data => {
      this.embarcaciones = data;
    });
  }

  loadZonas(): void {
    this.embarcacionService.getZonaPesca().subscribe(data => {
      this.zona = data;
    });
  }

  closeStepper() {
    this.showStepper = false;
    const overlayContainers = document.querySelectorAll('.cdk-overlay-container');
    overlayContainers.forEach(container => {
        container.innerHTML = '';
    });
  }

  save(): void {
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
        total_gasolina: Number(formData.total_gasolina),
        galon_hora: Number(formData.galon_hora),
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
