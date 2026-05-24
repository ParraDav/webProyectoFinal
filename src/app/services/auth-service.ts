import { Injectable } from '@angular/core';

import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) { }

  register(data: any) {

    return this.http.post(
      `${this.apiUrl}/register`,
      data
    );
  }

  login(data: any) {

    return this.http.post(
      `${this.apiUrl}/login`,
      data
    );
  }

  guardarToken(token: string) {

    localStorage.setItem('token', token);
  }

  guardarRol(rol: string) {

    localStorage.setItem('rol', rol);
  }

  getToken() {

    return localStorage.getItem('token');
  }

  getRol() {

    return localStorage.getItem('rol');
  }

  isLoggedIn(): boolean {

    return !!localStorage.getItem('token');
  }

  logout() {

    localStorage.removeItem('token');

    localStorage.removeItem('rol');
  }
}