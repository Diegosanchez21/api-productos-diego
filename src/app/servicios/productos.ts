import { Injectable, signal } from '@angular/core';
import { Producto } from '../modelos/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductosServicio {
  private readonly listaProductos = signal<Producto[]>([
    {
      id: 1,
      nombre: 'Teclado',
      descripcion: 'Teclado compacto para practicar Angular.',
      precio: 650,
      categoriaId: 1
    },
    {
      id: 2,
      nombre: 'Ratón',
      descripcion: 'Ratón inalámbrico de uso diario.',
      precio: 420,
      categoriaId: 1
    },
    {
      id: 3,
      nombre: 'Monitor',
      descripcion: 'Monitor de 24 pulgadas.',
      precio: 3200,
      categoriaId: 2
    }
  ]);

  readonly productos = this.listaProductos.asReadonly();

  obtenerProductos(): Producto[] {
    return this.listaProductos();
  }

  obtenerProductoPorId(id: number): Producto | undefined {
    return this.listaProductos().find((producto) => producto.id === id);
  }

  quitarCategoria(categoriaId: number): void {
    this.listaProductos.update((productos) =>
      productos.map((producto) =>
        producto.categoriaId === categoriaId
          ? { ...producto, categoriaId: null }
          : producto
      )
    );
  }
}
