import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MemorialService } from '../../auth/services/memorial.service';

@Component({
  selector: 'app-memorial-create',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './memorial-create.component.html',
  styleUrls: ['./memorial-create.component.scss'],
})
export class MemorialCreateComponent {
  memorialForm: FormGroup;
  profileFile: File | null = null;
  galleryFiles: File[] = [];
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private memorialService: MemorialService,
    private router: Router,
  ) {
    this.memorialForm = this.fb.group({
      fullName: ['', Validators.required],
      birthDate: ['', Validators.required],
      deathDate: ['', Validators.required],
      birthCity: ['', Validators.required],
      deathCity: ['', Validators.required],
      cemetery: ['', Validators.required],
      biography: ['', Validators.required],
    });
  }

  onProfilePicSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.profileFile = event.target.files[0];
    }
  }

  onGallerySelected(event: any): void {
    if (event.target.files) {
      this.galleryFiles = Array.from(event.target.files);
    }
  }

  onSubmit(): void {
    if (this.memorialForm.invalid) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }

    if (!this.profileFile) {
      this.errorMessage = 'A foto de perfil é obrigatória.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const formData = new FormData();
    formData.append('fullName', this.memorialForm.get('fullName')?.value);
    formData.append('birthDate', this.memorialForm.get('birthDate')?.value);
    formData.append('deathDate', this.memorialForm.get('deathDate')?.value);
    formData.append('birthCity', this.memorialForm.get('birthCity')?.value);
    formData.append('deathCity', this.memorialForm.get('deathCity')?.value);
    formData.append('cemetery', this.memorialForm.get('cemetery')?.value);
    formData.append('biography', this.memorialForm.get('biography')?.value);

    formData.append('profilePicture', this.profileFile);

    this.galleryFiles.forEach((file) => {
      formData.append('gallery', file);
    });

    this.memorialService.createMemorial(formData).subscribe({
      next: (response: any) => {
        console.log('Memorial criado com sucesso:', response);
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        console.error('Erro ao criar memorial:', err);
        this.errorMessage =
          err.error?.message || 'Erro ao criar o memorial. Verifique os dados e tente novamente.';
        this.loading = false;
      },
    });
  }
}
