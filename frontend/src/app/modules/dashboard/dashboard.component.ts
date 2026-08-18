import { Component, inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MemorialService } from '../../services/memorial.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private memorialService = inject(MemorialService);

  memorials: any[] = [];
  loading: boolean = true;
  errorMessage: string = '';

  ngOnInit(): void {
    this.loadMemorials();
  }

  loadMemorials(): void {
    this.memorialService.getMemorials().subscribe({
      next: (data) => {
        this.memorials = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar memoriais:', err);
        this.errorMessage = 'Não foi possível carregar os seus memoriais no momento.';
        this.loading = false;
      },
    });
  }

  // Abre memorial em nova aba
  openMemorial(slug: string): void {
    window.open(`/memorial/${slug}`, '_blank');
  }

  // Navega para edição
  editMemorial(slug: string, event: Event): void {
    event.stopPropagation(); // Impede que o clique dispare o openMemorial
    this.router.navigate([`/dashboard/memorials/edit/${slug}`]);
  }

  // Navega para moderação de mensagens
  manageMessages(slug: string, event: Event): void {
    event.stopPropagation();
    this.router.navigate([`/dashboard/memorials/messages/${slug}`]);
  }

  activateMemorial(slug: string, event: Event): void {
    event.stopPropagation();
    this.memorialService.changeMemorialStatus(slug, 'ACTIVE').subscribe({
      next: () => {
        const memorial = this.memorials.find((m) => m.slug === slug);
        if (memorial) memorial.status = 'ACTIVE';
      },
      error: () => alert('Não foi possível aprovar o memorial.'),
    });
  }

  trackBySlug(index: number, item: any): string {
    return item.slug;
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('access_token');
    }
    this.router.navigate(['/auth/login']);
  }
}
