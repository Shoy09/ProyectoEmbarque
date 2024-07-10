export interface IDiarioPesca{
    id: number,
    embarcacion  : String,
    flota: String,
    fecha: Date,
    numero_alcance: number,
    zona_pesca: String,
    estrato: String,
    rango_profundidad_inicial: number,
    rango_profundidad_final: number,
    tiempo_efectivo: TimeRanges,
    rango_talla_inicial: number,
    rango_talla_final: number,
    moda: number,
    porcentaje: number,
    ar: number,
    numero: number
}