import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { TarifaCostoI } from '../models/tarifaCosto.model';

@Injectable({
  providedIn: 'root'
})
export class TarifaCostoService {
  private _refresh$ = new Subject<void>();
  get refresh$() {
    return this._refresh$;
  }

  private url: string = 'http://127.0.0.1:8000/api/tarifa-costo/'

  constructor(private http: HttpClient)  {}

  getDiarioPesca(): Observable<TarifaCostoI[]>{
    return this.http.get<TarifaCostoI[]>(this.url);
  }

  getDiarioPescaById(id: number): Observable<TarifaCostoI> {
    return this.http.get<TarifaCostoI>(`${this.url}/${id}`);
  }

  postDiarioPesca(categoria: TarifaCostoI): Observable<TarifaCostoI>{
    return this.http.post<TarifaCostoI>(this.url, categoria)
    .pipe(
      tap(() => {
        this._refresh$.next();
      }));
  }

  deleteDiarioPesca(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}${id}`);
  }

  putDiarioPesca(tar_costo: TarifaCostoI, id:any): Observable<TarifaCostoI>{
    return this.http.put<TarifaCostoI>(`${this.url}${id}/`, tar_costo);
  }
}
