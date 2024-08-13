import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FlotaDP } from '../models/flota.model';
import { Observable } from 'rxjs';
import { IFlotaDPResponse } from '../models/t_materializadas.model';

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
  updateFlota(flota: FlotaDP, id: any ): Observable<FlotaDP> {
    return this.http.put<FlotaDP>(`${this.baseUrl}${id}/`, flota);
  }

  updateFlotaToneladas(updatedFields: Partial<FlotaDP>, id: number): Observable<FlotaDP> {
    return this.http.patch<FlotaDP>(`${this.baseUrl}${id}/update-toneladas/`, updatedFields);
  }
  // Eliminar un FlotaDP
  deleteFlota(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${id}/`);
  }

  //TRAER LANCES Y FLOTAS
  getFlotasLances(): Observable<FlotaDP[]> {
    return this.http.get<FlotaDP[]>(`${this.baseUrl}lances/`);
  }

  //TONELADAS MENSUALES Y SEMANALES
  getToneladasMensualesSemanles(): Observable<IFlotaDPResponse[]> {
    return this.http.get<IFlotaDPResponse[]>(`${this.baseUrl}tiempo/`);
  }
}
