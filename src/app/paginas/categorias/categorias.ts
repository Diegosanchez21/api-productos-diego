import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { Producto } from '../../modelos/producto';
import { TarjetaProducto } from '../../compartidos/tarjeta-producto/tarjeta-producto';
import { CategoriasServicio } from '../../servicios/categorias';
import { ProductosServicio } from '../../servicios/productos';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [FormsModule, MessageModule, TarjetaProducto],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css'
})
export class Categorias {
  private readonly categoriasServicio = inject(CategoriasServicio);
  private readonly productosServicio = inject(ProductosServicio);

  readonly categorias = this.categoriasServicio.categoriasConTotal;
  readonly categoriaSeleccionada = signal<number | null>(null);
  readonly productosFiltrados = computed(() => {
    const categoriaId = this.categoriaSeleccionada();
    return categoriaId === null
      ? []
      : this.productosServicio
          .productos()
          .filter((producto) => producto.categoriaId === categoriaId);
  });

  nombre = '';
  idEnEdicion: number | null = null;
  mensaje: string | null = null;
  mensajeFavorito: string | null = null;

  guardar(): void {
    const fueGuardada = this.idEnEdicion === null
      ? this.categoriasServicio.crear(this.nombre) !== null
      : this.categoriasServicio.actualizar(this.idEnEdicion, this.nombre);

    if (!fueGuardada) {
      this.mensaje = 'Indica un nombre único para la categoría.';
      return;
    }

    this.mensaje = this.idEnEdicion === null
      ? 'Categoría registrada correctamente.'
      : 'Categoría actualizada correctamente.';
    this.cancelarEdicion();
  }

  editar(id: number, nombre: string): void {
    this.idEnEdicion = id;
    this.nombre = nombre;
  }

  eliminar(id: number): void {
    this.categoriasServicio.eliminar(id);
    if (this.categoriaSeleccionada() === id) this.categoriaSeleccionada.set(null);
    if (this.idEnEdicion === id) this.cancelarEdicion();
    this.mensaje = 'Categoría eliminada. Sus productos quedaron sin categoría.';
  }

  cancelarEdicion(): void {
    this.idEnEdicion = null;
    this.nombre = '';
  }

  seleccionar(id: number): void {
    this.categoriaSeleccionada.set(
      this.categoriaSeleccionada() === id ? null : id
    );
  }

  alAgregarFavorito(producto: Producto): void {
    this.mensajeFavorito = `${producto.nombre} se agregó a tus favoritos.`;
  }
}
