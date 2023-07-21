import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CarritoModel } from '../shared/carrito.model';
import { CarritoService } from '../shared/carrito.service';
import { ProductoModel } from '../shared/producto.model';
import { ProductoService } from '../shared/producto.service';
import { ProductosCarritoService } from '../shared/productos-carrito.service';
import { ProductosCarritoModel } from '../shared/productos_carrito.model';


@Component({
  selector: 'app-mostrar-productos',
  templateUrl: './mostrar-productos.component.html',
  styleUrls: ['./mostrar-productos.component.css']
})


export class MostrarProductosComponent implements OnInit {

  productos: Observable<ProductoModel[]> | undefined;

  currentPage = 1;///para mostrar la primera pagina
  itemsPerPage = 10;///mostrar 10 registros en cada pagina
  totalPages = 0;///almacenar el numero de paginas que saldran
  totalProductos = 0;
  paginas: number[] = [];///almacenar el numero de paginas que saldran

  ///Para mostrar el modal
  mostrarModal: boolean = false;
  productoSeleccionado: ProductoModel | undefined;
  cantidad: number = 1;

  //Para agregar un carrito a la BD
  // valorTotal = 0;
  carrito = new CarritoModel("", "prueba", 0, "");
  product=new ProductoModel("","",0,0,"","","");
  productoCarrito = new ProductosCarritoModel("", "", "", 0, 0,this.product);
  // productoCarrito = new ProductosCarritoModel("", "", "", 0, 0,"",0,0,"","","");

  constructor(private carritoService: CarritoService, private productoService: ProductoService, private productosCarritoService: ProductosCarritoService) { }

  ngOnInit() {
    this.obtenerProductosPaginados();
  }

  obtenerProductosPaginados() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.productoService.obtenerProductos().subscribe((productos) => {
      this.productos = of(productos.slice(startIndex, endIndex));
      this.paginas = this.calcularPaginas(productos.length);
      this.totalProductos = productos.length;
      this.totalPages = Math.ceil(this.totalProductos / this.itemsPerPage);
    });
  }
  calcularPaginas(totalItems: number): number[] {
    ///guardar en un arreglo para hacer un ngFor en html
    const no_paginas = Math.ceil(totalItems / this.itemsPerPage);
    return Array.from({ length: no_paginas }, (_, i) => i + 1);;
  }

  gotoPage(page: number) {
    this.currentPage = page;
    this.obtenerProductosPaginados();
  }

  /////Mostrar modal con detalles del producto
  abrirModal(producto: ProductoModel) {
    console.log(producto);
    // console.log(producto.precio);
    this.productoSeleccionado = producto;
    this.mostrarModal = true;
  }
  // cerrarModal() {
  //   this.productoSeleccionado = undefined;
  //   // this.mostrarModal = false;
  // }

  //Crear un carrito
  crearCarrito() {
    const idCarritoS = sessionStorage.getItem('idCarritoS');
    const idCarritoL = localStorage.getItem('idCarritoL');
    // Obtener el idCarrito de sessionStorage
    console.log("id en sesion: ", idCarritoS, idCarritoL);

    if (idCarritoS && idCarritoL) {
      // Si ya existe un idCarrito en sessionStorage y localStorage
      console.log("Ya hay carrito:", idCarritoS, idCarritoL);
      this.carritoService.obtenerCarritoByID(idCarritoS).subscribe(data => {
        this.carrito = data[0];
        console.log("Dats del  carrito:");
        console.log(this.carrito);
      }, error => {
        console.log(error);
      });
    } else {
      // Si no existe un idCarrito en sessionStorage, crear uno nuevo
      console.log("Nuevo carrito");
      this.carritoService.agregarCarrito(this.carrito).subscribe(data => {
        console.log("Datos nuevo cart");
        this.carrito = data;
        console.log(this.carrito);
        const newIdCarrito = data.idCarrito;
        // Obtener el nuevo idCarrito generado en la base de datos
        sessionStorage.setItem('idCarritoS', newIdCarrito);
        localStorage.setItem('idCarritoL', newIdCarrito);
        // Guardar el nuevo idCarrito en sessionStorage
        console.log(`Sesion:${sessionStorage.getItem("idCarritoS")}, local: Sesion:${localStorage.getItem("idCarritoL")}`);
        // this.router.navigate(['/']);
      });
    }
  }


  ///Agregar los productos al carrito
  agregarAlCarrito(producto: ProductoModel, cantidad: number) {
    const idCarritoS = sessionStorage.getItem('idCarritoS');
    const idCarritoL = localStorage.getItem('idCarritoL');

    if (idCarritoS && idCarritoL) {
      console.log(idCarritoS, idCarritoL, "producto agregado:");
      console.log(producto);
      console.log(`Cantidad a elegir: ${cantidad} - ${typeof (cantidad)}`);

      this.carritoService.obtenerCarritoByID(idCarritoS).subscribe(data => {

        this.carrito = data[0];
        console.log("Dats del  carrito:");
        console.log(this.carrito);
        let valorTotal = +this.carrito.valor_total;
        // valorTotal=+valorTotal;
        console.log("Carrito actual:", this.carrito);
        valorTotal += cantidad * producto.precio;
        console.log(valorTotal, typeof (valorTotal));
        this.carrito.valor_total = valorTotal;
        console.log(producto.precio, typeof (producto.precio));

        console.log("Carrito editar:", this.carrito);




        this.productosCarritoService.obtenerProductoCarritoByProduct(producto.idProducto).subscribe(data => {
          if (data) {
            //Hay que actualizar la cantidad en uno ya existente
            console.log("Ya hay de ese producto");
            console.log(data);
            this.productoCarrito = data;
            let valorTotalAntes = 0;
            let valorParcial;
            // valorTotalAntes = +this.carrito.valor_total;
            valorParcial = +data.valor_parcial;
            // valorTotalAntes = valorTotalAntes - valorParcial;
            ///vamos aobtener el precio del producto a actualizar
            let precioProd = producto.precio;
            let valorParcialNuevo = valorParcial+cantidad * precioProd;

            this.productoCarrito.idProductoCarrito = data.idProductoCarrito;
            this.productoCarrito.CarritoId = idCarritoS;
            this.productoCarrito.ProductoId = producto.idProducto;
            this.productoCarrito.cantidad += cantidad;
            this.productoCarrito.valor_parcial = valorParcialNuevo;
            console.log("Datos a llenar", this.productoCarrito);
            this.carritoService.actualizarCarrito(this.carrito).subscribe(data => {
              console.log(data);
              this.productosCarritoService.actualizarProductoACarrito(this.productoCarrito).subscribe(data => {
                console.log(data);
                alert("Se ha añadido correctamente el producto al carrito.");
                window.location.reload(); // Recargar la página
              });


            });



          } else {
            //se agrega el producto al carrito
            this.productoCarrito.CarritoId = idCarritoS;
            this.productoCarrito.ProductoId = producto.idProducto;
            this.productoCarrito.cantidad = cantidad;
            this.productoCarrito.valor_parcial = cantidad * producto.precio;

            console.log("Datos a llenar", this.productoCarrito);
            console.log(this.productoCarrito);
            console.log(this.carrito);

            this.carritoService.actualizarCarrito(this.carrito).subscribe(data => {
              console.log(data);
              this.productosCarritoService.agregarProductoACarrito(this.productoCarrito, idCarritoS).subscribe(data => {
                console.log(data);
                alert("Se ha añadido correctamente el producto al carrito.");
                window.location.reload(); // Recargar la página
              });


            });
          }
        });
      }, error => {
        console.log(error);
      });

    }
  }
  ////
  eliminarCarrito() {
    const idCarrito = sessionStorage.getItem('idCarritoS');
    const idCarritoL = localStorage.getItem('idCarritoL');

    if (idCarrito && idCarritoL) {
      this.productosCarritoService.eliminarTodosProductosCarrito(idCarrito).subscribe(() => {
        this.carritoService.borrarCarrito(idCarrito).subscribe(() => {
          console.log('Carrito eliminado');
        }, error => {
          console.error('Error al eliminar el carrito:', error);
        });
        window.location.reload(); // Recargar la página
      })
      sessionStorage.removeItem('idCarritoS');
      localStorage.removeItem('idCarritoL');
    }

  }

}
