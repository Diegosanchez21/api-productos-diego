import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { Categoria } from '../modelos/categoria';
import { ProductosServicio } from './productos';
import { environment } from '../../environments/environment';

interface CategoriaApi extends Categoria {
  totalProductos: number;
}

@Injectable({ providedIn: 'root' })
export class CategoriasServicio {
  private readonly http = inject(HttpClient);
  private readonly productosServicio = inject(ProductosServicio);
  private readonly url = `${environment.apiUrl.replace(/\/$/, '')}/api/categorias`;
  private readonly listaCategorias = signal<CategoriaApi[]>([]);

  readonly categorias = this.listaCategorias.asReadonly();
  readonly categoriasConTotal = computed(() => this.listaCategorias());
  readonly errorCarga = signal<string | null>(null);

  constructor() {
    this.cargar();
  }

  cargar(): void {
    this.http.get<CategoriaApi[]>(this.url).subscribe({
      next: (categorias) => {
        this.listaCategorias.set(categorias);
        this.errorCarga.set(null);
      },
      error: (error) => {
        console.error('No fue posible cargar las categorías.', error);
        this.errorCarga.set('No fue posible conectar con la API de categorías.');
      }
    });
  }

  crear(nombre: string) {
    return this.http.post<CategoriaApi>(this.url, { nombre: nombre.trim() }).pipe(
      tap((categoria) =>
        this.listaCategorias.update((categorias) => [...categorias, categoria])
      )
    );
  }

  actualizar(id: number, nombre: string) {
    return this.http.put<CategoriaApi>(`${this.url}/${id}`, { nombre: nombre.trim() }).pipe(
      tap((categoria) =>
        this.listaCategorias.update((categorias) =>
          categorias.map((actual) => actual.id === id ? { ...actual, ...categoria } : actual)
        )
      )
    );
  }

  eliminar(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`).pipe(
      tap(() => {
        this.listaCategorias.update((categorias) =>
          categorias.filter((categoria) => categoria.id !== id)
        );
        this.productosServicio.quitarCategoria(id);
      })
    );
  }
}
