import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Memorial {
  id: string;
  slug: string;
  fullName: string;
  birthDate: string;
  deathDate: string;
  birthCity: string;
  deathCity: string;
  cemetery: string;
  biography: string;
  profilePicture: string;
  status: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class MemorialService {
  private apiUrl = 'http://localhost:3000/memorials'; // URL do seu Backend NestJS

  constructor(private http: HttpClient) {}

  // Pega o token para enviar nas requisições protegidas
  private getHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
        // Nota: Não definimos 'Content-Type' aqui porque ao enviar FormData,
        // o navegador configura automaticamente como 'multipart/form-data' com o boundary correto.
      }),
    };
  }

  // Lista os memoriais do usuário logado
  getMemorials(): Observable<Memorial[]> {
    return this.http.get<Memorial[]>(this.apiUrl, this.getHeaders());
  }

  // Cria um novo memorial (Atenção: recebe FormData por causa das imagens)
  createMemorial(memorialData: FormData): Observable<Memorial> {
    return this.http.post<Memorial>(this.apiUrl, memorialData, this.getHeaders());
  }

  // Deleta um memorial pelo slug
  deleteMemorial(slug: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${slug}`, this.getHeaders());
  }
}
