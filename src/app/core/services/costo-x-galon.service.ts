import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject, tap } from 'rxjs';
import { CostoGalonGasoI } from '../models/costoGG.model';
import { CostoTMHielo } from '../models/costoGH.model';
import { CostoM3Agua } from '../models/costoMA.model';

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

  //metodo get por id

  getCGGById(id: number): Observable<CostoGalonGasoI> {
    return this.http.get<CostoGalonGasoI>(`${this.url}/${id}`);
  }

  getTMHieloById(id: number): Observable<CostoTMHielo>{
    return this.http.get<CostoTMHielo>(`${this.url_hielo}/${id}`)
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

  //METODO POST

  postCGG(categoria: CostoGalonGasoI): Observable<CostoGalonGasoI>{
    return this.http.post<CostoGalonGasoI>(this.url, categoria)
    .pipe(
      tap(() => {
        this._refresh$.next();
      }));
  }

  postCTMHielo(hielo: CostoTMHielo): Observable<CostoTMHielo>{
    return this.http.post<CostoTMHielo>(this.url_hielo, hielo)
  }

  postM3Agua(agua: CostoM3Agua): Observable<CostoM3Agua>{
    return this.http.post<CostoM3Agua>(this.url_agua, agua)
  }


}
