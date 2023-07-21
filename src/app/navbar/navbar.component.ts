import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CarritoModel } from '../shared/carrito.model';
import { CarritoService } from '../shared/carrito.service';
import { ProductoModel } from '../shared/producto.model';
import { ProductoService } from '../shared/producto.service';
import { ProductosCarritoService } from '../shared/productos-carrito.service';
import { ProductosCarritoModel } from '../shared/productos_carrito.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  carrito: Observable<CarritoModel[]> | undefined;
  prodInCart: ProductoModel[] = [];
  prodsActualizar: any[] = [];
  prod = new ProductoModel("", "", 0, 0, "", "", "");
  productoCarritoActualizar = new ProductosCarritoModel("", "", "", 0, 0, this.prod);
  cantidadActualizar: number = 1;
  carritoInfo = new CarritoModel("", "", 0, "");
  carritoActualizar = new CarritoModel("", "", 0, "");
  productosEnCarrito: Observable<ProductosCarritoModel[]> | undefined;

  total_en_carrito: number = 0;
  categorias = ["Frutas frescas", "Verduras frescas", "Hierbas y especias", "Frutos secos y semillas", "Exoticos y tropicales","Tubérculos y hortalizas"];
  // valorTotalAntes: number = 0;
  // valorParcial: number = 0;
  // precioProd: number = 0;
  // valorParcialNuevo: number = 0;
  // valorTotalNueva: number = 0;


  constructor(private carritoService: CarritoService, private productosCarritoService: ProductosCarritoService, private productoService: ProductoService) { }

  ngOnInit() {
    const idCarritoSesion = sessionStorage.getItem("idCarritoS");
    console.log(idCarritoSesion);
    if (idCarritoSesion) {
      this.carrito = this.carritoService.obtenerCarritoByID(idCarritoSesion);
      this.carrito.subscribe(data => {
        this.carritoInfo = data[0];
      });

      this.productosEnCarrito = this.productosCarritoService.obtenerProductosByIDCarrito(idCarritoSesion);
      this.productosCarritoService.obtenerProductosByIDCarrito(idCarritoSesion).subscribe((productos) => {
        this.total_en_carrito = productos.length;
      });;

    }
  }


  obtenerProductosDeCarrito() {
    const idCarrito = sessionStorage.getItem("idCarritoS");
    if (idCarrito) {
      this.productosEnCarrito = this.productosCarritoService.obtenerProductosByIDCarrito(idCarrito);
    }

  }

  actualizar_cantidad(cantidad: number, productoCarrito: ProductosCarritoModel) {
    ///cantidad es para calcular el valor parcial
    //productocarrito es el producto en carrito que se actualiza en cantidad y precio
    // const cantidad=parseInt(numero);
    const idCarritoS = sessionStorage.getItem('idCarritoS');
    const idCarritoL = localStorage.getItem('idCarritoL');

    if (idCarritoS) {
      let valorTotalAntes = 0;
      let valorParcial;
      console.log(idCarritoS, idCarritoL, "carrito id:");

      console.log(`Cantidad a elegir: ${cantidad} - ${typeof (cantidad)}`);
      console.log(`prodddd: `);
      console.log(productoCarrito);///vvv

      this.carritoService.obtenerCarritoByID(idCarritoS).subscribe(data => {
        this.carritoActualizar = data[0];
        console.log("Dats del carrito antes:");//vv
        console.log(this.carritoActualizar);//
        valorTotalAntes = +this.carritoActualizar.valor_total;
        console.log(`Valor total de carrito antes: ${valorTotalAntes}, ${typeof (valorTotalAntes)}`);///vv
        //Vamos aobtener el precio parcial que tenia el producto a actualizar
        console.log("Producto a actualizar");
        console.log(productoCarrito.idProductoCarrito);

        this.productosCarritoService.obtenerProductoCarrito(productoCarrito.idProductoCarrito).subscribe(data => {
          valorParcial = +data.valor_parcial;
          valorTotalAntes = valorTotalAntes - valorParcial;
          console.log("Valor parcial y antes", valorParcial, valorTotalAntes);//vv

          ///vamos aobtener el precio del producto a actualizar
          let precioProd = 0;
          this.productoService.obtenerProducto(productoCarrito.ProductoId).subscribe(data => {
            precioProd = data[0].precio;

            console.log("precio del producto seleccionado", precioProd);
            //Calculamos el nuevo precio del producto en carrito
            let valorParcialNuevo = cantidad * precioProd;
            console.log("Val parc nuevo", valorParcialNuevo);
            //Calculamos el nuevo valor total del carrito
            let valorTotalNueva = valorTotalAntes + valorParcialNuevo;
            console.log("Val total nuevo", valorTotalNueva);

            this.carritoActualizar.valor_total = valorTotalNueva;

            this.productoCarritoActualizar.idProductoCarrito = productoCarrito.idProductoCarrito;
            this.productoCarritoActualizar.CarritoId = idCarritoS;
            this.productoCarritoActualizar.ProductoId = productoCarrito.ProductoId;
            this.productoCarritoActualizar.cantidad = cantidad;
            this.productoCarritoActualizar.valor_parcial = valorParcialNuevo;

            console.log("Datos del producto a llenar", this.productoCarritoActualizar);
            console.log(this.productoCarritoActualizar);
            console.log("Datos a actualizar en carrito");
            console.log(this.carritoActualizar);

            this.productosCarritoService.actualizarProductoACarrito(this.productoCarritoActualizar).subscribe(data => {
              console.log(data);

              this.carritoService.actualizarCarrito(this.carritoActualizar).subscribe(data => {
                console.log(data);

                alert("Se ha actualizado correctamente el producto en carrito.");
                window.location.reload(); // Recargar la página

              });
            });
          });
        });

      }, error => {
        console.log(error);
      });
    }
  }

  eliminar_producto(producto: ProductosCarritoModel) {
    const idCarritoS = sessionStorage.getItem('idCarritoS');
    if (idCarritoS) {
      let valor_parcial = producto.valor_parcial;
      let valorTotalAntes;
      this.carritoService.obtenerCarritoByID(idCarritoS).subscribe(data => {
        this.carritoActualizar = data[0];
        console.log("Nuevo carrito");
        console.log(data[0]);
        valorTotalAntes = +this.carritoActualizar.valor_total - valor_parcial;
        console.log(valorTotalAntes);
        this.carritoActualizar.valor_total = valorTotalAntes;
        this.carritoService.actualizarCarrito(this.carritoActualizar).subscribe(data => {
          console.log(data);
          this.productosCarritoService.eliminarProductoDeCarrito(producto.idProductoCarrito).subscribe(() => {
            alert("Se elimino");
            console.log("Registro eliminado correctamente");

            window.location.reload();
          });
        });
      });
    }

  }

  vaciar_carrito() {
    const idCarritoS = sessionStorage.getItem('idCarritoS');
    if (idCarritoS) {
      this.carritoService.obtenerCarritoByID(idCarritoS).subscribe(data => {
        this.carritoActualizar = data[0];
        console.log("Nuevo carrito");
        console.log(data[0]);
        this.carritoActualizar.valor_total = 0;
        this.carritoService.actualizarCarrito(this.carritoActualizar).subscribe(data => {
          console.log(data);
          this.productosCarritoService.eliminarTodosProductosCarrito(idCarritoS).subscribe(() => {
            console.log("Registro eliminado correctamente");
            alert("Se elimino");
            window.location.reload();
          });
        });
      });
    }

  }
}