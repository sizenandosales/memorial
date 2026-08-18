import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MemorialService } from '../../services/memorial.service';

@Component({
  selector: 'app-memorial-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './memorial-view.component.html',
  styleUrls: ['./memorial-view.component.scss'],
})
export class MemorialViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private memorialService = inject(MemorialService);
  private http = inject(HttpClient);

  memorial: any = null;
  loading: boolean = true;
  errorMessage: string = '';

  // Estado do Mural de Mensagens
  approvedMessages: any[] = [];
  visitorName: string = '';
  visitorMessage: string = '';
  messageSubmitting: boolean = false;
  messageSuccess: string = '';
  messageError: string = '';

  // Estado dos Modais de Imagem (Lightbox)
  activeModalImage: string | null = null;
  galleryIndex: number = 0;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');

    if (slug) {
      this.loadMemorial(slug);
    } else {
      this.errorMessage = 'URL do memorial inválida.';
      this.loading = false;
    }
  }

  loadMemorial(slug: string): void {
    this.memorialService.getMemorialBySlug(slug).subscribe({
      next: (data) => {
        this.memorial = data;
        this.loading = false;
        if (this.memorial && this.memorial.id) {
          this.loadApprovedMessages(this.memorial.id);
        }
      },
      error: (err) => {
        console.error('Erro ao carregar memorial:', err);
        this.errorMessage = 'Não foi possível encontrar ou carregar as informações deste memorial.';
        this.loading = false;
      },
    });
  }

  loadApprovedMessages(memorialId: string): void {
    this.http.get<any[]>(`http://localhost:3000/mural/${memorialId}/messages/approved`).subscribe({
      next: (messages) => {
        this.approvedMessages = messages;
      },
      error: (err) => {
        console.error('Erro ao carregar mensagens do mural:', err);
      },
    });
  }

  sendMuralMessage(form: any): void {
    if (form.invalid || !this.memorial) return;

    this.messageSubmitting = true;
    this.messageSuccess = '';
    this.messageError = '';

    const payload = {
      visitorName: this.visitorName,
      message: this.visitorMessage,
    };

    this.http.post(`http://localhost:3000/mural/${this.memorial.id}/messages`, payload).subscribe({
      next: () => {
        this.messageSubmitting = false;
        this.messageSuccess =
          'Mensagem enviada com sucesso! Ela aparecerá no mural após a aprovação do administrador.';
        this.visitorName = '';
        this.visitorMessage = '';
        form.resetForm();
      },
      error: (err) => {
        console.error('Erro ao enviar mensagem:', err);
        this.messageSubmitting = false;
        this.messageError = 'Não foi possível enviar sua mensagem. Tente novamente mais tarde.';
      },
    });
  }

  // Controle de Lightbox / Visualização de Imagens
  openProfileZoom(): void {
    if (this.memorial?.profilePicture) {
      this.activeModalImage = this.memorial.profilePicture;
    }
  }

  openGalleryLightbox(index: number): void {
    if (this.memorial?.gallery && this.memorial.gallery[index]) {
      this.galleryIndex = index;
      this.activeModalImage = this.memorial.gallery[index];
    }
  }

  nextGalleryImage(): void {
    if (this.memorial?.gallery) {
      this.galleryIndex = (this.galleryIndex + 1) % this.memorial.gallery.length;
      this.activeModalImage = this.memorial.gallery[this.galleryIndex];
    }
  }

  prevGalleryImage(): void {
    if (this.memorial?.gallery) {
      this.galleryIndex =
        (this.galleryIndex - 1 + this.memorial.gallery.length) % this.memorial.gallery.length;
      this.activeModalImage = this.memorial.gallery[this.galleryIndex];
    }
  }

  closeModal(): void {
    this.activeModalImage = null;
  }
}
