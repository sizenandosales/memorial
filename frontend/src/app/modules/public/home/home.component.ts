import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  // Slides refinados para o Hero Carrossel com imagens de alta qualidade
  heroSlides = [
    {
      badge: 'Legados que o tempo jamais apaga',
      title: 'Transforme lembranças em um memorial digital eterno.',
      subtitle:
        'Um espaço virtual seguro, elegante e perpétuo para honrar quem você ama. Conecte histórias e fotografias através de um QR Code exclusivo na placa do jazigo.',
      bgImage:
        'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&q=80&w=1920',
    },
    {
      badge: 'Preservando Memórias com Profundo Respeito',
      title: 'A perpetuidade da história de quem marcou sua vida.',
      subtitle:
        'Reúne familiares distantes em um mural interativo de condolências, acenda velas virtuais e mantenha vivo o afeto para as próximas gerações.',
      bgImage:
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=1920',
    },
    {
      badge: 'Tecnologia e Emoção em Harmonia',
      title: 'Um memorial acessível por QR Code no cemitério.',
      subtitle:
        'Placas resistentes a intempéries que abrem o memorial digital instantaneamente em qualquer smartphone, sem necessidade de baixar aplicativos.',
      bgImage:
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1920',
    },
  ];

  currentSlideIndex = 0;
  private slideInterval: any;

  // Vitrine restrita exatamente a 4 exemplos destacados
  memorialsExample = [
    {
      name: 'Lázaro Sales',
      dates: '1940 - 2024',
      tribute: 'Exemplo supremo de dedicação, amor e sabedoria familiar.',
      image:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600',
      slug: 'lazaro-sales-1129',
    },
    {
      name: 'São Pio X',
      dates: '1835 - 1914',
      tribute: 'Restaurar todas as coisas em Cristo com zelo e fé.',
      image:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
      slug: 'sao-pio-x-0190',
    },
    {
      name: 'São José',
      dates: 'Patriarca Protetor',
      tribute: 'Homem justo, guardião de sagradas memórias e lares.',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
      slug: 'sao-jose-7681',
    },
    {
      name: 'Santo Antônio de Lisboa',
      dates: '1195 - 1231',
      tribute: 'Doutor evangélico e eterno exemplo de caridade.',
      image:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
      slug: 'santo-antonio-de-lisboa-9485',
    },
  ];

  ngOnInit(): void {
    this.startCarrossel();
  }

  ngOnDestroy(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  startCarrossel(): void {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 6500);
  }

  nextSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.heroSlides.length;
  }

  prevSlide(): void {
    this.currentSlideIndex =
      (this.currentSlideIndex - 1 + this.heroSlides.length) % this.heroSlides.length;
  }

  setSlide(index: number): void {
    this.currentSlideIndex = index;
  }
}
