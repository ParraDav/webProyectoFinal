import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  apiUri = 'http://localhost:3000/api/cursos';

  constructor(private http: HttpClient) { }

  // ── Rutas públicas (sin token) ──────────────────────────────────
  getCursosPublicos() {
    return this.http.get<any[]>(`${this.apiUri}/publicos`);
  }

  getCursoPublico(id: string) {
    return this.http.get<any>(`${this.apiUri}/publicos/${id}`);
  }

  getCurso(id: string) {
    return this.http.get<any>(`${this.apiUri}/${id}`);
  }

  // ── Cursos (autenticado) ────────────────────────────────────────

  /**
   * GET /api/cursos
   * Devuelve cursos. Los estudiantes solo ven publicados.
   * Soporta ?search=texto para búsqueda por nombre/descripción.
   */
  getCursos(search?: string) {
    const url = search ? `${this.apiUri}?search=${encodeURIComponent(search)}` : this.apiUri;
    return this.http.get<any[]>(url);
  }

  /**
   * POST /api/cursos
   * Crea un curso. Solo instructor/administrador.
   */
  crearCurso(data: any) {
    return this.http.post<any>(this.apiUri, data);
  }

  /**
   * PUT /api/cursos/:id
   * Actualiza un curso. Solo el instructor dueño o administrador.
   */
  actualizarCurso(id: string, data: any) {
    return this.http.put<any>(`${this.apiUri}/${id}`, data);
  }

  /**
   * DELETE /api/cursos/:id
   * Elimina un curso. Solo el instructor dueño o administrador.
   */
  eliminarCurso(id: string) {
    return this.http.delete<any>(`${this.apiUri}/${id}`);
  }

  /**
   * POST /api/cursos/:id/inscribir
   * Inscribe al estudiante autenticado en el curso.
   */
  inscribirse(id: string) {
    return this.http.post<any>(`${this.apiUri}/${id}/inscribir`, {});
  }

  /**
   * GET /api/cursos/:id/inscritos
   * Lista los estudiantes inscritos. Solo instructor dueño o administrador.
   */
  verInscritos(idCurso: string) {
    return this.http.get<any[]>(`${this.apiUri}/${idCurso}/inscritos`);
  }

  // ── Módulos ─────────────────────────────────────────────────────

  /**
   * POST /api/cursos/:id/modulos
   * Agrega un módulo al curso. Solo instructor dueño o administrador.
   */
  agregarModulo(idCurso: string, data: { titulo: string; contenido: string }) {
    return this.http.post<any>(`${this.apiUri}/${idCurso}/modulos`, data);
  }

  /**
   * PUT /api/cursos/:id/modulos/:idModulo
   * Actualiza un módulo existente. Solo instructor dueño o administrador.
   */
  actualizarModulo(idCurso: string, idModulo: string, data: { titulo?: string; contenido?: string }) {
    return this.http.put<any>(`${this.apiUri}/${idCurso}/modulos/${idModulo}`, data);
  }

  /**
   * DELETE /api/cursos/:id/modulos/:idModulo
   * Elimina un módulo. Solo instructor dueño o administrador.
   */
  eliminarModulo(idCurso: string, idModulo: string) {
    return this.http.delete<any>(`${this.apiUri}/${idCurso}/modulos/${idModulo}`);
  }

  /**
   * POST /api/cursos/:id/completar/:idModulo
   * Marca el módulo como completado para el estudiante autenticado.
   */
  completarModulo(idCurso: string, idModulo: string) {
    return this.http.post<any>(`${this.apiUri}/${idCurso}/completar/${idModulo}`, {});
  }
}