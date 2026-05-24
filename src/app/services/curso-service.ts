import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CursoService {

  constructor(private http: HttpClient) { }

  apiUri = 'http://localhost:3000/api/cursos';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // Obtener todos los cursos
  getCursos(): Observable<any> {
    return this.http.get<any>(this.apiUri);
  }

  // Crear curso
  crearCurso(data: any): Observable<any> {
    return this.http.post<any>(
      this.apiUri,
      data,
      this.httpOptions
    );
  }

  // Actualizar curso
  actualizarCurso(id: any, data: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiUri}/${id}`,
      data,
      this.httpOptions
    );
  }

  // Obtener un curso
  obtenerCurso(id: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUri}/${id}`,
      this.httpOptions
    );
  }

  // Eliminar curso
  eliminarCurso(id: any): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUri}/${id}`,
      this.httpOptions
    );
  }
}