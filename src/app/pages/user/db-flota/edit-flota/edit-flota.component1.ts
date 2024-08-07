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
import { MecanismoI } from 'app/core/models/mecanismoI.models';
import { ZonaPescaI } from 'app/core/models/zonaPesca';
import { CostoXGalonService } from 'app/core/services/costo-x-galon.service';
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
  bonificacionSeleccionada!: number
  zona: ZonaPescaI[] = [];
  costoDia?: MecanismoI;
  derechoPescaCosto?: number;
  showStepper: boolean = true;
  esSalud?: number;
  senati?: number;
  SCTR_SAL?: number;
  SCTR_PEN?: number;
  p_seguro?: number;

  constructor(
    private formBuilder: FormBuilder,
    private serviceFlota: FlotaService,
    private embarcacionService: EmbarcacionesService,
    private costoXGalonService: CostoXGalonService,
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
    this.loadCostoDia();
    this.loadLastDerechoPesca();
    this.loadEssalud();
    this.loadSenati();
    this.loadSCTRSAL();
    this.loadSCTRPEN();
    this.loadPoliSeguro();

  }

  // CARGAR EMBARCACION
  loadEmbarcaciones(): void {
    this.embarcacionService.getEmbarcaciones().subscribe(data => {
      this.embarcaciones = data;
      const embarcacionIdSeleccionada = Number(this.firstFormGroup.get('embarcacion')?.value) || 0;
      this.embarcacionSeleccionada = this.embarcaciones.find(e => e.id === embarcacionIdSeleccionada);

      if (this.embarcacionSeleccionada) {
        this.bonificacionSeleccionada = this.embarcacionSeleccionada.bonificacion;
        console.log(`Bonificación de la embarcación seleccionada: ${this.bonificacionSeleccionada}`);
        this.calculateBonificacion(); // Calcula la bonificación aquí
      } else {
        console.log("No se encontró la embarcación seleccionada al cargar.");
      }
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
    console.log(`Calculando participacion: ${costoBasico} * ${toneladasRecibidas} * 0.33 = ${participacion}`);
    const participacionRedondeada = parseFloat(participacion.toFixed(2));
    this.firstFormGroup.patchValue({participacion: participacionRedondeada});
    this.calculateBonificacion();
  }

  //BONIFICACION
  calculateBonificacion(): void {
    const participacion = Number(this.firstFormGroup.get('participacion')?.value) || 0;
    console.log(`Participación: ${participacion}`);

    const bonificacion = Number(this.bonificacionSeleccionada) || 0;
    if (bonificacion > 0) {
      const totalBonificacion = participacion / bonificacion;
      const redondeo = parseFloat(totalBonificacion.toFixed(2));
      console.log(`Calculando bonificación: (${participacion} / ${bonificacion}) = ${redondeo}`);
      this.firstFormGroup.patchValue({ bonificacion: redondeo });
    } else {
      this.firstFormGroup.patchValue({ bonificacion: 0 });
      console.log("La bonificación es 0, se establece la bonificación a 0.");
    }
  }

  //TOTAL PARTICIPACIÓN
  editParticipacionTotal():void{
    const participacion = Number(this.firstFormGroup.get('participacion')?.value) || 0;
    const bonificacion = Number(this.firstFormGroup.get('bonificacion')?.value) || 0;

    const participacion_total = participacion + bonificacion
    const redondeo = parseFloat(participacion_total.toFixed(2));
    this.firstFormGroup.patchValue({total_participacion: redondeo })

  }

  calculateAporteREP(): void {
    const totalParticipacion = Number(this.firstFormGroup.get('total_participacion')?.value) || 0;
    const porcentajeREP = 0.05; // Ajusta este valor según sea necesario
    const aporteREP = totalParticipacion * porcentajeREP;
    const aporteREPRedondeado = parseFloat(aporteREP.toFixed(2));
    this.firstFormGroup.patchValue({ aporte_REP: aporteREPRedondeado });
  }


  //  -----------------------------    GASTOS DE TRIPULACION ---------------



  //GRATIFICACIÓN

  calculateGratificacion(): void{
    const total_participacion = Number(this.firstFormGroup.get('total_participacion')?.value) || 0;
    const gratificacion = total_participacion*1/6;
    const redondeo = parseFloat(gratificacion.toFixed(2));
    this.firstFormGroup.patchValue({gratificacion: redondeo})
  }

  //vacaciones
  calculateVacaciones(): void{
    const total_participacion = Number(this.firstFormGroup.get('total_participacion')?.value) || 0;
    const vacaciones = total_participacion * 1/12;
    const redondeo = parseFloat(vacaciones.toFixed(2));
    this.firstFormGroup.patchValue({vacaciones: redondeo})
  }

  //CTS
  calculateCTS(): void{
    const total_participacion = Number(this.firstFormGroup.get('total_participacion')?.value) || 0;
    const cts = total_participacion * 1/12;
    const redondeo = parseFloat(cts.toFixed(2))
    this.firstFormGroup.patchValue({cts: redondeo})
  }

  //ESSALUD
  loadEssalud(){
    this.costoXGalonService.getCostoTarifa('ESSALUD').subscribe(costo_essalud => {
      this.esSalud = costo_essalud;
      this.calculateEssalud();
    });
  }

  calculateEssalud(): void{
    const participacion_total = Number(this.firstFormGroup.get('total_participacion')?.value) || 0;
    const vacaciones = Number(this.firstFormGroup.get('vacaciones')?.value) || 0;
    const valor_esSalud =this.esSalud || 0
    const esSalud = (participacion_total + vacaciones)*valor_esSalud
    const redondeo = parseFloat(esSalud.toFixed(2));
    this.firstFormGroup.patchValue({essalud: redondeo })
  }

  //SENATI
  loadSenati(){
    this.costoXGalonService.getCostoTarifa('SENATI').subscribe(costo_senati => {
      this.senati = costo_senati;
      this.calculateSenati();
    })
  }

  calculateSenati(): void {
    const participacion_total = Number(this.firstFormGroup.get('total_participacion')?.value) || 0;
    const vacaciones = Number(this.firstFormGroup.get('vacaciones')?.value) || 0;
    const gratificacion = Number(this.firstFormGroup.get('gratificacion')?.value) ||0;
    const valor_senati = this.senati || 0;
    const senati = (participacion_total + vacaciones + gratificacion) * valor_senati
    const redondeo = parseFloat(senati.toFixed(2));
    console.log(`Calculando totalVivieres: ${participacion_total} + ${vacaciones} + ${gratificacion}  / ${valor_senati}= ${redondeo}`);
    this.firstFormGroup.patchValue({ senati: redondeo})
  }

  //SCTR SAL
  loadSCTRSAL(){
    this.costoXGalonService.getCostoTarifa('SCTR%20SAL').subscribe( costo_strlsal => {
      this.SCTR_SAL = costo_strlsal;
      this.calculateSCTRSAL();
    })
  }

  calculateSCTRSAL(): void {
    const participacion_total = Number(this.firstFormGroup.get('total_participacion')?.value) || 0;
    const vacaciones = Number(this.firstFormGroup.get('vacaciones')?.value) || 0;
    const gratificacion = Number(this.firstFormGroup.get('gratificacion')?.value) ||0;
    const valor_sctrsal = this.SCTR_SAL || 0;
    const sctrSal = (participacion_total + vacaciones + gratificacion) * valor_sctrsal;
    const redondeo = parseFloat(sctrSal.toFixed(2));
    this.firstFormGroup.patchValue({SCTR_SAL:redondeo })
  }

  //SCTR PEN
  loadSCTRPEN(){
    this.costoXGalonService.getCostoTarifa('SCTR%20PEN').subscribe( costo_sctrpen => {
      this.SCTR_PEN = costo_sctrpen;
      this.calculateSCTRPEN();
    })
  }

  calculateSCTRPEN(): void{
    const participacion_total = Number(this.firstFormGroup.get('total_participacion')?.value) || 0;
    const vacaciones = Number(this.firstFormGroup.get('vacaciones')?.value) || 0;
    const gratificacion = Number(this.firstFormGroup.get('gratificacion')?.value) ||0;
    const valor_pen = this.SCTR_PEN || 0;
    const sctrPen = (participacion_total + vacaciones + gratificacion) * valor_pen
    const redondeo = parseFloat(sctrPen.toFixed(2));
    this.firstFormGroup.patchValue({ SCTR_PEN: redondeo})
  }

  //POLIZA DE SEGURO
  loadPoliSeguro(){
    this.costoXGalonService.getCostoTarifa('P.%20Seguro').subscribe( poliza_seguro => {
      this.p_seguro = poliza_seguro;
      this.calculatePolizaSeguro();
    })
  }

  calculatePolizaSeguro(): void {
    const participacion_total = Number(this.firstFormGroup.get('total_participacion')?.value) || 0;
    const vacaciones = Number(this.firstFormGroup.get('vacaciones')?.value) || 0;
    const gratificacion = Number(this.firstFormGroup.get('gratificacion')?.value) ||0;
    const valor_PS = this.p_seguro || 0;
    const poliza_seguro = (participacion_total + vacaciones + gratificacion) * valor_PS
    const redondeo = parseFloat(poliza_seguro.toFixed(2));
    this.firstFormGroup.patchValue({ poliza_seguro: redondeo })
  }

  //TOTAL DE LA TRIPULACIÓN
  calculateTotalTripulacion(): void {
    const participacion_total = Number(this.firstFormGroup.get('total_participacion')?.value) || 0;
    const rep = Number(this.firstFormGroup.get('aporte_REP')?.value) || 0;
    const gratificacion = Number(this.firstFormGroup.get('gratificacion')?.value) || 0;
    const vacaciones = Number(this.firstFormGroup.get('vacaciones')?.value) || 0
    const cts = Number(this.firstFormGroup.get('cts')?.value) || 0;
    const essalud = Number(this.firstFormGroup.get('essalud')?.value) || 0;
    const senati = Number(this.firstFormGroup.get('senati')?.value) || 0;
    const SCTR_SAL = Number(this.firstFormGroup.get('SCTR_SAL')?.value) || 0
    const SCTR_PEN = Number(this.firstFormGroup.get('SCTR_PEN')?.value) || 0
    const poliza_seguro = Number(this.firstFormGroup.get('poliza_seguro')?.value)

    const total_tripulacion = participacion_total + rep + gratificacion + vacaciones + cts + essalud + senati + SCTR_SAL + SCTR_PEN + poliza_seguro

    const redondeo = parseFloat(total_tripulacion.toFixed(2))

    this.firstFormGroup.patchValue({total_tripulacion: redondeo})

  }

  //GASOLINA
  editGasolina(): void{
    const consumo = Number(this.secondFormGroup.get('consumo_gasolina')?.value) || 0;
    const costo = Number(this.secondFormGroup.get('costo_gasolina')?.value) || 0;

    const costoTotal = consumo * costo
    const redondeo = parseFloat(costoTotal.toFixed(2));
    this.secondFormGroup.patchValue({total_gasolina: redondeo})
  }

  //HIELO
  editHielo(): void{
    const consumo = Number(this.secondFormGroup.get('consumo_hielo')?.value) || 0;
    const costo = Number(this.secondFormGroup.get('costo_hilo')?.value) || 0;

    const costoTotal = consumo * costo
    const redondeo = parseFloat(costoTotal.toFixed(2));
    this.secondFormGroup.patchValue({total_hielo: redondeo})
  }

  //AGUA
  editAgua(): void{
    const consumo = Number(this.secondFormGroup.get('consumo_agua')?.value) || 0;
    const costo = Number(this.secondFormGroup.get('costo_agua')?.value) || 0;

    const costoTotal = consumo * costo
    const redondeo = parseFloat(costoTotal.toFixed(2));
    this.secondFormGroup.patchValue({total_agua: redondeo})
  }

  //EDIT TOTAL DE VIVERES
  calculateTotalVivieres(): void {
    console.log("Calculando total de víveres");
    if (!this.embarcacionSeleccionada) {
      console.log("No se ha seleccionado una embarcación.");
      return;
    }

    const consumoViveres = Number(this.firstFormGroup.get('consumo_viveres')?.value) || 0;
    console.log(`Consumo de Viveres: ${consumoViveres}`);

    const costoZarpe = this.embarcacionSeleccionada.costo_zarpe;
    console.log(`Costo de zarpe: ${costoZarpe}`);

    const totalVivieres = consumoViveres * costoZarpe;
    console.log(`Calculando totalVivieres: ${consumoViveres} * ${costoZarpe} = ${totalVivieres}`);
    this.firstFormGroup.patchValue({ total_vivieres: totalVivieres }, { emitEvent: false });
  }


  //EDIT DIAS DE INSPECCION

  loadCostoDia(): void {
    this.costoXGalonService.getMecanismo().subscribe(lastCosto => {
      this.costoDia = lastCosto;
      this.editTotalInspeccion();
    });
  }

  editTotalInspeccion():void{
    const diasInspeccion = Number(this.secondFormGroup.get('dias_inspeccion')?.value) || 0;

    if (!this.costoDia) {
      console.error('Error: El costo por día no está definido.');
      return;
    }
    // Accediendo correctamente a la propiedad 'costo' de 'costoDia'
    const totalServicioInspeccion = diasInspeccion * this.costoDia.costo_dia;

    // Redondear a dos decimales y actualizar el formulario
    const totalServicioInspeccionRedondeado = parseFloat(totalServicioInspeccion.toFixed(2));
    this.secondFormGroup.patchValue({ total_servicio_inspeccion: totalServicioInspeccionRedondeado });
  }

  //EDIT DERECHO DE PESCA
  loadLastDerechoPesca(): void {
    this.costoXGalonService.getLastDerechoPesca().subscribe(derechoPesca => {
      if (derechoPesca) {
        this.derechoPescaCosto = derechoPesca.costo;
        this.editDerechoPesca(); // Calcula el total de derecho de pesca si ya hay datos
      }
    });
  }

  editDerechoPesca():void{
    if (this.derechoPescaCosto !== undefined) {
      const kilosDeclarados = Number(this.firstFormGroup.get('kilos_declarados')?.value) || 0;
      const totalDerechoPesca = (kilosDeclarados * this.derechoPescaCosto) / 1000;
      const roundedTotalDerechoPesca = parseFloat(totalDerechoPesca.toFixed(2));
      this.secondFormGroup.patchValue({ total_derecho_pesca: roundedTotalDerechoPesca });
    }
  }

  //TOTAL GASTOS
  editCost(): void {
    const totalDerechoPesca = Number(this.secondFormGroup.get('total_derecho_pesca')?.value) || 0;
    const totalServicioInspeccion = Number(this.secondFormGroup.get('total_servicio_inspeccion')?.value) || 0;
    const totalVivieres = Number(this.firstFormGroup.get('total_vivieres')?.value) || 0;
    const totalAgua = Number(this.secondFormGroup.get('total_agua')?.value) || 0;
    const totalHielo = Number(this.secondFormGroup.get('total_hielo')?.value) || 0;
    const totalGasolina = Number(this.secondFormGroup.get('total_gasolina')?.value) || 0;
    const totalTripulacion = Number(this.firstFormGroup.get('total_tripulacion')?.value) || 0;

    // Calcula la suma total
    const totalCost = totalDerechoPesca + totalServicioInspeccion + totalVivieres + totalAgua + totalHielo + totalGasolina + totalTripulacion;

    // Redondea a dos decimales y actualiza el formulario
    const totalCostRedondeado = parseFloat(totalCost.toFixed(2));
    this.secondFormGroup.patchValue({ total_costo: totalCostRedondeado });
  }

  //COSTO CAPTURA
  editCostoCaptura(): void {
    const toneladasRecibidas = Number(this.firstFormGroup.get('toneladas_recibidas')?.value) || 0;
    const totalCosto = Number(this.secondFormGroup.get('total_costo')?.value) || 0;

    const costoPorCaptura = totalCosto / toneladasRecibidas;
    const costoPorCapturaRedondeado = parseFloat(costoPorCaptura.toFixed(2));
    console.log(`Calculando : ${totalCosto} / ${toneladasRecibidas} = ${costoPorCapturaRedondeado}`);
    this.secondFormGroup.patchValue({ costo_tm_captura: costoPorCapturaRedondeado });
  }

  //COSTO X CAPTURA PROCESADA
  editCostoTP(): void {
    const totalCosto = Number(this.secondFormGroup.get('total_costo')?.value) || 0;
    const toneladasProcesadas = Number(this.firstFormGroup.get('toneladas_procesadas')?.value) || 0;

    if (toneladasProcesadas <= 0) {
      console.error('Error: Las toneladas recibidas deben ser mayores que cero para calcular el costo por tonelada.');
      this.secondFormGroup.patchValue({ csot: 0 }); // Establece costo_tm_captura a 0 si hay un error
      return;
    }

    const csot = totalCosto / toneladasProcesadas

    const costoPorCSOT = parseFloat(csot.toFixed(2));
    this.secondFormGroup.patchValue({ csot: costoPorCSOT })
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
    this.calculateBonificacion()
    this.editParticipacionTotal()
    this.calculateAporteREP()
    this.calculateGratificacion()
    this.calculateVacaciones()
    this.calculateCTS()
    this.calculateEssalud()
    this.calculateSenati()
    this.calculateSCTRSAL()
    this.calculateSCTRPEN()
    this.calculatePolizaSeguro()
    this.calculateTotalTripulacion()
    this.editGasolina()
    this.editHielo()
    this.editAgua()
    this.editTotalInspeccion()
    this.editDerechoPesca()
    this.editCost()
    this.editCostoCaptura()
    this.editCostoTP()
    // Obtener los valores de ambos formularios
    const formData = Object.assign({}, this.firstFormGroup.value, this.secondFormGroup.value);

    let updateData: FlotaDP = {
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
      kilo_otro: formData.kilo_otro ? Number(formData.kilo_otro) : null,
      precio_otro: formData.precio_otro ? Number(formData.precio_otro) : null,
      toneladas_procesadas: Number(formData.toneladas_procesadas),
      toneladas_recibidas: Number(formData.toneladas_recibidas),
      costo_basico: Number(formData.costo_basico),
      participacion: Number(formData.participacion),
      bonificacion: Number(formData.bonificacion),
      total_participacion: Number(formData.total_participacion),
      aporte_REP: Number(formData.aporte_REP),
      gratificacion: Number(formData.gratificacion),
      vacaciones: Number(formData.vacaciones),
      cts: Number(formData.cts),
      essalud: Number(formData.essalud),
      senati: Number(formData.senati),
      SCTR_SAL: Number(formData.SCTR_SAL),
      SCTR_PEN: Number(formData.SCTR_PEN),
      poliza_seguro: Number(formData.poliza_seguro),
      total_tripulacion: Number(formData.total_tripulacion),
      consumo_gasolina: Number(formData.consumo_gasolina),
      costo_gasolina: Number(formData.costo_gasolina),
      total_gasolina: Number(formData.total_gasolina),
      galon_hora: Number(formData.galon_hora),
      consumo_hielo: Number(formData.consumo_hielo),
      costo_hilo: Number(formData.costo_hilo),
      total_hielo: Number(formData.total_hielo),
      consumo_agua: Number(formData.consumo_agua),
      costo_agua: Number(formData.costo_agua),
      total_agua: Number(formData.total_agua),
      dias_inspeccion: Number(formData.dias_inspeccion),
      total_servicio_inspeccion: Number(formData.total_servicio_inspeccion),
      total_derecho_pesca: Number(formData.total_derecho_pesca),
      total_costo: Number(formData.total_costo),
      costo_tm_captura: Number(formData.costo_tm_captura),
      csot: Number(formData.csot),
      consumo_viveres: 0,
      total_vivieres: 0
    }

    // Filtra los campos undefined
    Object.keys(updateData).forEach(key => {
  if ((updateData as FlotaDP & Record<string, any>)[key] === undefined) {
    (updateData as FlotaDP & Record<string, any>)[key] = 0;
  }
  });

    // Enviar datos al servicio
    this.serviceFlota.updateFlota(updateData, updateData.id).subscribe(
      (response) => {
        console.log('Datos actualizados correctamente');
        this.dialogRef.close(true);
      },
      (error) => {
        console.error('Error al actualizar los datos:', error);
      }
    );

  }
}