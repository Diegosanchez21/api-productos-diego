import { Component, inject } from '@angular/core';
import { MessageModule } from 'primeng/message';
import { Producto } from '../../modelos/producto';
import { TarjetaProducto } from '../../compartidos/tarjeta-producto/tarjeta-producto';
import { ProductosServicio } from '../../servicios/productos';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [TarjetaProducto, MessageModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class Productos {
  private readonly productosServicio = inject(ProductosServicio);
  readonly productos = this.productosServicio.obtenerProductos();

  mensajeFavorito: string | null = null;

  alAgregarFavorito(producto: Producto): void {
    this.mensajeFavorito = `${producto.nombre} se agregó a tus favoritos.`;
  }
}
