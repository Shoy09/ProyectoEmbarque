import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Especies } from '../models/especie.model';

@Injectable({
  providedIn: 'root'
})
export class EspeciesService {

  private _refresh$ = new Subject<void>();
  get refresh$() {
    return this._refresh$;
  }

  private url: string = 'http://127.0.0.1:8000/api/especies/';
  private especiesCache: Especies[] | null = null;

  constructor(private http: HttpClient) {}

  getDiarioPesca(): Observable<Especies[]> {
    if (this.especiesCache) {
      // Si ya tenemos los datos en caché, retornamos un observable de esos datos
      return new Observable(observer => {
        observer.next(this.especiesCache!); // Emitimos los datos almacenados
        observer.complete();
      });
    } else {
      // Si no tenemos los datos en caché, hacemos la solicitud HTTP
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

}
