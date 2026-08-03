import { Component, computed, inject, signal } from '@angular/core';
import { MessageModule } from 'primeng/message';
import { Producto } from '../../modelos/producto';
import { TarjetaProducto } from '../../compartidos/tarjeta-producto/tarjeta-producto';
import { ProductosServicio } from '../../servicios/productos';
import { CategoriasServicio } from '../../servicios/categorias';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [TarjetaProducto, MessageModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class Productos {
  readonly productosServicio = inject(ProductosServicio);
  private readonly categoriasServicio = inject(CategoriasServicio);
  readonly categorias = this.categoriasServicio.categoriasConTotal;
  readonly categoriaSeleccionada = signal<number | null>(null);
  readonly productos = computed(() => {
    const categoriaId = this.categoriaSeleccionada();
    return this.productosServicio
      .productos()
      .filter((producto) => categoriaId === null || producto.categoriaId === categoriaId);
  });

  mensajeFavorito: string | null = null;

  alAgregarFavorito(producto: Producto): void {
    this.mensajeFavorito = `${producto.nombre} se agregó a tus favoritos.`;
  }

  seleccionarCategoria(id: number | null): void {
    this.categoriaSeleccionada.set(id);
  }
}
