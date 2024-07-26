export interface FlotaDP {
  fecha: string;
  tipo_cambio: number;
  embarcacion: number;
  zona_pesca: number;
  horas_faena: string;
  kilos_declarados: number;
  merluza?: number;
  bereche?: number;
  volador?: number;
  merluza_descarte?: number;
  otro?: string;
  kilo_otro?: number;
  toneladas_procesadas: number;
  toneladas_recibidas: number;
  costo_basico: number;
  participacion: number;
  bonificacion : number;
  total_participacion: number;
  aporte_REP: number,
  total_tripulacion: number;
  consumo_gasolina: number;
  total_gasolina: number;
  consumo_hielo: number;
  total_hielo: number;
  consumo_agua: number;
  total_agua: number;
  consumo_viveres: number;
  total_vivieres: number;
  dias_inspeccion: number;
  total_servicio_inspeccion: number;
  total_derecho_pesca: number;
  total_costo: number;
  costo_tm_captura: number;
  csot: number
}
