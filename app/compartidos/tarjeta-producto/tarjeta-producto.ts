import { Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { Producto } from '../../modelos/producto';
import { FavoritosServicio } from '../../servicios/favoritos';

@Component({
  selector: 'app-tarjeta-producto',
  standalone: true,
  imports: [RouterLink, ButtonModule, CardModule, TagModule],
  templateUrl: './tarjeta-producto.html',
  styleUrl: './tarjeta-producto.css'
})
export class TarjetaProducto {
  private readonly favoritosServicio = inject(FavoritosServicio);

  readonly producto = input.required<Producto>();

  // Avisa al componente padre qué producto se agregó a favoritos.
  readonly agregado = output<Producto>();

  // Se recalcula automáticamente cuando cambia la lista de favoritos.
  readonly esFavorito = computed(() =>
    this.favoritosServicio.existe(this.producto().id)
  );

  agregarAFavoritos(): void {
    if (this.esFavorito()) {
      return;
    }
    this.favoritosServicio.agregar(this.producto());
    this.agregado.emit(this.producto());
  }
}
