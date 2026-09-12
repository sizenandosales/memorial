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

  // Cria um novo memorial (Envia FormData com textos e imagens)
  createMemorial(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/memorials`, formData);
  }

  // Atualiza os dados cadastrais de um memorial (Usa PATCH conforme o backend)
  updateMemorial(slug: string, data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/memorials/${slug}`, data);
  }

  // Altera o status geral do memorial
  changeMemorialStatus(slug: string, status: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/memorials/${slug}/status`, { status });
  }

  // Busca todas as mensagens de um memorial para moderação
  getMemorialMessages(slug: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/memorials/${slug}/messages/all`);
  }

  // Busca mensagens aprovadas para a página pública do memorial
  getApprovedMessages(memorialId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/memorials/${memorialId}/approved-messages`);
  }

  // Envia uma nova mensagem de homenagem pelo visitante na página pública
  sendVisitorMessage(memorialId: string, payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/memorials/${memorialId}/messages`, payload);
  }

  // Altera o status de uma mensagem do mural (Aprovar/Rejeitar)
  updateMessageStatus(messageId: string, status: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/memorials/messages/${messageId}/status`, {
      status,
    });
  }
}
