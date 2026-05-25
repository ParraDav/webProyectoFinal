import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  apiUri = 'http://localhost:3000/api/cursos';

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  // ── Rutas públicas (sin token) ──────────────────────────────────
  getCursosPublicos() {
    return this.http.get<any[]>(`${this.apiUri}/publicos`);
  }

  getCursoPublico(id: string) {
    return this.http.get<any>(`${this.apiUri}/publicos/${id}`);
  }

  // ── Rutas protegidas ────────────────────────────────────────────
  getCursos() {
    return this.http.get(this.apiUri, this.getHeaders());
  }

  crearCurso(data: any) {
    return this.http.post(this.apiUri, data, this.getHeaders());
  }

  actualizarCurso(id: string, data: any) {
    return this.http.put(`${this.apiUri}/${id}`, data, this.getHeaders());
  }

  eliminarCurso(id: string) {
    return this.http.delete(`${this.apiUri}/${id}`, this.getHeaders());
  }

  inscribirse(id: string) {
    return this.http.post(`${this.apiUri}/${id}/inscribir`, {}, this.getHeaders());
  }
}