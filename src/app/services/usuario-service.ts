import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {

  private apiUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) {}

  /**
   * GET /api/usuarios/perfil
   * Obtiene el perfil del usuario autenticado (requiere token - el interceptor lo añade).
   */
  obtenerPerfil() {
    return this.http.get<any>(`${this.apiUrl}/perfil`);
  }

  /**
   * GET /api/usuarios/mis-cursos
   * Obtiene los cursos en los que el estudiante autenticado está inscrito.
   */
  misCursos() {
    return this.http.get<any[]>(`${this.apiUrl}/mis-cursos`);
  }
}

