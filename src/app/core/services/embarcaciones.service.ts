import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Embarcaciones } from '../models/embarcacion';
import { ZonaPescaI } from '../models/zonaPesca';

@Injectable({
  providedIn: 'root'
})
export class EmbarcacionesService {

  private _refresh$ = new Subject<void>();
  get refresh$() {
    return this._refresh$;
  }

  private url: string = 'http://127.0.0.1:8000/api/embarcaciones/'
  private embarcacionesCache: Embarcaciones[] | null = null;

  private url_zona_pesca: string = 'http://127.0.0.1:8000/api/zona-pesca/'
  private zonaPescaCache: ZonaPescaI[] | null = null;

  constructor(private http: HttpClient)  {}

  getEmbarcaciones(): Observable<Embarcaciones[]>{
    if(this.embarcacionesCache){
      return new Observable( observer => {
        observer.next(this.embarcacionesCache!);
        observer.complete();
      });
    } else{
      return this.http.get<Embarcaciones[]>(this.url);
    }
  }

  getZonaPesca(): Observable<ZonaPescaI[]>{
    if(this.zonaPescaCache){
      return new Observable( observer => {
        observer.next(this.zonaPescaCache!);
        observer.complete();
      });
    } else{
      return this.http.get<ZonaPescaI[]>(this.url_zona_pesca);
    }
  }

  updateEmbarcacionesCache(embarcaciones: Embarcaciones[]) {
    this.embarcacionesCache = embarcaciones;
    this._refresh$.next();
  }

  updateZonaPesca(zona: ZonaPescaI[]) {
    this.zonaPescaCache = zona;
    this._refresh$.next();
  }
}
