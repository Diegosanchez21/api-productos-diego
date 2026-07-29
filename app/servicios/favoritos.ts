import { Injectable, signal } from '@angular/core';
import { Producto } from '../modelos/producto';

@Injectable({
  providedIn: 'root'
})
export class FavoritosServicio {
  private readonly listaFavoritos = signal<Producto[]>([]);

  // Señal de solo lectura: los componentes pueden leerla en sus plantillas
  // pero no modificarla directamente desde fuera del servicio.
  readonly favoritos = this.listaFavoritos.asReadonly();

  agregar(producto: Producto): void {
    if (this.existe(producto.id)) {
      return;
    }
    this.listaFavoritos.update((actuales) => [...actuales, producto]);
  }

  eliminar(id: number): void {
    this.listaFavoritos.update((actuales) =>
      actuales.filter((producto) => producto.id !== id)
    );
  }

  obtenerTodos(): Producto[] {
    return this.listaFavoritos();
  }

  existe(id: number): boolean {
    return this.listaFavoritos().some((producto) => producto.id === id);
  }

  contarFavoritos(): number {
    return this.listaFavoritos().length;
  }
}
