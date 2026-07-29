import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { BarraNavegacion } from './compartidos/barra-navegacion/barra-navegacion';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BarraNavegacion],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}

/*import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('tema3');

  nombre = "BRYAN"

  boton = "ENVIAR INFORMACIÓN"

  imagen = "vergil-devil.gif"
  ancho = 200
  alto = 200

  color = "blue"

  mostrar= true

  alumnos = ['ivan', 'Diego', 'Ruben', 'David']

  activar = false

  nuevo = ""

  guardar = true

  contenido = ""

  actualizar(event: Event) {
    const input = event.target as HTMLInputElement
    this.contenido = input.value
    console.log(this.contenido)
  }

  agregarNuevo(){
    this.alumnos.push(this.nuevo)
    this.nuevo=""
  }

  saludar(){
    alert("HOLA " + this.nombre)
  }

  cambiarTextoBoton(){
    if (this.boton == "ENVIAR INFORMACIÓN")
      this.boton = "CANCELAR"
    else 
      this.boton = "ENVIAR INFORMACIÓN"
  }

  aumentar(){
    this.ancho += 10
    this.alto += 10
  }

  reducir(){
    this.alto -= 10
    this.ancho -= 10
  }

}*/