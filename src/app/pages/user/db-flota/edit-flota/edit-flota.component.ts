import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Embarcaciones } from 'app/core/models/embarcacion';
import { FlotaDP } from 'app/core/models/flota.model';
import { ZonaPescaI } from 'app/core/models/zonaPesca';
import { EmbarcacionesService } from 'app/core/services/embarcaciones.service';
import { EspeciesService } from 'app/core/services/especies.service';
import { FlotaService } from 'app/core/services/flota.service';

@Component({
  selector: 'app-edit-flota',
  standalone: true,
  imports: [],
  templateUrl: './edit-flota.component.html',
  styleUrl: './edit-flota.component.css'
})
export class EditFlotaComponent {

  formEditFlota: FormGroup;
  embarcaciones: Embarcaciones[] = [];
  zona: ZonaPescaI[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private serviceFlota: FlotaService,
    private especiesService: EspeciesService,
    private embarcacionService: EmbarcacionesService,
    @Inject(MAT_DIALOG_DATA) public data: FlotaDP
  ){
    this.formEditFlota = this.formBuilder.group({
      fecha: ['', Validators.required],
    consumo_viveres: [, Validators.required],
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
    precio_otro: [ ],
    costo_basico:  [{ value: 0, disabled: true }, Validators.required],
    participacion: [{ value: 0, disabled: true }, Validators.required],
    bonificacion: [{ value: 0, disabled: true }, Validators.required],
    total_participacion: [{ value: 0, disabled: true }, Validators.required],
    aporte_REP: [{ value: 0, disabled: true }, Validators.required],
    gratificacion: [{ value: 0, disabled: true }, Validators.required],
    vacaciones: [{ value: 0, disabled: true }, Validators.required],
    cts: [{ value: 0, disabled: true }, Validators.required],
    essalud: [{ value: 0, disabled: true }, Validators.required],
    senati: [{ value: 0, disabled: true }, Validators.required],
    SCTR_SAL: [{ value: 0, disabled: true }, Validators.required],
    SCTR_PEN: [{ value: 0, disabled: true }, Validators.required],
    poliza_seguro: [{ value: 0, disabled: true }, Validators.required],
    total_tripulacion: [{ value: 0, disabled: true }, Validators.required],
    consumo_gasolina: [, Validators.required],
    costo_gasolina: ['', Validators.required],
    total_gasolina: [{ value: 0, disabled: true }, Validators.required],
    galon_hora: [{ value: 0, disabled: true }, Validators.required],
    consumo_hielo: [, Validators.required],
    costo_hilo: ['', Validators.required],
    total_hielo: [{ value: 0, disabled: true }, Validators.required],
    consumo_agua: [, Validators.required],
    costo_agua: ['', Validators.required],
    total_agua: [{ value: 0, disabled: true }, Validators.required],
    dias_inspeccion: ['', Validators.required],
    tipo_cambio: ['', Validators.required],
    total_servicio_inspeccion: [{ value: 0, disabled: true }, Validators.required],
    total_derecho_pesca: [{ value: 0, disabled: true }, Validators.required],
    total_costo: [{ value: 0, disabled: true }, Validators.required],
    costo_tm_captura: [{ value: 0, disabled: true }, Validators.required],
    csot: [{ value: 0, disabled: true }, Validators.required],
    })
  }

  ngOnInit(): void{
    this.formEditFlota.patchValue(this.data)
  }


}
