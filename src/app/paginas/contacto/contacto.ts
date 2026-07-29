import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    InputTextModule,
    MessageModule,
    TextareaModule
  ],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css'
})
export class Contacto {
  nombre = '';
  correo = '';
  mensaje = '';
  enviado = false;

  enviar(): void {
    this.enviado = true;
  }
}