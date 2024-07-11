import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IDiarioPesca } from '../models/diarioPesca.model';
import { Especies } from '../models/especie.model';

@Injectable({
  providedIn: 'root'
})
export class EspeciesService {

  private _refresh$ = new Subject<void>();
  get refresh$() {
    return this._refresh$;
  }

  private url: string = 'http://127.0.0.1:8000/api/especies/'

  constructor(private http: HttpClient)  {}

  getDiarioPesca(): Observable<Especies[]>{
    return this.http.get<Especies[]>(this.url);
  }
}
