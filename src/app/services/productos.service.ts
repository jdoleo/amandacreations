import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../interfaces/producto.interface';


@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  cargando = true;
  productos: Producto[] = [];
  productosFiltrado: Producto[] = [];

  constructor(private http: HttpClient) {
    this.cargarProductos();
  }

  private cargarProductos() {

    return new Promise( ( resolve, reject ) => {
      this.http.get('https://angular-html-f6acd.firebaseio.com/productos_idx.json')
      .subscribe( (resp: Producto[] ) => {
      this.productos = resp;
      this.cargando = false;
      resolve();
      });
    } );
  }

  getProducto( id: string) {
    return this.http.get(`https://angular-html-f6acd.firebaseio.com/productos/${ id }.json`);
  }

  buscarProducto( termino: string ) {

    if ( this.productos.length === 0 ) {
      // Cargar productos
      this.cargarProductos().then( () => {
        // Ejecutar despues de tener los productos
        // Aplicar filtro
        this.filtrarProductos( termino );
      } );
    } else {
      // Aplicar filtro
      this.filtrarProductos( termino );
    }
  }

  filtrarProductos(termino: string) {
    this.productosFiltrado = [];
    termino = termino.toLowerCase();

    this.productos.forEach(prod => {
      const TITULO_LOWER = prod.titulo.toLowerCase();
      if ( prod.categoria.indexOf( termino ) >= 0 || TITULO_LOWER.indexOf( termino ) >= 0 ) {
        this.productosFiltrado.push( prod ); // agrego el elemento al arreglo
      }
    });
  }
}
