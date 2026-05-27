import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'http://localhost:3000/api/admin';

  constructor(private http: HttpClient) {}

  /**
   * GET /api/admin/usuarios
   * Lista todos los usuarios de la plataforma (sin contraseñas).
   * Solo accesible por rol: administrador.
   */
  listarUsuarios() {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios`);
  }

  /**
   * PUT /api/admin/usuarios/:id
   * Actualiza el rol de un usuario.
   * Solo accesible por rol: administrador.
   */
  actualizarRol(id: string, rol: string) {
    return this.http.put<any>(`${this.apiUrl}/usuarios/${id}`, { rol });
  }

  /**
   * DELETE /api/admin/usuarios/:id
   * Elimina un usuario de la plataforma.
   * Solo accesible por rol: administrador.
   */
  eliminarUsuario(id: string) {
    return this.http.delete<any>(`${this.apiUrl}/usuarios/${id}`);
  }
}
