import { HttpErrorResponse } from '@angular/common/http';
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
  readonly errorCarga = this.categoriasServicio.errorCarga;
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
  nombreProducto = '';
  descripcionProducto = '';
  precioProducto: number | null = null;
  idProductoEnEdicion: number | null = null;
  mensajeProducto: string | null = null;

  guardar(): void {
    if (!this.nombre.trim()) {
      this.mensaje = 'Indica un nombre único para la categoría.';
      return;
    }

    const esNueva = this.idEnEdicion === null;
    const solicitud = esNueva
      ? this.categoriasServicio.crear(this.nombre)
      : this.categoriasServicio.actualizar(this.idEnEdicion!, this.nombre);

    solicitud.subscribe({
      next: () => {
        this.mensaje = esNueva
          ? 'Categoría registrada correctamente.'
          : 'Categoría actualizada correctamente.';
        this.cancelarEdicion();
      },
      error: (error) => this.mensaje = this.mensajeDeError(error, 'guardar')
    });
  }

  editar(id: number, nombre: string): void {
    this.idEnEdicion = id;
    this.nombre = nombre;
  }

  eliminar(id: number): void {
    this.categoriasServicio.eliminar(id).subscribe({
      next: () => {
        if (this.categoriaSeleccionada() === id) this.categoriaSeleccionada.set(null);
        if (this.idEnEdicion === id) this.cancelarEdicion();
        this.mensaje = 'Categoría eliminada. Sus productos quedaron sin categoría.';
      },
      error: (error) => this.mensaje = this.mensajeDeError(error, 'eliminar')
    });
  }

  cancelarEdicion(): void {
    this.idEnEdicion = null;
    this.nombre = '';
  }

  seleccionar(id: number): void {
    const categoriaNueva = this.categoriaSeleccionada() === id ? null : id;
    this.categoriaSeleccionada.set(categoriaNueva);
    this.cancelarEdicionProducto();
  }

  alAgregarFavorito(producto: Producto): void {
    this.mensajeFavorito = `${producto.nombre} se agregó a tus favoritos.`;
  }

  guardarProducto(): void {
    const categoriaId = this.categoriaSeleccionada();
    if (categoriaId === null || this.precioProducto === null) return;

    const datos = {
      nombre: this.nombreProducto,
      descripcion: this.descripcionProducto,
      precio: this.precioProducto,
      categoriaId
    };
    const esNuevo = this.idProductoEnEdicion === null;
    const solicitud = esNuevo
      ? this.productosServicio.crear(datos)
      : this.productosServicio.actualizar(this.idProductoEnEdicion!, datos);

    solicitud.subscribe({
      next: () => {
        this.mensajeProducto = esNuevo
          ? 'Producto agregado a la categoría.'
          : 'Producto actualizado correctamente.';
        this.cancelarEdicionProducto();
        this.categoriasServicio.cargar();
      },
      error: (error) => this.mensajeProducto = this.mensajeDeError(error, 'guardar el producto')
    });
  }

  editarProducto(producto: Producto): void {
    this.idProductoEnEdicion = producto.id;
    this.nombreProducto = producto.nombre;
    this.descripcionProducto = producto.descripcion;
    this.precioProducto = producto.precio;
  }

  cancelarEdicionProducto(): void {
    this.idProductoEnEdicion = null;
    this.nombreProducto = '';
    this.descripcionProducto = '';
    this.precioProducto = null;
  }

  private mensajeDeError(error: HttpErrorResponse, accion: string): string {
    if (error.status === 409) return 'Ya existe una categoría con ese nombre.';
    if (error.status === 404) return 'La API publicada no tiene la ruta requerida. Debe redeplegarse el backend.';
    if (error.status === 0) return 'No fue posible conectar con la API. Revisa CORS y la URL del backend.';
    return `No fue posible ${accion}. Inténtalo nuevamente.`;
  }
}
