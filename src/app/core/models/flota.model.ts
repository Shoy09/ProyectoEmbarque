export interface FlotaDP {
  id?: number;
  fecha: string;
  tipo_cambio: number;
  embarcacion: number;
  zona_pesca: number;
  horas_faena: string;
  kilos_declarados: number;
  merluza?: number;
  precio_merluza?: number;
  bereche?: number;
  precio_bereche?: number;
  volador?: number;
  precio_volador?: number;
  merluza_descarte?: number;
  precio_merluzaNP?: number;
  otro?: string;
  kilo_otro?: number;
  precio_otro?: number;
  toneladas_procesadas: number;
  toneladas_recibidas: number;
  costo_basico: number;
  participacion: number;
  bonificacion : number;
  total_participacion: number;
  aporte_REP: number,
  gratificacion: number,
  vacaciones: number,
  cts: number,
  essalud: number,
  senati: number,
  SCTR_SAL: number,
  SCTR_PEN: number,
  poliza_seguro: number,
  total_tripulacion: number;
  consumo_gasolina: number;
  costo_gasolina: number;
  total_gasolina: number;
  galon_hora: number;
  consumo_hielo: number;
  costo_hilo:number;
  total_hielo: number;
  consumo_agua: number;
  costo_agua:number;
  total_agua: number;
  consumo_viveres: number;
  total_vivieres: number;
  dias_inspeccion: number;
  total_servicio_inspeccion: number;
  total_derecho_pesca: number;
  total_costo: number;
  costo_tm_captura: number;
  csot: number;
}
