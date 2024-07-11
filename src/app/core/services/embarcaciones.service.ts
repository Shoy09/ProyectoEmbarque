import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Especies } from '../models/especie.model';
import { Embarcaciones } from '../models/embarcacion';

@Injectable({
  providedIn: 'root'
})
export class EmbarcacionesService {

  private _refresh$ = new Subject<void>();
  get refresh$() {
    return this._refresh$;
  }

  private url: string = 'http://127.0.0.1:8000/api/embarcaciones/'

  constructor(private http: HttpClient)  {}

  getDiarioPesca(): Observable<Embarcaciones[]>{
    return this.http.get<Embarcaciones[]>(this.url);
  }
}
