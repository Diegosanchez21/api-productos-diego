import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleriaModule } from 'primeng/galleria';
import { ButtonModule } from 'primeng/button';

interface GaleriaImagen {
  itemImageSrc: string;
  thumbnailImageSrc: string;
  alt: string;
  title: string;
}

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [CommonModule, GalleriaModule, ButtonModule],
  templateUrl: './galeria.html',
  styleUrl: './galeria.css',
})
export class Galeria {
  images: GaleriaImagen[] = [
    {
      itemImageSrc: 'IjustWannaCry.gif',
      thumbnailImageSrc: 'IjustWannaCry.gif',
      alt: 'No reason',
      title: 'I just wanna cry',
    },
    {
      itemImageSrc: 'dante-devil-may-cry.gif',
      thumbnailImageSrc: 'dante-devil-may-cry.gif',
      alt: 'Cry?',
      title: 'Cry?',
    },
    {
      itemImageSrc: 'vergil-devil.gif',
      thumbnailImageSrc: 'vergil-devil.gif',
      alt: 'Vergil',
      title: 'The devil may cry',
    },
    {
      itemImageSrc: 'dante-devil-may-cry-5.gif',
      thumbnailImageSrc: 'dante-devil-may-cry-5.gif',
      alt: 'Jackpot',
      title: 'Jackpot',
    },
    {
      itemImageSrc: 'vergil_chair.webp',
      thumbnailImageSrc: 'vergil_chair.webp',
      alt: 'I am',
      title: 'Motivation',
    },
  ];

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 5,
    },
    {
      breakpoint: '768px',
      numVisible: 3,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
    },
  ];

  displayFullscreen = false;
  activeIndex = 0;

  abrirGaleria(index: number) {
    this.activeIndex = index;
    this.displayFullscreen = true;
  }
}