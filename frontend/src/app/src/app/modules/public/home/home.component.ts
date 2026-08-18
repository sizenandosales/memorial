import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html', // <--- Ajustado para o nome correto
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  memorialsExample = [
    {
      name: 'Maria da Silva',
      dates: '1945 - 2025',
      tribute: 'Amada mãe, avó e exemplo de bondade.',
      image:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    },
    {
      name: 'João Carlos Oliveira',
      dates: '1952 - 2026',
      tribute: 'Sempre vivo em nossos corações e lembranças.',
      image:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    },
    {
      name: 'Ana Beatriz Souza',
      dates: '1980 - 2025',
      tribute: 'Sua alegria e luz continuam a nos guiar.',
      image:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    },
  ];
}
