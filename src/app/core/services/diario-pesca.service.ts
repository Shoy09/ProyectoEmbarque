import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { IDiarioPesca } from '../models/diarioPesca.model';

@Injectable({
  providedIn: 'root'
})
export class DiarioPescaService {

  private _refresh$ = new Subject<void>();
  get refresh$() {
    return this._refresh$;
  }

  //private url: string = 'https://patt.pythonanywhere.com/api/diarios-de-pesca/'
  private url: string = 'http://127.0.0.1:8000/api/diarios-de-pesca/'

  constructor(private http: HttpClient)  {}

  getDiarioPesca(): Observable<IDiarioPesca[]>{
    return this.http.get<IDiarioPesca[]>(this.url);
  }

  getDiarioPescaById(id: number): Observable<IDiarioPesca> {
    return this.http.get<IDiarioPesca>(`${this.url}/${id}`);
  }

  postDiarioPesca(categoria: IDiarioPesca): Observable<IDiarioPesca>{
    return this.http.post<IDiarioPesca>(this.url, categoria)
    .pipe(
      tap(() => {
        this._refresh$.next();
      }));
  }

  deleteDiarioPesca(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}${id}/delete/`);
  }

  putDiarioPesca(diario: IDiarioPesca, id:any): Observable<IDiarioPesca>{
    return this.http.put<IDiarioPesca>(`${this.url}${id}/`, diario);
  }

}
