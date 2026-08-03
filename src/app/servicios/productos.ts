import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { Producto } from '../modelos/producto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductosServicio {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl.replace(/\/$/, '')}/api/productos`;
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

  constructor() {
    this.cargar();
  }

  cargar(): void {
    this.http.get<Producto[]>(this.url).subscribe({
      next: (productos) => this.listaProductos.set(productos),
      error: (error) => console.error('No fue posible cargar los productos.', error)
    });
  }

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

  crear(datos: Omit<Producto, 'id'>) {
    return this.http.post<Producto>(this.url, datos).pipe(
      tap((producto) =>
        this.listaProductos.update((productos) => [...productos, producto])
      )
    );
  }

  actualizar(id: number, datos: Omit<Producto, 'id'>) {
    return this.http.put<Producto>(`${this.url}/${id}`, datos).pipe(
      tap((producto) =>
        this.listaProductos.update((productos) =>
          productos.map((actual) => actual.id === id ? producto : actual)
        )
      )
    );
  }
}
