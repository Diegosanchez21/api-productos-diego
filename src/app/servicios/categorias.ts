import { Injectable, computed, inject, signal } from '@angular/core';
import { Categoria } from '../modelos/categoria';
import { ProductosServicio } from './productos';

@Injectable({ providedIn: 'root' })
export class CategoriasServicio {
  private readonly productosServicio = inject(ProductosServicio);
  private readonly listaCategorias = signal<Categoria[]>([
    { id: 1, nombre: 'Accesorios' },
    { id: 2, nombre: 'Pantallas' }
  ]);
  private siguienteId = 3;

  readonly categorias = this.listaCategorias.asReadonly();
  readonly categoriasConTotal = computed(() =>
    this.listaCategorias().map((categoria) => ({
      ...categoria,
      totalProductos: this.productosServicio
        .productos()
        .filter((producto) => producto.categoriaId === categoria.id).length
    }))
  );

  crear(nombre: string): Categoria | null {
    const nombreLimpio = nombre.trim();
    if (!nombreLimpio || this.existeNombre(nombreLimpio)) return null;

    const categoria = { id: this.siguienteId++, nombre: nombreLimpio };
    this.listaCategorias.update((categorias) => [...categorias, categoria]);
    return categoria;
  }

  actualizar(id: number, nombre: string): boolean {
    const nombreLimpio = nombre.trim();
    if (!nombreLimpio || this.existeNombre(nombreLimpio, id)) return false;

    this.listaCategorias.update((categorias) =>
      categorias.map((categoria) =>
        categoria.id === id ? { ...categoria, nombre: nombreLimpio } : categoria
      )
    );
    return true;
  }

  eliminar(id: number): void {
    this.listaCategorias.update((categorias) =>
      categorias.filter((categoria) => categoria.id !== id)
    );
    this.productosServicio.quitarCategoria(id);
  }

  private existeNombre(nombre: string, idExcluido?: number): boolean {
    return this.listaCategorias().some(
      (categoria) =>
        categoria.id !== idExcluido &&
        categoria.nombre.localeCompare(nombre, 'es', { sensitivity: 'accent' }) === 0
    );
  }
}
