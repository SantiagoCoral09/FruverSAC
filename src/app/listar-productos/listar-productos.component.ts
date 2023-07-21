import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProductoModel } from '../shared/producto.model';
import { ProductoService } from '../shared/producto.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-listar-productos',
  templateUrl: './listar-productos.component.html',
  styleUrls: ['./listar-productos.component.css']
})
export class ListarProductosComponent implements OnInit {
  productos: Observable<ProductoModel[]> | undefined;
  currentPage = 1;///para mostrar la primera pagina
  itemsPerPage = 10;///mostrar 10 registros en cada pagina
  totalPages: number[] = [];///almacenar el numero de paginas que saldran
  totalProductos = 0;
  categoria=''

  ///Para mostrar el modal
  mostrarModal: boolean = false;
  productoSeleccionado: ProductoModel | undefined;
  cantidad: number = 1;
  abrirModal(producto: ProductoModel) {
    console.log(producto);
    this.productoSeleccionado = producto;
    this.mostrarModal = true;
  }

  constructor(private productoService: ProductoService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.obtenerProductosPaginados();
  }

  obtenerProductosPaginados() {
    const categoria = this.route.snapshot.paramMap.get('categoria');
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    if (categoria) {
    this.categoria=categoria;

      this.productoService.obtenerProductosByCategoria(categoria).subscribe((productos) => {
        this.productos = of(productos.slice(startIndex, endIndex));
        this.totalPages = this.calculateTotalPages(productos.length);
        this.totalProductos = productos.length;
      });
    } else {
      this.productoService.obtenerProductos().subscribe((productos) => {
        this.productos = of(productos.slice(startIndex, endIndex));
        this.totalPages = this.calculateTotalPages(productos.length);
        this.totalProductos = productos.length;
      });
    }

  }

  calculateTotalPages(totalItems: number): number[] {
    const totalPages = Math.ceil(totalItems / this.itemsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  gotoPage(page: number) {
    this.currentPage = page;
    this.obtenerProductosPaginados();
  }

  borrarProducto(idProducto: string) {
    this.productoService.borrarProducto(idProducto).subscribe(() => {
      console.log("Registro eliminado correctamente");
      this.obtenerProductosPaginados();
    });
  }
}
