import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink, ButtonModule, CardModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio {}