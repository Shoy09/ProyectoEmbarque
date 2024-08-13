import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private apiUrl = 'http://127.0.0.1:8000/api';
  private tokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {
    const token = sessionStorage.getItem('token');
    if (token) {
      this.tokenSubject.next(token);
    }
  }

  login(dni: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/token/`, { dni, password }).pipe(
      tap(response => {
        this.tokenSubject.next(response.access);
        sessionStorage.setItem('token', response.access);
      }),
      catchError(error => {
        console.error('Error al iniciar sesión:', error);
        return throwError(error);
      })
    );
  }

  getCurrentUserData(): Observable<any> {
    const token = sessionStorage.getItem('token');
    if (!token) {
      return throwError('No hay token disponible');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(`${this.apiUrl}/current-user/`, { headers }).pipe(
      catchError(error => {
        console.error('Error al obtener los datos del usuario actual:', error);
        return throwError(error);
      })
    );
  }

  getToken(): Observable<string | null> {
    return this.tokenSubject.asObservable();
  }

  isAuthenticated(): boolean {
    const token = sessionStorage.getItem('token');
    return !!token; // Retorna true si hay un token, false de lo contrario
  }
}
