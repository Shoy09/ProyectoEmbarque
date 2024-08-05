import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { CostoGalonGasoI } from 'app/core/models/costoGG.model';
import { CostoTMHielo } from 'app/core/models/costoGH.model';
import { CostoM3Agua } from 'app/core/models/costoMA.model';
import { Embarcaciones } from 'app/core/models/embarcacion';
import { FlotaDP } from 'app/core/models/flota.model';
import { MecanismoI } from 'app/core/models/mecanismoI.models';
import { ZonaPescaI } from 'app/core/models/zonaPesca';
import { CostoXGalonService } from 'app/core/services/costo-x-galon.service';
import { EmbarcacionesService } from 'app/core/services/embarcaciones.service';
import { EspeciesService } from 'app/core/services/especies.service';
import { FlotaService } from 'app/core/services/flota.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-db-flota',
  standalone: true,
  imports: [CommonModule, MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
  ],
  templateUrl: './create-db-flota.component.html',
  styleUrl: './create-db-flota.component.css'
})

export class CreateDbFlotaComponent {

  embarcaciones: Embarcaciones[] = [];
  zona_pesca: ZonaPescaI[] = [];
  toneladasProcesadas: number = 0;
  toneladasRecibidas: number = 0;
  precio_merluza?:number; //
  precio_bereche?:number; //
  precio_volador?:number; //
  precio_merluzaNP?:number; //
  lastCosto?: CostoGalonGasoI;
  lastCostoHielo?: CostoTMHielo;
  lastCostoAgua?: CostoM3Agua;
  costoZarpe?: number;
  costoDia?: MecanismoI;
  derechoPescaCosto?: number;
  embarcacionSeleccionada: Embarcaciones | undefined;
  rep?: number;
  esSalud?: number;
  senati?: number;
  SCTR_SAL?: number;
  SCTR_PEN?: number;
  p_seguro?: number;
  showStepper: boolean = true;

  @Output() dataSaved = new EventEmitter<boolean>();

  firstFormGroup = this._formBuilder.group({
    fecha: ['', Validators.required],
    consumo_viveres: [, Validators.required],
    total_vivieres: [{ value: 0, disabled: true }, Validators.required],
    embarcacion: ['', Validators.required],
    zona_pesca: ['', Validators.required],
    horas_faena: ['', Validators.required],
    kilos_declarados: ['', Validators.required],
    merluza: [''],
    precio_merluza:[{ value: 0, disabled: true }, Validators.required],
    bereche: [''],
    precio_bereche:[{ value: 0, disabled: true }, Validators.required],
    volador: [''],
    precio_volador:[{ value: 0, disabled: true }, Validators.required],
    merluza_descarte: [''],
    precio_merluzaNP:[{ value: 0, disabled: true }, Validators.required],
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
  });

  secondFormGroup = this._formBuilder.group({
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
  });

  isEditable = false;

  constructor(
    private _formBuilder: FormBuilder,
    private embarcacionesService: EmbarcacionesService,
    private costoXGalonService: CostoXGalonService,
    private flotaService: FlotaService,
    private serviceEspecies: EspeciesService,
  ) {}

  ngOnInit(): void {
    this.getEmbarcaciones();
    this.getZonaPesca();
    this.loadPreciosEspecies();
    this.loadLastTipoCambio();
    this.loadLastCosto();
    this.loadLastCostoHielo();
    this.loadLastAgua();
    this.loadCostoDia();
    this.loadLastDerechoPesca();
    this.loadREP();
    this.loadEssalud();
    this.loadSenati();
    this.loadSCTRSAL();
    this.loadSCTRPEN();
    this.loadPoliSeguro();
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

  //TIPO DE CAMBIO
  loadLastTipoCambio() {
    this.costoXGalonService.getLastTipoCambio().subscribe(lastTipoCambio => {
      if (lastTipoCambio) {
        this.secondFormGroup.patchValue({ tipo_cambio: String(lastTipoCambio.costo) });
      }
    });
  }

  //cerrar
  closeStepper() {
    this.showStepper = false;
    const overlayContainers = document.querySelectorAll('.cdk-overlay-container');
    overlayContainers.forEach(container => {
        container.innerHTML = '';
    });
  }

  loadPreciosEspecies(): void {
    const especies = [
      { nombre: 'merluza', propiedad: 'precio_merluza', campo: 'merluza' },
      { nombre: 'bereche', propiedad: 'precio_bereche', campo: 'bereche' },
      { nombre: 'volador', propiedad: 'precio_volador', campo: 'volador' },
      { nombre: 'merluza%20np', propiedad: 'precio_merluzaNP', campo: 'merluza_descarte' },
    ];

    especies.forEach(especie => {
      this.serviceEspecies.getPrecioPorNombre(especie.nombre).subscribe(costo => {
        (this as any)[especie.propiedad] = costo;

        // Solo actualiza el precio en el formulario si hay un valor para la especie
        const cantidadEspecie = this.firstFormGroup.get(especie.campo)?.value;
        if (cantidadEspecie) {
          this.firstFormGroup.patchValue({ [especie.propiedad]: costo });
        }

        this.calculateCostoBasico();
      });
    });
  }

  calculateCostoBasico(): void {
    const merluza = this.firstFormGroup.get('merluza')?.value;
    const bereche = this.firstFormGroup.get('bereche')?.value;
    const volador = this.firstFormGroup.get('volador')?.value;
    const merluzaNPro = this.firstFormGroup.get('merluza_descarte')?.value;
    const precioOtro = this.firstFormGroup.get('precio_otro')?.value;

    let costoBasico = 0;

    if (merluza) {
      costoBasico += this.precio_merluza || 0;
      this.firstFormGroup.patchValue({ precio_merluza: this.precio_merluza });
    }
    if (bereche) {
      costoBasico += this.precio_bereche || 0;
      this.firstFormGroup.patchValue({ precio_bereche: this.precio_bereche });
    }
    if (volador) {
      costoBasico += this.precio_volador || 0;
      this.firstFormGroup.patchValue({ precio_volador: this.precio_volador });
    }
    if (merluzaNPro) {
      costoBasico += this.precio_merluzaNP || 0;
      this.firstFormGroup.patchValue({ precio_merluzaNP: this.precio_merluzaNP });
    }
    if (precioOtro) costoBasico += precioOtro;

    this.firstFormGroup.patchValue({ costo_basico: parseFloat(costoBasico.toFixed(2)) });
  }

  //COMBUSTIBLE
  loadLastCosto() {
    this.costoXGalonService.getLastCosto().subscribe(lastCosto => {
      if (lastCosto){
        this.secondFormGroup.patchValue({costo_gasolina: String(lastCosto.costo)})
      }
      this.lastCosto = lastCosto;
      this.calculateTotalGasolina();
    });
  }

  calculateTotalGasolina() {
    if (this.lastCosto) {
      const consumoGasolina = Number(this.secondFormGroup.get('consumo_gasolina')?.value) || 0;
      const costoGalon = this.lastCosto.costo;
      let totalGasolina = consumoGasolina * costoGalon;
      totalGasolina = parseFloat(totalGasolina.toFixed(2));
      this.secondFormGroup.patchValue({ total_gasolina: totalGasolina });
    }
  }

  //GALON DE COMBUSTIBLE POR HORA

  calculateGalonHota(): void{
    const hora = Number(this.firstFormGroup.get('horas_faena')?.value) || 0;
    const galones = Number(this.secondFormGroup.get('consumo_gasolina')?.value) || 0;
    const galon_hora = galones / hora

    const redondeo = parseFloat(galon_hora.toFixed(2))

    this.secondFormGroup.patchValue({galon_hora: redondeo })
  }

  //HIELO
  loadLastCostoHielo(){
    this.costoXGalonService.getLastCostoHielo().subscribe(lastCosto => {
      if (lastCosto){
        this.secondFormGroup.patchValue({costo_hilo: String(lastCosto.costo)})
      }
      this.lastCostoHielo = lastCosto;
      this.totalHielo();
    });
  }

  totalHielo(){
    if (this.lastCostoHielo) {
      const consumo = Number(this.secondFormGroup.get('consumo_hielo')?.value) || 0;
      const costoGalon = this.lastCostoHielo.costo;
      const total = (consumo * costoGalon).toFixed(2);
      this.secondFormGroup.patchValue({ total_hielo: parseFloat(total)});
    }
  }

  //AGUA
  loadLastAgua(){
    this.costoXGalonService.getLastM3Agua().subscribe(lastCosto => {
      if (lastCosto){
        this.secondFormGroup.patchValue({costo_agua: String(lastCosto.costo)})
      }
      this.lastCostoAgua = lastCosto;
      this.totalAgua();
    });
  }

  totalAgua(){
    if (this.lastCostoAgua) {
      const consumo = Number(this.secondFormGroup.get('consumo_agua')?.value) || 0;
      const costoGalon = this.lastCostoAgua.costo;
      const total = (consumo * costoGalon).toFixed(2);
      this.secondFormGroup.patchValue({ total_agua: parseFloat(total) });
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
  loadCostoDia(): void {
    this.costoXGalonService.getMecanismo().subscribe(lastCosto => {
      this.costoDia = lastCosto;
      this.calculateTotalServicioInspeccion();
    });
  }

  calculateTotalServicioInspeccion(): void {
    const diasInspeccion = Number(this.secondFormGroup.get('dias_inspeccion')?.value) || 0;
    if (diasInspeccion === 0) {
      console.error('Error: No hay días de inspección definidos.');
      return;
    }
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

  //derecho de pesca
  loadLastDerechoPesca(): void {
    this.costoXGalonService.getLastDerechoPesca().subscribe(derechoPesca => {
      if (derechoPesca) {
        this.derechoPescaCosto = derechoPesca.costo;
        this.calculateTotalDerechoPesca(); // Calcula el total de derecho de pesca si ya hay datos
      }
    });
  }

  calculateTotalDerechoPesca(): void {
    if (this.derechoPescaCosto !== undefined) {
      const kilosDeclarados = Number(this.firstFormGroup.get('kilos_declarados')?.value) || 0;
      const totalDerechoPesca = (kilosDeclarados * this.derechoPescaCosto) / 1000;
      const roundedTotalDerechoPesca = parseFloat(totalDerechoPesca.toFixed(2));
      this.secondFormGroup.patchValue({ total_derecho_pesca: roundedTotalDerechoPesca });
    }
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

  //TOTAL COSTOS
  calculateTotalCost(): void {
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

  // TOTAL DE COSTO POR CAPTURA
  calculateCostoTMCaptura(): void {
    const totalCosto = Number(this.secondFormGroup.get('total_costo')?.value) || 0;
    const toneladasRecibidas = Number(this.toneladasRecibidas) || 0;

    const costoPorCaptura = totalCosto / toneladasRecibidas;


    // Redondea el resultado a dos decimales y actualiza el formulario
    const costoPorCapturaRedondeado = parseFloat(costoPorCaptura.toFixed(2));

    console.log(`Calculando : ${totalCosto} / ${toneladasRecibidas} = ${costoPorCapturaRedondeado}`);

    this.secondFormGroup.patchValue({ costo_tm_captura: costoPorCapturaRedondeado });

  }

  //csot
  calcularCSOT():void{
    const totalCosto = Number(this.secondFormGroup.get('total_costo')?.value) || 0;
    const toneladasProcesadas = Number(this.toneladasProcesadas) || 0;

    if (toneladasProcesadas <= 0) {
      console.error('Error: Las toneladas recibidas deben ser mayores que cero para calcular el costo por tonelada.');
      this.secondFormGroup.patchValue({ csot: 0 }); // Establece costo_tm_captura a 0 si hay un error
      return;
    }

    const csot = totalCosto / toneladasProcesadas

    const costoPorCSOT = parseFloat(csot.toFixed(2));
    this.secondFormGroup.patchValue({ csot: costoPorCSOT });

  }

  //CALCULAR PARTICIPACIÓN
  calculateParticipacion(): void{
    const toneladasRecibidas = Number(this.toneladasRecibidas) || 0;
    const costoBasico = Number(this.firstFormGroup.get('costo_basico')?.value) || 0;

    const participacion = toneladasRecibidas * costoBasico * 0.33

    const participacionRedondeada = parseFloat(participacion.toFixed(2));
    this.firstFormGroup.patchValue({participacion: participacionRedondeada})
    this.calculateBonificacion();
  }

  // BONIFICACIÓN POR EMBARCACIÓN
  onSelectEmbarcacion(embarcacionId: number): void {
    this.embarcacionSeleccionada = this.embarcaciones.find(e => e.id === embarcacionId);
    if (!this.embarcacionSeleccionada) {
      console.log("No se encontró la embarcación con el ID proporcionado.");
    }
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

  //CALCULAR TOTAL PARTICIPACION
  calculateParticipacionTotal(): void{
    const participacion = Number(this.firstFormGroup.get('participacion')?.value) || 0;
    const bonificacion = Number(this.firstFormGroup.get('bonificacion')?.value) || 0;

    const participacion_total = participacion + bonificacion
    const redondeo = parseFloat(participacion_total.toFixed(2));
    this.firstFormGroup.patchValue({total_participacion: redondeo })
  }

  //APORTE REP
  loadREP() {
    this.costoXGalonService.getCostoTarifa('REP').subscribe(costo_rep => {
      this.rep = costo_rep;
      this.calculateREP();
    });
  }

  calculateREP(): void {
    const participacion_total = Number(this.firstFormGroup.get('total_participacion')?.value) || 0;
    const valor_REP = this.rep || 0;
    const REP = participacion_total * valor_REP;
    const redondeo = parseFloat(REP.toFixed(2));
    this.firstFormGroup.patchValue({ aporte_REP: redondeo });
  }

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

  //metodo post
  submitForm(): void {
    if (this.firstFormGroup.valid && this.secondFormGroup.valid) {
      this.calculateCostoBasico();
      this.calculateToneladas();
      this.calculateParticipacion();
      this.calculateBonificacion();
      this.calculateParticipacionTotal();
      this.calculateREP();
      this.calculateGratificacion();
      this.calculateVacaciones();
      this.calculateCTS();
      this.calculateEssalud();
      this.calculateSenati();
      this.calculateSCTRSAL();
      this.calculateSCTRPEN();
      this.calculatePolizaSeguro();
      this.calculateTotalTripulacion();
      this.calculateTotalGasolina();
      this.calculateGalonHota();
      this.totalHielo();
      this.totalAgua();
      this.calculateTotalVivieres;
      this.calculateTotalServicioInspeccion();
      this.calculateTotalDerechoPesca();
      this.calculateTotalCost(); // Asegúrate de calcular el total_costo
      this.calculateCostoTMCaptura();
      this.calcularCSOT();

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
        toneladas_procesadas: this.toneladasProcesadas,
        toneladas_recibidas: this.toneladasRecibidas,
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
      };

      // Envía los datos al servicio para crear la flota
      console.log('Datos enviados al servidor:', flotaData);

      this.flotaService.createFlota(flotaData).subscribe(
        response => {
          console.log('Fleet created successfully', response);
        this.dataSaved.emit(true); // Emitir true cuando los datos se guarden con éxito
        // Resetear los formularios si es necesario
        this.firstFormGroup.reset();
        this.secondFormGroup.reset();
        Swal.fire( // Muestra la alerta
          'Éxito!',
          'El registro se guardó correctamente.',
          'success'
        );
        },
        error => {
          console.error('Error creating Fleet', error);
          this.dataSaved.emit(false);
          Swal.fire( // Muestra la alerta
            'Error!',
            'Hubo un problema al guardar el registro.',
            'error'
          );

        }
      );
    } else {
      console.error('The form is not valid.');
    }
  }
}
