import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-no-encontrado',
  standalone: true,
  imports: [RouterLink, ButtonModule, CardModule, MessageModule],
  templateUrl: './no-encontrado.html',
  styleUrl: './no-encontrado.css'
})
export class NoEncontrado {}