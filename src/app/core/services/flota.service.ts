import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FlotaDP } from '../models/flota.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlotaService {

  //private baseUrl = 'https://patt.pythonanywhere.com/api/flotadp/';
  private baseUrl = 'http://127.0.0.1:8000/api/flotadp/';

  constructor(private http: HttpClient) { }

  // Obtener lista de FlotaDP
  getFlotas(): Observable<FlotaDP[]> {
    return this.http.get<FlotaDP[]>(this.baseUrl);
  }

  // Obtener un FlotaDP por ID
  getFlota(id: number): Observable<FlotaDP> {
    return this.http.get<FlotaDP>(`${this.baseUrl}${id}/`);
  }

  // Crear un nuevo FlotaDP
  createFlota(flota: FlotaDP): Observable<FlotaDP> {
    return this.http.post<FlotaDP>(this.baseUrl, flota);
  }

  // Actualizar un FlotaDP existente
  updateFlota(id: number, flota: FlotaDP): Observable<FlotaDP> {
    return this.http.put<FlotaDP>(`${this.baseUrl}${id}/`, flota);
  }

  // Eliminar un FlotaDP
  deleteFlota(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${id}/`);
  }
}
