import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MemorialService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000'; // Ajuste se necessário

  // Lista todos os memoriais do usuário logado
  getMemorials(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/memorials`);
  }

  // Busca um memorial específico pelo slug
  getMemorialBySlug(slug: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/memorials/${slug}`);
  }

  // Altera o status geral do memorial
  changeMemorialStatus(slug: string, status: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/memorials/${slug}/status`, { status });
  }

  // Atualiza os dados cadastrais de um memorial
  updateMemorial(slug: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/memorials/${slug}`, data);
  }

  // Busca todas as mensagens de um memorial para moderação (Alinhado com a nova rota do backend)
  getMemorialMessages(slug: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/memorials/${slug}/messages/all`);
  }

  // Altera o status de uma mensagem do mural (Aprovar/Rejeitar)
  updateMessageStatus(messageId: string, status: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/memorials/messages/${messageId}/status`, {
      status,
    });
  }
}
