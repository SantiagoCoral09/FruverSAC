import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CarritoModel } from './shared/carrito.model';
import { CarritoService } from './shared/carrito.service';
import { ProductosCarritoService } from './shared/productos-carrito.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'FruverFE';
  carrito = new CarritoModel("", "carrito", 0, "");
  

  constructor(private carritoService: CarritoService, private productosCarritoService: ProductosCarritoService) {
    
  }
  ngOnInit() {
    const idCarritoS=sessionStorage.getItem('idCarritoS');
    const idCarritoL=localStorage.getItem('idCarritoL');
    console.log(`Buscando carrito... s:${idCarritoS} l:${idCarritoL}`);
    if(idCarritoS){
      console.log(`Hay un carrito: ${idCarritoS}-${idCarritoL}`);
    }else if(idCarritoL){
      //Si cierra la pagina y quedo en la base de datos un carrito lo vamos a eliminar. Hay que verificar esto al comprar
      console.log("Borrar sesion en local y el carrito en BD:",idCarritoL);
      this.eliminarCarrito(idCarritoL);
      localStorage.removeItem('idCarritoL');
    }else{
      //Crear un carrito
      console.log("No hay carrito en sesiones");
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

  
  eliminarCarrito(idCarrito: string) {
    if(idCarrito){
      this.productosCarritoService.eliminarTodosProductosCarrito(idCarrito).subscribe(()=>{
        this.carritoService.borrarCarrito(idCarrito).subscribe(() => {
          console.log('Carrito eliminado');
        }, error => {
          console.error('Error al eliminar el carrito:', error);
        });
      })
      
    }  }

  ngOnDestroy() {
    const idCarritoS = sessionStorage.getItem('idCarritoS');
    if (idCarritoS) {
      this.eliminarCarrito(idCarritoS);
    }
  }

  
}

