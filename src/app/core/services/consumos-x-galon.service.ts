import { Injectable } from '@angular/core';
import { ConsumoGasolina } from '../models/consumogaslo.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsumosXGalonService {

  private url: string = 'http://127.0.0.1:8000/api/consumo-gasolina/';

  constructor(private http: HttpClient) {}

  getConsumoGasolina(): Observable<ConsumoGasolina[]> {
    return this.http.get<ConsumoGasolina[]>(this.url);
  }

  getConsumoGasolinaById(id: number): Observable<ConsumoGasolina> {
    return this.http.get<ConsumoGasolina>(`${this.url}${id}/`);
  }

  createConsumoGasolina(consumo: ConsumoGasolina): Observable<ConsumoGasolina> {
    return this.http.post<ConsumoGasolina>(this.url, consumo);
  }

  updateConsumoGasolina(consumo: ConsumoGasolina, id: number): Observable<ConsumoGasolina> {
    return this.http.put<ConsumoGasolina>(`${this.url}${id}/`, consumo);
  }

  deleteConsumoGasolina(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}${id}/`);
  }
}
