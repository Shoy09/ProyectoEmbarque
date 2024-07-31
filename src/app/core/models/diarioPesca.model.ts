export interface IDiarioPesca{
    id: number,
    embarcacion  : number,
    especie: number,
    fecha: Date,
    numero_alcance: number,
    zona_pesca: String,
    estrato: String,
    profundidad: number,
    tiempo_efectivo: TimeRanges,
    rango_talla_inicial: number,
    rango_talla_final: number,
    moda: number,
    porcentaje: number,
    ar: number,
    numero: number,
    flotaDP_id:number
}
