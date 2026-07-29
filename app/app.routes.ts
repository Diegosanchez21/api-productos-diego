import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./paginas/inicio/inicio').then((archivo) => archivo.Inicio)
  },
  {
    path: 'productos',
    loadComponent: () =>
      import('./paginas/productos/productos').then((archivo) => archivo.Productos)
  },
  {
    path: 'productos/:id',
    loadComponent: () =>
      import('./paginas/detalle-producto/detalle-producto').then(
        (archivo) => archivo.DetalleProducto
      )
  },
  {
    path: 'favoritos',
    loadComponent: () =>
      import('./paginas/favoritos/favoritos').then((archivo) => archivo.Favoritos)
  },
  {
    path: 'contacto',
    loadComponent: () =>
      import('./paginas/contacto/contacto').then((archivo) => archivo.Contacto)
  },
  {
    path: 'galeria',
    loadComponent: () =>
      import('./paginas/galeria/galeria').then((archivo) => archivo.Galeria)
  },
  {
    path: '**',
    loadComponent: () =>
      import('./paginas/no-encontrado/no-encontrado').then(
        (archivo) => archivo.NoEncontrado
      )
  }
];