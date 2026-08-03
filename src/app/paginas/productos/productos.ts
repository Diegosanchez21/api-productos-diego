import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { Producto } from '../../modelos/producto';
import { TarjetaProducto } from '../../compartidos/tarjeta-producto/tarjeta-producto';
import { ProductosServicio } from '../../servicios/productos';
import { CategoriasServicio } from '../../servicios/categorias';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [TarjetaProducto, MessageModule, FormsModule],
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
  mensajeProducto: string | null = null;
  nombreProducto = '';
  descripcionProducto = '';
  precioProducto: number | null = null;
  categoriaProductoId: number | null = null;
  idProductoEnEdicion: number | null = null;

  alAgregarFavorito(producto: Producto): void {
    this.mensajeFavorito = `${producto.nombre} se agregó a tus favoritos.`;
  }

  seleccionarCategoria(id: number | null): void {
    this.categoriaSeleccionada.set(id);
  }

  guardarProducto(): void {
    if (
      !this.nombreProducto.trim() ||
      !this.descripcionProducto.trim() ||
      this.precioProducto === null ||
      this.precioProducto <= 0 ||
      this.categoriaProductoId === null
    ) {
      this.mensajeProducto = 'Completa nombre, descripción, precio y categoría.';
      return;
    }

    const datos = {
      nombre: this.nombreProducto,
      descripcion: this.descripcionProducto,
      precio: this.precioProducto,
      categoriaId: this.categoriaProductoId
    };
    const esNuevo = this.idProductoEnEdicion === null;
    const solicitud = esNuevo
      ? this.productosServicio.crear(datos)
      : this.productosServicio.actualizar(this.idProductoEnEdicion!, datos);

    solicitud.subscribe({
      next: () => {
        this.mensajeProducto = esNuevo
          ? 'Producto registrado correctamente.'
          : 'Producto actualizado correctamente.';
        this.cancelarEdicionProducto();
        this.categoriasServicio.cargar();
      },
      error: () => this.mensajeProducto = 'No fue posible guardar el producto. Verifica la conexión con la API.'
    });
  }

  editarProducto(producto: Producto): void {
    this.idProductoEnEdicion = producto.id;
    this.nombreProducto = producto.nombre;
    this.descripcionProducto = producto.descripcion;
    this.precioProducto = producto.precio;
    this.categoriaProductoId = producto.categoriaId;
  }

  cancelarEdicionProducto(): void {
    this.idProductoEnEdicion = null;
    this.nombreProducto = '';
    this.descripcionProducto = '';
    this.precioProducto = null;
    this.categoriaProductoId = null;
  }
}
