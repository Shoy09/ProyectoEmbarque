import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { Especies } from '../models/especie.model';

@Injectable({
  providedIn: 'root'
})
export class EspeciesService {

  private _refresh$ = new Subject<void>();
  get refresh$() {
    return this._refresh$;
  }

  //private url: string = 'https://patt.pythonanywhere.com/api/especies/';
  private url: string = 'http://127.0.0.1:8000/api/especies/';
  private especiesCache: Especies[] | null = null;

  constructor(private http: HttpClient) {}

  getDiarioPesca(): Observable<Especies[]> {
    if (this.especiesCache) {
      return new Observable(observer => {
        observer.next(this.especiesCache!);
        observer.complete();
      });
    } else {
      return this.http.get<Especies[]>(this.url);
    }
  }

  // Método para actualizar el caché de especies (opcional, depende de tus necesidades)
  updateEspeciesCache(especies: Especies[]) {
    this.especiesCache = especies;
    this._refresh$.next();
  }

  postEspecie(especie: Especies): Observable<Especies> {
    return this.http.post<Especies>(this.url, especie);
  }

  putEspecie(especie: Especies, id:any): Observable<Especies>{
    return this.http.put<Especies>(`${this.url}${id}/`, especie);
  }

  //buscar el precio por el nombre
  getPrecioPorNombre(nombre: string): Observable<number> {
    return this.http.get<{ precio: number }>(`${this.url}precio/${nombre}/`).pipe(
      map(response => response.precio)
    );
  }

}
