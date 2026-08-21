import {
  Component,
  OnInit,
  inject,
  PLATFORM_ID,
  afterNextRender,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MemorialService } from '../../../services/memorial.service';

@Component({
  selector: 'app-memorial-messages',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './memorial-messages.component.html',
  styleUrls: ['./memorial-messages.component.scss'],
})
export class MemorialMessagesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private platformId = inject(PLATFORM_ID);
  private memorialService = inject(MemorialService);
  private cdr = inject(ChangeDetectorRef);

  slug: string | null = null;
  messages: any[] = [];
  loading: boolean = true;
  errorMessage: string = '';

  constructor() {
    // Garante que a leitura do slug e a busca de mensagens ocorram com segurança após o render no navegador
    afterNextRender(() => {
      this.slug = this.route.snapshot.paramMap.get('slug');
      if (this.slug) {
        this.loadMessages(this.slug);
      } else {
        this.errorMessage = 'Slug inválido.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  ngOnInit(): void {
    // Mantemos o ngOnInit limpo, pois o carregamento principal é tratado no afterNextRender
  }

  loadMessages(slug: string): void {
    this.loading = true;
    this.memorialService.getMemorialMessages(slug).subscribe({
      next: (data) => {
        console.log('Mensagens carregadas com sucesso:', data);
        this.messages = data;
        this.loading = false;
        // Força a atualização da tela para remover o loading e exibir as mensagens
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar mensagens:', err);
        this.errorMessage = 'Não foi possível carregar as mensagens.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  updateStatus(messageId: string, status: string): void {
    this.memorialService.updateMessageStatus(messageId, status).subscribe({
      next: () => {
        // Atualiza o status localmente para refletir na tela imediatamente
        const msg = this.messages.find((m) => m.id === messageId);
        if (msg) {
          msg.status = status;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao alterar status da mensagem:', err);
        alert('Não foi possível alterar o status da mensagem.');
      },
    });
  }
}
