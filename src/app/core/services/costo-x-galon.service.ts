import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject, tap } from 'rxjs';
import { CostoGalonGasoI } from '../models/costoGG.model';
import { CostoTMHielo } from '../models/costoGH.model';
import { CostoM3Agua } from '../models/costoMA.model';
import { TipoCambio } from '../models/costoTC.model';
import { ConsumoViveresI } from '../models/tViveres.model';
import { MecanismoI } from '../models/mecanismoI.models';

@Injectable({
  providedIn: 'root'
})
export class CostoXGalonService {
  private _refresh$ = new Subject<void>();
  get refresh$() {
    return this._refresh$;
  }

  private url: string = 'http://127.0.0.1:8000/api/costogalonb_05/'
  private url_hielo: string = 'http://127.0.0.1:8000/api/costoHielo/'
  private url_agua: string = 'http://127.0.0.1:8000/api/costogalonagua/'
  private url_tipo_cambio: string = 'http://127.0.0.1:8000/api/costotipocambio/'
  private url_viveres: string = 'http://127.0.0.1:8000/api/viveres/'
  private url_mecanismo: string = 'http://127.0.0.1:8000/api/mescanismo/'

  constructor(private http: HttpClient)  {}

  //metodos get

  getCGG(): Observable<CostoGalonGasoI[]>{
    return this.http.get<CostoGalonGasoI[]>(this.url);
  }

  getTMHielo():Observable<CostoTMHielo[]>{
    return this.http.get<CostoTMHielo[]>(this.url_hielo);
  }

  getM3Agua():Observable<CostoM3Agua[]>{
    return this.http.get<CostoM3Agua[]>(this.url_agua)
  }

  getTC():Observable<TipoCambio[]>{
    return this.http.get<TipoCambio[]>(this.url_tipo_cambio)
  }

  getCEV():Observable<ConsumoViveresI[]>{
    return this.http.get<ConsumoViveresI[]>(this.url_viveres)
  }

  getM():Observable<MecanismoI[]>{
    return this.http.get<MecanismoI[]>(this.url_mecanismo)
  }

  //metodo get por id

  getCGGById(id: number): Observable<CostoGalonGasoI> {
    return this.http.get<CostoGalonGasoI>(`${this.url}/${id}`);
  }

  getTMHieloById(id: number): Observable<CostoTMHielo>{
    return this.http.get<CostoTMHielo>(`${this.url_hielo}/${id}`)
  }

  getM3AguaById(id: number): Observable<CostoM3Agua> {
    return this.http.get<CostoM3Agua>(`${this.url_agua}/${id}`);
  }

  getCEVById(id: number): Observable<ConsumoViveresI>{
    return this.http.get<ConsumoViveresI>(`${this.url_viveres}/${id}`);
  }

  getMById(id: number): Observable<MecanismoI>{
    return this.http.get<MecanismoI>(`${this.url_viveres}/${id}`);
  }
  //Ultimo Dato

  getLastCosto(): Observable<CostoGalonGasoI | undefined> {
    return this.http.get<CostoGalonGasoI[]>(this.url).pipe(
      map(data => {
        if (data.length > 0) {
          return data.reverse()[0]; // Invertir el array y obtener el primer elemento
        }
        return undefined;
      })
    );
  }

  getLastCostoHielo(): Observable<CostoTMHielo | undefined> {
    return this.http.get<CostoTMHielo[]>(this.url_hielo).pipe(
      map(data => {
        if (data.length > 0) {
          return data.reverse()[0];
        }
        return undefined;
      })
    );
  }

  getLastM3Agua(): Observable<CostoM3Agua | undefined> {
    return this.http.get<CostoM3Agua[]>(this.url_agua).pipe(
      map(data => {
        if (data.length > 0) {
          return data.reverse()[0];
        }
        return undefined;
      })
    );
  }

  getLastTipoCambio():Observable<TipoCambio | undefined>{
    return this.http.get<TipoCambio[]>(this.url_tipo_cambio).pipe(
      map(data => {
        if (data.length > 0) {
          return data.reverse()[0];
        }
        return undefined;
      })
    );
  }

  //METODO POST

  postCGG(categoria: CostoGalonGasoI): Observable<CostoGalonGasoI> {
    return this.http.post<CostoGalonGasoI>(this.url, categoria)
  }

  postCTMHielo(hielo: CostoTMHielo): Observable<CostoTMHielo>{
    return this.http.post<CostoTMHielo>(this.url_hielo, hielo)
  }

  postM3Agua(agua: CostoM3Agua): Observable<CostoM3Agua>{
    return this.http.post<CostoM3Agua>(this.url_agua, agua)
  }

  post(tipo_cambio: TipoCambio): Observable<TipoCambio>{
    return this.http.post<TipoCambio>(this.url_tipo_cambio, tipo_cambio)
  }

  postCV(consumo_viveres_embarcacion: ConsumoViveresI): Observable<ConsumoViveresI>{
    return this.http.post<ConsumoViveresI>(this.url_viveres, consumo_viveres_embarcacion)
  }

  postM(mecanismo: MecanismoI):Observable<MecanismoI>{
    return this.http.post<MecanismoI>(this.url_mecanismo, mecanismo)
  }

  //METODO PUT
  updateCV(consumo: ConsumoViveresI, id: number): Observable<ConsumoViveresI> {
    return this.http.put<ConsumoViveresI>(`${this.url}${id}/`, consumo);
  }

  updateM(mecanismo: MecanismoI, id: number): Observable<MecanismoI>{
    return this.http.put<MecanismoI>(`${this.url}${id}/`, mecanismo);
  }

  //ADICIONAL
  // En tu servicio de vivieres
  getCostoZarpeByEmbarcacion(embarcacionId: number): Observable<any> {
    return this.http.get<any>(`${this.url_viveres}?embarcacion=${embarcacionId}`);
  }

}
