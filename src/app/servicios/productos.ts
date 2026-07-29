import { Injectable } from '@angular/core';
import { Producto } from '../modelos/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductosServicio {
  private readonly productos: Producto[] = [
    {
      id: 1,
      nombre: 'Teclado',
      descripcion: 'Teclado compacto para practicar Angular.',
      precio: 650
    },
    {
      id: 2,
      nombre: 'Ratón',
      descripcion: 'Ratón inalámbrico de uso diario.',
      precio: 420
    },
    {
      id: 3,
      nombre: 'Monitor',
      descripcion: 'Monitor de 24 pulgadas.',
      precio: 3200
    }
  ];

  obtenerProductos(): Producto[] {
    return this.productos;
  }

  obtenerProductoPorId(id: number): Producto | undefined {
    return this.productos.find((producto) => producto.id === id);
  }
}