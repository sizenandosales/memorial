import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private ngZone: NgZone,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;

      this.authService.login(credentials).subscribe({
        next: (response: any) => {
          console.log('Login realizado com sucesso:', response);

          // Captura o token independentemente de vir como access_token, accessToken ou token
          const token = response.access_token || response.accessToken || response.token;

          if (token) {
            // Salva com a chave 'access_token' para corresponder exatamente ao auth.guard.ts
            localStorage.setItem('access_token', token);
          } else {
            console.warn('Atenção: Nenhum token foi encontrado na resposta da API!', response);
          }

          // Redireciona para o dashboard com segurança dentro da zona do Angular
          this.ngZone.run(() => {
            this.router.navigateByUrl('/dashboard').then((success) => {
              console.log('Status da navegação para o dashboard:', success);
            });
          });
        },
        error: (err) => {
          console.error('Erro no login:', err);
          this.errorMessage = 'E-mail ou senha inválidos.';
        },
      });
    }
  }
}
