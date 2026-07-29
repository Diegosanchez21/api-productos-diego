import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';
import { Producto } from '../../modelos/producto';
import { FavoritosServicio } from '../../servicios/favoritos';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [
    RouterLink,
    ButtonModule,
    CardModule,
    DialogModule,
    MessageModule,
    TagModule
  ],
  templateUrl: './favoritos.html',
  styleUrl: './favoritos.css'
})
export class Favoritos {
  private readonly favoritosServicio = inject(FavoritosServicio);

  // Señal de solo lectura del servicio: la plantilla se actualiza sola
  // cada vez que se agrega o elimina un favorito.
  readonly favoritos = this.favoritosServicio.favoritos;

  mostrarConfirmacion = false;
  productoAEliminar: Producto | null = null;

  pedirConfirmacion(producto: Producto): void {
    this.productoAEliminar = producto;
    this.mostrarConfirmacion = true;
  }

  confirmarEliminacion(): void {
    if (this.productoAEliminar) {
      this.favoritosServicio.eliminar(this.productoAEliminar.id);
    }
    this.cancelarEliminacion();
  }

  cancelarEliminacion(): void {
    this.mostrarConfirmacion = false;
    this.productoAEliminar = null;
  }
}
