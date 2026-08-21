import {
  Component,
  inject,
  PLATFORM_ID,
  OnInit,
  afterNextRender,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MemorialService } from '../../services/memorial.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private platformId = inject(PLATFORM_ID);
  private memorialService = inject(MemorialService);
  private cdr = inject(ChangeDetectorRef); // Injeta o detector de mudanças

  memorials: any[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  successMessage: string = '';

  constructor() {
    // Garante que a carga dos memoriais só ocorra após o render completo no navegador
    afterNextRender(() => {
      console.log('afterNextRender disparado: buscando memoriais...');
      this.loadMemorials();
    });
  }

  ngOnInit(): void {
    this.checkSuccessParams();

    // Listener para navegações internas subsequentes
    if (isPlatformBrowser(this.platformId)) {
      this.router.events
        .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          if (
            event.urlAfterRedirects.startsWith('/dashboard') &&
            event.urlAfterRedirects.split('?')[0] === '/dashboard'
          ) {
            this.loadMemorials();
          }
        });
    }
  }

  loadMemorials(): void {
    this.loading = true;
    this.memorialService.getMemorials().subscribe({
      next: (data) => {
        console.log('Memoriais carregados com sucesso:', data);
        this.memorials = data;
        this.loading = false;

        // Força o Angular a atualizar a tela imediatamente com os dados recebidos
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar memoriais no dashboard:', err);
        this.errorMessage = 'Não foi possível carregar os seus memoriais no momento.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  // Verifica se veio algum parâmetro de sucesso na URL (ex: ?success=created ou ?success=updated)
  checkSuccessParams(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['success'] === 'created') {
        this.successMessage = 'Memorial criado com sucesso!';
        this.clearMessageAfterDelay();
      } else if (params['success'] === 'updated') {
        this.successMessage = 'Memorial atualizado com sucesso!';
        this.clearMessageAfterDelay();
      }
    });
  }

  // Some com a mensagem após 5 segundos para limpar a tela
  clearMessageAfterDelay(): void {
    setTimeout(() => {
      this.successMessage = '';
    }, 5000);
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
        this.cdr.detectChanges();
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
