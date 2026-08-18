import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  private memorialService = inject(MemorialService);

  slug: string | null = null;
  messages: any[] = [];
  loading: boolean = true;
  errorMessage: string = '';

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug');
    if (this.slug) {
      this.loadMessages(this.slug);
    } else {
      this.errorMessage = 'Slug inválido.';
      this.loading = false;
    }
  }

  loadMessages(slug: string): void {
    this.loading = true;
    this.memorialService.getMemorialMessages(slug).subscribe({
      next: (data) => {
        this.messages = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar mensagens:', err);
        this.errorMessage = 'Não foi possível carregar as mensagens.';
        this.loading = false;
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
      },
      error: (err) => {
        console.error('Erro ao alterar status da mensagem:', err);
        alert('Não foi possível alterar o status da mensagem.');
      },
    });
  }
}
