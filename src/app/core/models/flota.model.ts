export interface FlotaDP {
  fecha: string;  // Considera usar Date en lugar de string si manejas fechas en objetos Date
  tipo_cambio: number;  // Asumiendo que el ForeignKey se representa como un ID numérico
  embarcacion: number;
  zona_pesca: number;
  horas_faena: string;  // Usar string para duración (puedes convertirlo a Duration si usas una librería para manejar duraciones)
  kilos_declarados: number;
  merluza?: number;
  bereche?: number;
  volador?: number;
  merluza_descarte?: number;
  otro?: string;
  kilo_otro?: number;
  toneladas_procesadas: number;
  toneladas_recibidas: number;
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
}
