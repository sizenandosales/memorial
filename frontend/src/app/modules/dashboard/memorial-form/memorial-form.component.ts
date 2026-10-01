import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MemorialService } from '../../../services/memorial.service';
import {
  Subject,
  takeUntil,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  of,
  catchError,
} from 'rxjs';

@Component({
  selector: 'app-memorial-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './memorial-form.component.html',
  styleUrls: ['./memorial-form.component.scss'],
})
export class MemorialFormComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private memorialService = inject(MemorialService);
  private destroy$ = new Subject<void>();

  memorialForm!: FormGroup;
  isEditing: boolean = false;
  memorialSlug: string | null = null;
  loading: boolean = false;
  errorMessage: string = '';

  // Estados para validação e sugestão de Slug em tempo real
  slugStatus: 'checking' | 'available' | 'taken' | null = null;
  slugMessage: string = '';
  suggestedSlug: string = '';

  selectedProfileFile: File | null = null;
  selectedGalleryFiles: File[] = [];

  ngOnInit(): void {
    this.initForm();
    this.setupSlugAutoGeneration();
    this.setupSlugValidation();

    this.memorialSlug = this.route.snapshot.paramMap.get('slug');
    if (this.memorialSlug) {
      this.isEditing = true;
      this.loadMemorialData(this.memorialSlug);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm(): void {
    this.memorialForm = this.fb.group({
      slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)]],
      fullName: ['', Validators.required],
      birthDate: ['', Validators.required],
      deathDate: ['', Validators.required],
      birthCity: ['', Validators.required],
      deathCity: ['', Validators.required],
      cemetery: ['', Validators.required],
      biography: ['', Validators.required],
    });
  }

  // Gera o slug automaticamente enquanto o usuário digita o nome completo (se não estiver editando ou se o slug estiver limpo)
  setupSlugAutoGeneration(): void {
    this.memorialForm
      .get('fullName')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((name) => {
        if (!this.isEditing && name) {
          const generatedSlug = this.formatSlug(name);
          this.memorialForm.get('slug')?.setValue(generatedSlug, { emitEvent: true });
        }
      });
  }

  // Validação reativa de disponibilidade do Slug com debounce
  setupSlugValidation(): void {
    this.memorialForm
      .get('slug')
      ?.valueChanges.pipe(
        takeUntil(this.destroy$),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((slug) => {
          if (!slug || slug.trim() === '') {
            this.slugStatus = null;
            this.slugMessage = '';
            this.suggestedSlug = '';
            return of(null);
          }
          this.slugStatus = 'checking';
          this.slugMessage = 'Verificando disponibilidade...';

          return this.memorialService
            .checkSlugAvailability(slug)
            .pipe(catchError(() => of({ available: true })));
        }),
      )
      .subscribe((res: any) => {
        if (!res) return;

        if (res.available) {
          this.slugStatus = 'available';
          this.slugMessage = 'URL personalizada disponível!';
          this.suggestedSlug = '';
        } else {
          this.slugStatus = 'taken';
          this.slugMessage = 'Este endereço já está em uso.';
          this.suggestedSlug = res.suggestedSlug || '';
        }
      });
  }

  formatSlug(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }

  applySuggestion(): void {
    if (this.suggestedSlug) {
      this.memorialForm.get('slug')?.setValue(this.suggestedSlug);
    }
  }

  loadMemorialData(slug: string): void {
    this.loading = true;
    this.memorialService.getMemorialBySlug(slug).subscribe({
      next: (data) => {
        const birthFormatted = data.birthDate ? data.birthDate.split('T')[0] : '';
        const deathFormatted = data.deathDate ? data.deathDate.split('T')[0] : '';

        this.memorialForm.patchValue({
          slug: data.slug || '',
          fullName: data.fullName || '',
          birthDate: birthFormatted,
          deathDate: deathFormatted,
          birthCity: data.birthCity || '',
          deathCity: data.deathCity || '',
          cemetery: data.cemetery || '',
          biography: data.biography || '',
        });

        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar dados do memorial:', err);
        this.errorMessage = 'Não foi possível carregar os dados para edição.';
        this.loading = false;
      },
    });
  }

  onProfilePictureSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedProfileFile = file;
    }
  }

  onGalleryFilesSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      this.selectedGalleryFiles = Array.from(files);
    }
  }

  onSubmit(): void {
    if (this.memorialForm.invalid) {
      this.memorialForm.markAllAsTouched();
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios corretamente.';
      return;
    }

    if (!this.isEditing && !this.selectedProfileFile) {
      this.errorMessage = 'A foto principal de perfil é obrigatória.';
      return;
    }

    if (this.slugStatus === 'taken') {
      this.errorMessage = 'Escolha um endereço de URL (slug) disponível antes de salvar.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    const formValues = this.memorialForm.value;

    if (this.isEditing && this.memorialSlug) {
      this.memorialService.updateMemorial(this.memorialSlug, formValues).subscribe({
        next: () => {
          this.router.navigate(['/dashboard'], { queryParams: { success: 'updated' } });
        },
        error: (err) => {
          console.error('Erro ao atualizar memorial:', err);
          this.errorMessage = err.error?.message || 'Erro ao atualizar o memorial.';
          this.loading = false;
        },
      });
    } else {
      const formData = new FormData();
      formData.append('slug', formValues.slug);
      formData.append('fullName', formValues.fullName);
      formData.append('birthDate', formValues.birthDate);
      formData.append('deathDate', formValues.deathDate);
      formData.append('birthCity', formValues.birthCity);
      formData.append('deathCity', formValues.deathCity);
      formData.append('cemetery', formValues.cemetery);
      formData.append('biography', formValues.biography);

      if (this.selectedProfileFile) {
        formData.append('profilePicture', this.selectedProfileFile);
      }

      if (this.selectedGalleryFiles.length > 0) {
        for (const file of this.selectedGalleryFiles) {
          formData.append('gallery', file);
        }
      }

      this.memorialService.createMemorial(formData).subscribe({
        next: () => {
          this.router.navigate(['/dashboard'], { queryParams: { success: 'created' } });
        },
        error: (err) => {
          console.error('Erro ao criar memorial:', err);
          this.errorMessage = err.error?.message || 'Erro ao criar o memorial.';
          this.loading = false;
        },
      });
    }
  }
}
