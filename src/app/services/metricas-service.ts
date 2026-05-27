import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface MetricasInstructor {
  totalCursos: number;
  totalEstudiantesInscritos: number;
  totalModulos: number;
}

export interface MetricasAdmin {
  totalUsuarios: number;
  totalCursos: number;
  totalInscripciones: number;
}

@Injectable({
  providedIn: 'root',
})
export class MetricasService {

  private apiUrl = 'http://localhost:3000/api/metricas';

  constructor(private http: HttpClient) {}

  /**
   * GET /api/metricas/instructor
   * Métricas del instructor: cursos propios, estudiantes inscritos y total de módulos.
   * Accesible por roles: instructor, administrador.
   */
  obtenerMetricasInstructor() {
    return this.http.get<MetricasInstructor>(`${this.apiUrl}/instructor`);
  }

  /**
   * GET /api/metricas/admin
   * Métricas globales de la plataforma: total usuarios, cursos e inscripciones.
   * Accesible por rol: administrador.
   */
  obtenerMetricasAdmin() {
    return this.http.get<MetricasAdmin>(`${this.apiUrl}/admin`);
  }
}

