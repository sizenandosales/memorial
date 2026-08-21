import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MemorialService } from '../../../services/memorial.service';

@Component({
  selector: 'app-memorial-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './memorial-form.component.html',
  styleUrls: ['./memorial-form.component.scss'],
})
export class MemorialFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private memorialService = inject(MemorialService);

  memorialForm!: FormGroup;
  isEditing: boolean = false;
  memorialSlug: string | null = null;
  loading: boolean = false;
  errorMessage: string = '';

  selectedProfileFile: File | null = null;
  selectedGalleryFiles: File[] = [];

  ngOnInit(): void {
    this.initForm();

    this.memorialSlug = this.route.snapshot.paramMap.get('slug');
    if (this.memorialSlug) {
      this.isEditing = true;
      this.loadMemorialData(this.memorialSlug);
    }
  }

  initForm(): void {
    this.memorialForm = this.fb.group({
      slug: [''],
      fullName: ['', Validators.required],
      birthDate: ['', Validators.required],
      deathDate: ['', Validators.required],
      birthCity: ['', Validators.required],
      deathCity: ['', Validators.required],
      cemetery: ['', Validators.required],
      biography: ['', Validators.required],
    });
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
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }

    if (!this.isEditing && !this.selectedProfileFile) {
      this.errorMessage = 'A foto principal de perfil é obrigatória.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    const formValues = this.memorialForm.value;

    if (this.isEditing && this.memorialSlug) {
      // ATUALIZAÇÃO (Redireciona com queryParams indicando sucesso de atualização)
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
      // CRIAÇÃO (Redireciona com queryParams indicando sucesso de criação)
      const formData = new FormData();
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
          this.errorMessage =
            err.error?.message || 'Erro ao criar o memorial. Verifique o console.';
          this.loading = false;
        },
      });
    }
  }
}
