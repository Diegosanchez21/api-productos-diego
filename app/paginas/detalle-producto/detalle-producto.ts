import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';
import { ProductosServicio } from '../../servicios/productos';

@Component({
  selector: 'app-detalle-producto',
  standalone: true,
  imports: [
    RouterLink,
    ButtonModule,
    CardModule,
    DialogModule,
    MessageModule,
    TagModule
  ],
  templateUrl: './detalle-producto.html',
  styleUrl: './detalle-producto.css'
})
export class DetalleProducto {
  private readonly ruta = inject(ActivatedRoute);
  private readonly productosServicio = inject(ProductosServicio);

  private readonly idProducto = Number(this.ruta.snapshot.paramMap.get('id'));
  readonly producto = this.productosServicio.obtenerProductoPorId(this.idProducto);

  mostrarDialogo = false;
}