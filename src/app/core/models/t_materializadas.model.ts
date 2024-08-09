export interface IToneladasTiempo {
  total_toneladas_recibidas: string;
  total_toneladas_procesadas: string;
  porcentaje_procesadas: number;
}

export interface ISemanal extends IToneladasTiempo {
  week: string;
}

export interface IMensual extends IToneladasTiempo {
  month: string;
}

export interface IFlotaDPResponse {
  semanal: ISemanal[];
  mensual: IMensual[];
}
