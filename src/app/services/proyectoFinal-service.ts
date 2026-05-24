import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class proyectoFinalService {
  constructor(private http: HttpClient) { }
  apiUri = '/api/proyectoFinal';
  httpOptions = new HttpHeaders().set('Content-Type', 'application/json');

  //modificar los metodos de animals a otra cosa
  getAllAnimalsData(): Observable<any> {
    return this.http.get<any>(this.apiUri)
  }
  newAnimal(data: any): Observable<any> {
    return this.http.post<any>(
      this.apiUri,
      data,
      { headers: this.httpOptions });
  }
  updateAnimal(id: any, data: any): Observable<any> {
    console.log(data)
    return this.http.put<any>(
      this.apiUri + '/' + id,
      data,
      { headers: this.httpOptions });
  }
  getOneAnimal(id: any): Observable<any> {
    return this.http.get<any>(
      this.apiUri + '/' + id,
      { headers: this.httpOptions });
  }
  deleteAnimal(id: any) {
    return this.http.delete<any>(
      this.apiUri + "/" + id,
      { headers: this.httpOptions });
  }


}